'use client'

import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import CustomDialogHeader from '@/components/customDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Calendar1Icon, TriangleAlertIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

function SchedulerDialog({ workflowId }: { workflowId: string }) {
    const [cron, setCron] = useState('')

    const mutation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success('Workflow scheduled successfully', { id: 'cron' })
        },
        onError: () => {
            toast.error('Failed to schedule workflow', { id: 'cron' })
        }
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'link'} size={'sm'} className={cn('text-sm p-0 h-auto')}>
                    <div className='flex items-center gap-1'>
                        <TriangleAlertIcon className='h-3 w-3' /> Set schedule
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader title='Schedule workflow execution' icon={Calendar1Icon} />
                <div className="p-6 space-y-4">
                    <p className='text-sm text-muted-foreground'>
                        Specify a cron expression to schedule the periodic execution of this workflow. All times are in UTC.
                    </p>
                    <Input placeholder='E.g. * * * * *' value={cron} onChange={e => setCron(e.target.value)} />
                </div>
                <DialogFooter className='px-6 gap-2'>
                    <DialogClose asChild>
                        <Button className='w-full' variant={'secondary'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            className='w-full'
                            disabled={mutation.isPending}
                            onClick={() => {
                                toast.loading('Saving...', { id: 'cron' })
                                mutation.mutate({ id: workflowId, cron })
                            }}
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SchedulerDialog