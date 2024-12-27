import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import Topbar from "@/app/workflow/_components/topbar/topbar"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import ExecutionViewer from "./_components/executionViewer"

function ExecutionViewerPage({ params }: { params: { workflowId: string, executionId: string } }) {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar
                workflowId={params.workflowId}
                title="Workflow run details"
                subTitle={`Run ID: ${params.executionId}`}
                hideButtons
            />
            <section className="h-full overflow-auto">
                <Suspense fallback={
                    <div className="flex justify-center items-center w-full">
                        <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
                    </div>
                }>
                    <ExecutionViwerWrapper executionId={params.executionId} />
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionViwerWrapper({ executionId }: { executionId: string }) {
    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId)
    if (!workflowExecution) {
        return <div>Execution not found</div>
    }

    return (
        <ExecutionViewer initialData={workflowExecution} />
    )
}

export default ExecutionViewerPage