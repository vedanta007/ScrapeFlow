'use client'

import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import React from 'react'

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>

function ExecutionStatusChart({ data }: { data: ChartData }) {
    return (
        <div>ExecutionStatusChart</div>
    )
}

export default ExecutionStatusChart