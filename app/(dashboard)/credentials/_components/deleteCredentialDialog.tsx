'use client'
import { DeleteCredential } from '@/actions/credentials/deleteCredential'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface Props {
    name: string
}

function DeleteCredentialDialog({ name }: Props) {
    const [confirmText, setConfirmText] = useState('')
    const [open, setOpen] = useState(false)

    const deleteMutation = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            toast.success('Credential deleted successfully', { id: name })
            setConfirmText('')
        },
        onError: () => {
            toast.error('Failed to delete Credential', { id: name })
        },
    })
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'destructive'} size={'icon'}>
                    <XIcon size={18} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the Credential and all its associated data.
                        <div className="flex flex-col py-4 gap-2">
                            <p>If you are sure, enter <b>{name}</b> to confirm:</p>
                            <Input placeholder={name} value={confirmText} onChange={e => setConfirmText(e.target.value)} />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText('')}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={confirmText !== name || deleteMutation.isPending}
                    className='bg-destructive text-desructive-foreground hover:bg-destructive/90'
                    onClick={() => {
                        toast.loading('Deleting Credential...', { id: name })
                        deleteMutation.mutate(name)
                    }}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteCredentialDialog