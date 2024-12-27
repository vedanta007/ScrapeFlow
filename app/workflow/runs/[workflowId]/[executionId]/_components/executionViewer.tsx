'use client'

import { GetPhaseDetails } from "@/actions/workflows/getPhaseDetails"
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GetPhasesTotalCost } from "@/lib/helper/creditCost"
import { DatesToDurationString } from "@/lib/helper/duration"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from "lucide-react"
import { ReactNode, useState } from "react"

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

    const query = useQuery({
        queryKey: ['execution', initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    })

    const phaseDetails = useQuery({
        queryKey: ['phaseDetails', selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetPhaseDetails(selectedPhase!),
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING
    const duration = DatesToDurationString(query.data?.startedAt, query.data?.completedAt)
    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || [])

    return (
        <div className="flex h-full w-full">
            <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">
                    <ExecutionLabel
                        Icon={CircleDashedIcon}
                        label='Status'
                        value={query.data?.status}
                    />
                    <ExecutionLabel
                        Icon={CalendarIcon}
                        label='Started at'
                        value={
                            <span className="lowercase">
                                {query.data?.startedAt
                                ? formatDistanceToNow(new Date(query.data?.startedAt), { addSuffix: true })
                                : '-'}
                            </span>
                        }
                    />
                    <ExecutionLabel
                        Icon={ClockIcon}
                        label='Duration'
                        value={duration
                            ? duration
                            : <Loader2Icon size={20} className="animate-spin" />
                        }
                    />
                    <ExecutionLabel
                        Icon={CoinsIcon}
                        label='Credits consumed'
                        value={creditsConsumed}
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-center px-4 py-2">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">
                            Phases
                        </span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            variant={selectedPhase === phase.id ? 'secondary' : 'ghost'}
                            className="w-full justify-between"
                            onClick={() => {
                                if (isRunning) return
                                setSelectedPhase(phase.id)
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={'outline'}>
                                    {index + 1}
                                </Badge>
                                <p className="font-semibold">
                                    {phase.name}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {phase.status}
                            </p>
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                <pre>
                    {JSON.stringify(phaseDetails.data, null, 4)}
                </pre>
            </div>
        </div>
    )
}

function ExecutionLabel({ Icon, label, value }: { Icon: LucideIcon, label: ReactNode, value: ReactNode }) {
    return (
        <div className="flex justify-between items-center px-4 py-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon size={20} className="stroke-muted-foreground/80" />
                <span>
                    {label}
                </span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>
    )
}

export default ExecutionViewer