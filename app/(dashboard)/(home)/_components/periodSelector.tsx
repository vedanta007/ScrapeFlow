'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Period } from '@/types/analytics'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const

function PeriodSelector({ periods, selectedPeriod }: { periods: Period[], selectedPeriod: Period }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <Select
            value={`${selectedPeriod.month}-${selectedPeriod.year}`}
            onValueChange={value => {
                const [month, year] = value.split('-')
                const params = new URLSearchParams(searchParams)
                params.set('month', month)
                params.set('year', year)
                router.push(`?${params.toString()}`)
            }}
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {periods.map((period, index) => (
                    <SelectItem key={index} value={`${period.month}-${period.year}`}>
                        {monthNames[period.month]} {period.year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default PeriodSelector