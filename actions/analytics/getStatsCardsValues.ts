'user server'

import { PeriodToDateRange } from "@/lib/helper/duration"
import prisma from "@/lib/prisma"
import { Period } from "@/types/analytics"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"

const { COMPLETED, FAILED } = WorkflowExecutionStatus

export async function GetStatsCardsValues(period: Period) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const dateRange = PeriodToDateRange(period)
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status : {
                in: [COMPLETED, FAILED],
            },
        },
        select: {
            creditsCost: true,
            phases: {
                where: {
                    creditsCost: {
                        not: null,
                    },
                },
                select: {
                    creditsCost: true,
                },
            },
        },
    })

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0,
        phaseExecutions: 0,
    }

    stats.creditsConsumed = executions.reduce((sum, execution) => 
        sum + execution.creditsCost, 0
    )

    stats.phaseExecutions = executions.reduce((sum, execution) => 
        sum + execution.phases.length, 0
    )

    return stats
}