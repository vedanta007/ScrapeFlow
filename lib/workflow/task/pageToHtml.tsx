import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, LucideProps } from "lucide-react";

export const PageToHtmlTask = {
    type: TaskType.PAGE_TO_HTML,
    label: 'Get HTML from Page',
    icon: (props: LucideProps) => (<CodeIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    credits: 2,
    inputs: [{
        name: 'webpage',
        type: TaskParamType.BROWSER_INSTANCE,
        required: true,
    }] as const,
    outputs: [{
        name: 'html',
        type: TaskParamType.STRING,
    }, {
        name: 'webpage',
        type: TaskParamType.BROWSER_INSTANCE,
    }] as const,
} satisfies WorkflowTask