'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import { CoinsIcon } from 'lucide-react'
import React from 'react'

function TaskMenu() {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion
                type='multiple'
                className='w-full'
                defaultValue={['extraction', 'interactions', 'timing', 'results', 'storage']}
            >
                <AccordionItem value='interactions'>
                    <AccordionTrigger className='font-bold'>
                        User Interactions
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuButton taskType={TaskType.FILL_INPUT} />
                        <TaskMenuButton taskType={TaskType.CLICK_ELEMENT} />
                        <TaskMenuButton taskType={TaskType.NAVIGATE_URL} />
                        <TaskMenuButton taskType={TaskType.SCROLL_TO_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='extraction'>
                    <AccordionTrigger className='font-bold'>
                        Data Extraction
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
                        <TaskMenuButton taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                        <TaskMenuButton taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='storage'>
                    <AccordionTrigger className='font-bold'>
                        Data Storage
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuButton taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                        <TaskMenuButton taskType={TaskType.ADD_PROPERTY_TO_JSON} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='timing'>
                    <AccordionTrigger className='font-bold'>
                        Timing Controls
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuButton taskType={TaskType.WAIT_FOR_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='results'>
                    <AccordionTrigger className='font-bold'>
                        Result Delivery
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuButton taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    )
}

function TaskMenuButton({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType]
    const onDragStart = (e: React.DragEvent, type: TaskType) => {
        e.dataTransfer.setData('application/reactflow', type)
        e.dataTransfer.effectAllowed = 'move'
    }
    return (
        <Button
            variant={'secondary'}
            draggable
            className='flex justify-between items-center gap-2 border w-full'
            onDragStart={(e) => onDragStart(e, taskType)}
        >
            <div className='flex gap-2'>
                <task.icon size={20} />
                {task.label}
            </div>
            <Badge variant={'outline'} className='flex items-center gap-2'>
                <CoinsIcon size={16} />
                {task.credits}
            </Badge>
        </Button>
    )
}

export default TaskMenu