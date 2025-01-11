'use client'

import { PurchaseCredits } from '@/actions/billing/purchaseCredits'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { creditsPacks, PackId } from '@/types/billing'
import { useMutation } from '@tanstack/react-query'
import { CoinsIcon, CreditCard } from 'lucide-react'
import React, { useState } from 'react'

function CreditsPurchase() {
    const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM)
    const mutation = useMutation({
        mutationFn: PurchaseCredits,
        onSuccess: () => {},
        onError: () => {}
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <CoinsIcon className='h-6 w-6 text-primary' />
                    Purchase Credits
                </CardTitle>
                <CardDescription>
                    Select the amount of credits you would like to purchase.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup onValueChange={value => setSelectedPack(value as PackId)} value={selectedPack}>
                    {creditsPacks.map(pack => (
                        <div
                            key={pack.id}
                            className='flex items-center space-x-3 bg-secondary/50 p-3 rounded-lg hover:bg-secondary'
                            onClick={() => setSelectedPack(pack.id)}
                        >
                            <RadioGroupItem value={pack.id} id={pack.id} />
                            <Label className='flex justify-between cursor-pointer w-full'>
                                <span className='font-medium'>
                                    {pack.name} - {pack.label}
                                </span>
                                <span className='font-bold text-primary'>
                                    {(pack.price / 100).toFixed(2)} INR
                                </span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter>
                <Button
                    className='w-full'
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(selectedPack)}
                >
                    <CreditCard className='h-5 w-5 mr-2' />
                    Purchase Credits
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreditsPurchase