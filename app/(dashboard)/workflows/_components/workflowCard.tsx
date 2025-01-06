'use client'

import TooltipWrapper from '@/components/tooltipWrapper'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow'
import { Workflow } from '@prisma/client'
import { ChevronRightIcon, CoinsIcon, CornerDownRight, FileTextIcon, MoreVerticalIcon, MoveRightIcon, PlayIcon, ShuffleIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import DeleteWorkflowDialog from './deleteWorkflowDialog'
import RunButton from './runButton'
import SchedulerDialog from './schedulerDialog'
import { Badge } from '@/components/ui/badge'
import ExecutionStatusIndicator from '@/app/workflow/runs/[workflowId]/_components/executionStatusIndicator'
import { formatDistanceToNow } from 'date-fns'

const statusColors = {
    [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
    [WorkflowStatus.PUBLISHED]: 'bg-primary',
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const isDraft = workflow.status === WorkflowStatus.DRAFT
    return (
        <Card className='border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30'>
            <CardContent className='flex items-center p-4 justify-between h-[100px]'>
                <div className='flex items-center justify-end space-x-3'>
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', statusColors[workflow.status as WorkflowStatus])}>
                        {isDraft ? <FileTextIcon className='h-5 w-5'/> : <PlayIcon className='h-5 w-5 text-white'/>}
                    </div>
                    <div>
                        <h3 className='text-base font-bold text-muted-foreground flex items-center'>
                            <Link href={`/workflow/editor/${workflow.id}`} className='flex items-center hover:underline'>
                                {workflow.name}
                            </Link>
                            {isDraft && (
                                <span className='text-xs ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 font-medium rounded-full'>
                                    Draft
                                </span>
                            )}
                        </h3>
                        <ScheduleSection
                            isDraft={isDraft}
                            creditsCost={workflow.creditsCost}
                            workflowId={workflow.id}
                            cron={workflow.cron}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isDraft && (
                        <RunButton workflowId={workflow.id} />
                    )}
                    <Link href={`/workflow/editor/${workflow.id}`} className={cn(buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                    }), 'flex items-center gap-2')}>
                        <ShuffleIcon size={16} />
                        Edit
                    </Link>
                    <WorkflowActions workflowName={workflow.name} workflowId={workflow.id} />
                </div>
            </CardContent>
            <LastRunDetails workflow={workflow} />
        </Card>
    )
}

function WorkflowActions({ workflowName, workflowId }: { workflowName: string, workflowId: string }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    return (
        <>
            <DeleteWorkflowDialog open={showDeleteDialog} setOpen={setShowDeleteDialog} workflowName={workflowName} workflowId={workflowId} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'outline'} size={'sm'}>
                        <TooltipWrapper content={'More actions'}>
                            <div className='flex items-center justify-center w-full h-full'>
                                <MoreVerticalIcon size={18} />
                            </div>
                        </TooltipWrapper>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive flex items-center gap-2' onSelect={() => setShowDeleteDialog(prev => !prev)}>
                        <Trash2Icon size={16} />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function ScheduleSection({
    isDraft,
    creditsCost,
    workflowId,
    cron
}: {
    isDraft: boolean,
    creditsCost: number,
    workflowId: string,
    cron: string | null
}) {
    if(isDraft) {
        return null
    }
    return (
        <div className='flex items-center gap-2'>
            <CornerDownRight className='h-4 w-4 text-muted-foreground' />
            <SchedulerDialog workflowId={workflowId} cron={cron} key={`${cron}-${workflowId}`} />
            <MoveRightIcon className='h-4 w-4 text-muted-foreground' />
            <TooltipWrapper content='Credit consumption for full run'>
                <div className="flex items-center gap-3">
                    <Badge variant={'outline'} className='space-x-2 text-muted-foreground rounded-sm'>
                        <CoinsIcon className='h-4 w-4' />
                        <span className='text-sm'>{creditsCost}</span>
                    </Badge>
                </div>
            </TooltipWrapper>
        </div>
    )
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
    const { lastExecutionAt, lastExecutionStatus, lastExecutionId } = workflow
    const formattedStartedAt = lastExecutionAt && formatDistanceToNow(lastExecutionAt, { addSuffix: true })

    return (
        <div className='bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground'>
            <div className='flex items-center text-sm gap-2'>
                {lastExecutionAt && (
                    <Link href={`/workflow/runs/${workflow.id}/${lastExecutionId}`} className='flex items-center text-sm gap-2 group'>
                        <span>Last run:</span>
                        <ExecutionStatusIndicator status={lastExecutionStatus as WorkflowExecutionStatus} />
                        <span>{lastExecutionStatus}</span>
                        <span>{formattedStartedAt}</span>
                        <ChevronRightIcon size={14} className='-translate-x-[2px] group-hover:translate-x-0 transition' />
                    </Link>
                )}
                {!lastExecutionAt && 
                    <p>No runs yet</p>
                }
            </div>
        </div>
    )
}

export default WorkflowCard