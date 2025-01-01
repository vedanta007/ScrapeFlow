import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/topbar/topbar";
import { Suspense } from "react";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./_components/executionsTable";

export default function ExecutionsPage({ params }: { params: { workflowId: string }}) {
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar
                workflowId={params.workflowId}
                title="All runs"
                subTitle="List of all your workflow runs"
                hideButtons
            />
            <Suspense fallback={
                <div>
                    <Loader2Icon size={30} className="animate-spin stroke-primary" />
                </div>
            }>
                <ExecutionsTableWrapper workflowId={params.workflowId} />
            </Suspense>
        </div>
    )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
    const executions = await GetWorkflowExecutions(workflowId)
    if(!executions) {
        return (
            <div>No data</div>
        )
    }
    if(executions.length === 0) {
        return (
            <div className="container w-full py-6">
                <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                    <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                        <InboxIcon size={40} className="stroke-primary" />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">No runs have have been triggered yet for this workflow.</p>
                        <p className="text-sm text-muted-foreground">You can triger a new run in the Editor page.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-6 w-full">
            <ExecutionsTable workflowId={workflowId} initialData={executions} />
        </div>
    )
}