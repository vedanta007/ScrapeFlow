import 'server-only'
import prisma from '../prisma'
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow'
import { ExecutionPhase } from '@prisma/client'
import { AppNode } from '@/types/appNode'
import { TaskRegistry } from './task/registry'
import { ExecutorRegistry } from './executor/registry'
import { Environment, ExecutionEnvironment } from '@/types/executor'

export async function ExecuteWorkflow(executionId: string): Promise<void> {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
        },
        include: {
            workflow: true,
            phases: true,
        },
    })
    if (!execution) {
        throw new Error('Execution not found')
    }

    const environment: Environment = { phases: {} }

    await initializeWorkflowExecution(executionId, execution.workflowId)

    await initializePhaseStatuses(execution)

    let creditsConsumed = 0
    let executionFailed = false
    for (const phase of execution.phases) {
        const phaseExecution = await executeWorkflowPhase(phase, environment)
        if (!phaseExecution.success) {
            executionFailed = true
            break
        }
    }

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)
}

// This function initializes the workflow execution by setting the startedAt date and status to RUNNING
async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        },
    })

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastExecutionAt: new Date(),
            lastExecutionId: executionId,
            lastExecutionStatus: WorkflowExecutionStatus.RUNNING,
        },
    })
}

// This function initializes the status of all the phases to PENDING
async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        },
    })
}

// This function finalizes the workflow execution by setting the completedAt date, status to FAILED or COMPLETED, and creditsCost
async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsCost: number) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED
    await prisma.workflowExecution.update({
        where: {
            id: executionId,
        },
        data: {
            completedAt: new Date(),
            status: finalStatus,
            creditsCost,
        },
    })

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastExecutionId: executionId,
        },
        data: {
            lastExecutionStatus: finalStatus,
        },
    }).catch(() => {})
}

// This function executes a single phase of the workflow
async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment) {
    const startedAt = new Date()
    const node = JSON.parse(phase.node) as AppNode

    setupEnvironmentForPhase(node, environment)

    await prisma.executionPhase.update({
        where: {
            id: phase.id,
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
        },
    })

    const creditsRequired = TaskRegistry[node.data.type].credits
    console.log(`Executing phase ${phase.name} with ${creditsRequired} credits`)

    const success = await executePhase(phase, node, environment)

    await finalizePhase(phase.id, success)
    return { success }
}

// This function finalizes a phase by setting the completedAt date and status to FAILED or COMPLETED
async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED
    await prisma.executionPhase.update({
        where: {
            id: phaseId,
        },
        data: {
            completedAt: new Date(),
            status: finalStatus,
        },
    })
}

// This function executes a single phase of the workflow
async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn) {
        return false
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment)
    return await runFn(executionEnvironment)
}

// This function sets up the environment for a phase by initializing the inputs and outputs
function setupEnvironmentForPhase(node: AppNode, environment: Environment) {
    environment.phases[node.id] = {
        inputs: {},
        outputs: {},
    }
    const inputs = TaskRegistry[node.data.type].inputs
    for (const input of inputs) {
        // Check if the input is already provided by user
        const inputValue = node.data.inputs[input.name]
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue
            continue
        }
        // Check if the input is provided by a previous phase
    }
}

function createExecutionEnvironment(node: AppNode, environment: Environment): ExecutionEnvironment<any> {
    return {
        getInput(name: string): string {
            return environment.phases[node.id]?.inputs[name]
        },
    }
}