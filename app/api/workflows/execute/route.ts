import prisma from "@/lib/prisma"
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow"
import { TaskRegistry } from "@/lib/workflow/task/registry"
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow"
import { timingSafeEqual } from "crypto"

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiSecret = authHeader.split(" ")[1]
    if(!isValidSecret(apiSecret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const workflowId = searchParams.get("workflowId") as string
    if(!workflowId) {
        return Response.json({ error: "Bad request" }, { status: 400 })
    }

    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
    })
    if(!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 400 })
    }

    const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan
    if(!executionPlan) {
        return Response.json({ error: "Workflow execution plan not found" }, { status: 400 })
    }

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId: workflow.userId,
            definition: workflow.definition,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.CRON,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId: workflow.userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        }
                    })
                })
            }
        },
    })

    await ExecuteWorkflow(execution.id)
    return new Response(null, { status: 200 })
}

function isValidSecret(apiSecret: string) {
    const API_SECRET = process.env.API_SECRET
    if(!API_SECRET) {
        console.error("API_SECRET is not set")
        return false
    }

    // to prevent timing attacks
    try {
        return timingSafeEqual(Buffer.from(apiSecret), Buffer.from(API_SECRET))
    } catch (error) {
        return false
    }
}