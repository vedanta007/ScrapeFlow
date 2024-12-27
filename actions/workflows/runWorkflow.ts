'use server'

import prisma from "@/lib/prisma"
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow"
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function RunWorkflow(form: { workflowId: string, flowDefinition?: string }) {
    const { userId } = await auth()
    if(!userId) {
        throw new Error('Unauthenticated')
    }

    const { workflowId, flowDefinition } = form
    if (!workflowId) {
        throw new Error('Invalid workflow ID')
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId,
        },
    })
    if (!workflow) {
        throw new Error('Workflow not found')
    }
    
    if (!flowDefinition) {
        throw new Error('flow definition is not provided')
    }

    const flow = JSON.parse(flowDefinition)
    const result = FlowToExecutionPlan(flow.nodes, flow.edges)
    if (result.error) {
        throw new Error('flow definition is invalid')
    }

    if (!result.executionPlan) {
        throw new Error('Failed to create execution plan')
    }

    const executionPlan: WorkflowExecutionPlan = result.executionPlan
    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true,
        }
    })
    if (!execution) {
        throw new Error('Failed to create execution')
    }

    ExecuteWorkflow(execution.id)

    redirect(`/workflow/runs/${workflowId}/${execution.id}`)
}