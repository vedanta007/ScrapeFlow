import { GetAppUrl } from "@/lib/helper/appUrl"
import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"

export async function GET(req: Request) {
    const now = new Date()
    const workflows = await prisma.workflow.findMany({
        select: {
            id: true,
        },
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: { not: null },
            nextRunAt: { lte: now },
        },
    })

    for(const workflow of workflows) {
        // Execute the workflow
        triggerWorkflow(workflow.id)
    }

    return Response.json({ WorkflowToRun: workflows.length }, { status: 200 })
}

function triggerWorkflow(workflowId: string) {
    // Trigger the workflow
    const triggerApiUrl = GetAppUrl(`api/workflows/execute?workflowId=${workflowId}`)
    fetch(triggerApiUrl, {
        headers: {
            Authorization: `Bearer ${process.env.API_SECRET!}`,
        },
        cache: "no-store",
    }).catch((error) => {
        console.error(`Failed to trigger workflow ${workflowId}: ${error}`)
    })
}