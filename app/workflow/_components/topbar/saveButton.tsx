'use client'

import { UpdateWorkflow } from '@/actions/workflows/updateWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function SaveButton({ workflowId }: { workflowId: string }) {
    const { toObject } = useReactFlow()
    const saveMutation = useMutation({
        mutationFn: UpdateWorkflow,
        onSuccess: () => {
            toast.success('Workflow saved successfully', { id: 'workflow-save' })
        },
        onError: () => {
            toast.error('Failed to save workflow', { id: 'workflow-save' })
        }
    })
    return (
        <Button
            disabled={saveMutation.isPending}
            variant={'outline'}
            className='flex items-center gap-2'
            onClick={() => {
                const workflowDefinition = JSON.stringify(toObject())
                toast.loading('Saving workflow...', { id: 'workflow-save' })
                saveMutation.mutate({
                    id: workflowId,
                    definition: workflowDefinition
                })
            }}
        >
            <CheckIcon size={16} className='stroke-green-400' />
            Save
        </Button>
    )
}

export default SaveButton