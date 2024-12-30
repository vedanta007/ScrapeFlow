'use client'

import { GetPhaseDetails } from "@/actions/workflows/getPhaseDetails"
import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GetPhasesTotalCost } from "@/lib/helper/creditCost"
import { DatesToDurationString } from "@/lib/helper/duration"
import { cn } from "@/lib/utils"
import { LogLevel } from "@/types/log"
import { WorkflowExecutionStatus } from "@/types/workflow"
import { ExecutionLog } from "@prisma/client"
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
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                        <p className="font-bold">Run is in progress, please wait.</p>
                    </div>
                )}
                {!isRunning && !selectedPhase && (
                    <div className="flex items center flex-col gap-2 justify-center h-full w-full">
                        <div className="flex flex-col gap-1 text-center">
                            <p className="font-bold">No phase selected</p>
                            <p className="text-sm text-muted-foreground">Select a phase to view details</p>
                        </div>
                    </div>
                )}
                {!isRunning && selectedPhase && phaseDetails.data && (
                    <div className="flex flex-col py-4 container gap-4 overflow-auto">
                        <div className="flex gap-2 items-center">
                            <Badge variant={'outline'} className="space-x-4">
                                <div className="flex gap-1 items-center">
                                    <CoinsIcon size={18} className="stroke-muted-foreground" />
                                    <span>Credits</span>
                                </div>
                                <span>TODO</span>
                            </Badge>
                            <Badge variant={'outline'} className="space-x-4">
                                <div className="flex gap-1 items-center">
                                    <ClockIcon size={18} className="stroke-muted-foreground" />
                                    <span>Duration</span>
                                </div>
                                <span>
                                    {DatesToDurationString(phaseDetails.data.completedAt, phaseDetails.data.startedAt) || '-'}
                                </span>
                            </Badge>
                        </div>
                        <ParameterViewer title='Inputs' subtitle='Inputs used for this phase' paramJson={phaseDetails.data.input} />
                        <ParameterViewer title='Outputs' subtitle='Outputs from this phase' paramJson={phaseDetails.data.output} />
                        <LogViewer logs={phaseDetails.data.logs} />
                    </div>
                )}
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

function ParameterViewer({ title, subtitle, paramJson }: { title: string, subtitle: string, paramJson: string | null }) {
    const params = paramJson ? JSON.parse(paramJson) : undefined
    return (
        <Card>
            <CardHeader className="rounded-lg rounded-bottom-none border-b py-4 bg-gray-50 dark:bg-background">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex flex-col gap-2">
                    {(!params || Object.keys(params).length === 0) && (
                        <p className="text-sm">No parameters generated by this phase.</p>
                    )}
                    {params && Object.entries(params).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center space-y-1">
                            <p className="text-sm text-muted-foreground flex-1 basis-1/3">{key}</p>
                            <Input readOnly className="flex-1 basis-2/3" value={value as string} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined}) {
    if(!logs || logs.length === 0) {
        return null
    }
    return (
        <Card className="w-full">
            <CardHeader className="rounded-lg rounded-bottom-none border-b py-4 bg-gray-50 dark:bg-background">
                <CardTitle className="text-base">Logs</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">Logs generated by this phase</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="text-muted-foreground text-sm">
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="text-muted-foreground">
                                <TableCell width={190} className="text-xs text-muted-foreground p-[2px] pl-4">
                                    {log.timestamp.toISOString()}
                                </TableCell>
                                <TableCell width={80} className={cn(
                                    'uppercase text-xs font-bold p-[3px] pl-4',
                                    (log.logLevel as LogLevel) === 'error' && 'text-destructive',
                                    (log.logLevel as LogLevel) === 'info' && 'text-primary'
                                )}>
                                    {log.logLevel}
                                </TableCell>
                                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                                    {log.message}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default ExecutionViewer