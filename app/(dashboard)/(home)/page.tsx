import { GetPeriods } from '@/actions/analytics/getPeriods'
import React, { Suspense } from 'react'
import PeriodSelector from './_components/periodSelector'
import { Period } from '@/types/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { GetStatsCardsValues } from '@/actions/analytics/getStatsCardsValues'
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react'
import StatsCardItem from './_components/statsCardItem'
import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import ExecutionStatusChart from './_components/executionStatusChart'
import { GetCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import CreditsUsageChart from '../billing/_components/creditsUsageChart'

function HomePage({ searchParams }: { searchParams: { month?: string, year?: string } }) {
    const currentDate = new Date()
    const { month, year } = searchParams
    const period: Period = {
        year: year ? parseInt(year) : currentDate.getFullYear(),
        month: month ? parseInt(month) : currentDate.getMonth(),
    }

    return (
        <div className='flex flex-1 flex-col h-full'>
            <div className='flex justify-between'>
                <h1 className='text-3xl font-bold'>Home</h1>
                <Suspense fallback={<Skeleton className='w-[180px] h-[40px]' />}>
                    <PeriodSelectorWrapper selectedPeriod={period} />
                </Suspense>
            </div>
            <div className="h-full py-6 flex flex-col gap-4">
                <Suspense fallback={<StatsCardSkeleton />}>
                    <StatsCard selectedPeriod={period} />
                </Suspense>
                <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
                    <StatsExecutionStatus selectedPeriod={period} />
                </Suspense>
                <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
                    <CreditsUsageInPeriod selectedPeriod={period} />
                </Suspense>
            </div>
        </div>
    )
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
    const periods = await GetPeriods()
    return (
        <PeriodSelector selectedPeriod={selectedPeriod} periods={periods} />
    )
}

async function StatsCard({ selectedPeriod }: { selectedPeriod: Period }) {
    const data = await GetStatsCardsValues(selectedPeriod)
    return (
        <div className='grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]'>
            <StatsCardItem title='Workflow Executions' value={data.workflowExecutions} icon={CirclePlayIcon} />
            <StatsCardItem title='Phase Executions' value={data.phaseExecutions} icon={WaypointsIcon} />
            <StatsCardItem title='Credits Consumed' value={data.creditsConsumed} icon={CoinsIcon} />
        </div>
    )
}

function StatsCardSkeleton() {
    return (
        <div className='grid gap-3 lg:gap-8 lg:grid-cols-3'>
            {[1, 2, 3].map(index => (
                <Skeleton key={index} className='min-h-[120px]' />
            ))}
        </div>
    )
}

async function StatsExecutionStatus({ selectedPeriod }: { selectedPeriod: Period }) {
    const data = await GetWorkflowExecutionStats(selectedPeriod)

    return (
        <ExecutionStatusChart data={data} />
    )
}

async function CreditsUsageInPeriod({ selectedPeriod }: { selectedPeriod: Period }) {
    const data = await GetCreditsUsageInPeriod(selectedPeriod)

    return (
        <CreditsUsageChart
            data={data}
            title='Daily credits spent'
            description='Daily credits spent in the selected period'
        />
    )
}

export default HomePage