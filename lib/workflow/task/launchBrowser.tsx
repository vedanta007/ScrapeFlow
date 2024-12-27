import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: 'Launch Browser',
    icon: (props: LucideProps) => (<GlobeIcon className="stroke-pink-400" {...props} />),
    isEntryPoint: true,
    credits: 5,
    inputs: [{
        name: 'url',
        type: TaskParamType.STRING,
        helperText: 'e.g. https://www.example.com',
        required: true,
        hideHandle: true,
    }] as const,
    outputs: [{
        name: 'webpage',
        type: TaskParamType.BROWSER_INSTANCE,
    }],
} satisfies WorkflowTask