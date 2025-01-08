'use client'

import CustomDialogHeader from '@/components/customDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, ShieldEllipsis } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CreateCredentialSchema, createCredentialSchemaType } from '@/schema/credentials'
import { CreateCredential } from '@/actions/credentials/createCredential'

function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false)

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(CreateCredentialSchema),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            toast.success('Credential created successfully', { id: 'create-credential' })
        },
        onError: () => {
            toast.error('Failed to create credential', { id: 'create-credential' })
        }
    })

    const onSubmit = useCallback((values: createCredentialSchemaType) => {
        toast.loading('Creating credential...', { id: 'create-credential' })
        mutate(values)
    }, [mutate])

    return (
        <Dialog open={open} onOpenChange={(open) => {
            form.reset();
            setOpen(open)}}>
            <DialogTrigger asChild>
                <Button>{triggerText ?? 'Create'}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader icon={ShieldEllipsis} title='Create credential' />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} name='name' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='felx items-center gap-1'>
                                        Name
                                        <p className='text-xs text-primary'>(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a unique and descriptive name for your credential <br/>
                                        This will help you identify this credential in the future.
                                    </FormDescription>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name='value' render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='felx items-center gap-1'>
                                        Value
                                        <p className='text-xs text-primary'>(required)</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea className='resize-none' {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the value of your credential <br/>
                                        This value will be encrypted and stored securely.
                                    </FormDescription>
                                </FormItem>
                            )}/>
                            <Button type='submit' className='w-full' disabled={isPending}>
                                {!isPending ? 'Proceed' : <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCredentialDialog