import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Link2Icon } from "lucide-react";

export const NavigateUrlTask = {
    type: TaskType.NAVIGATE_URL,
    label: 'Navigate to URL',
    icon: (props) => (<Link2Icon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    credits: 2,
    inputs: [{
        name: 'web page',
        type: TaskParamType.BROWSER_INSTANCE,
        required: true,
    }, {
        name: 'url',
        type: TaskParamType.STRING,
        required: true,
    }] as const,
    outputs: [{
        name: 'web page',
        type: TaskParamType.BROWSER_INSTANCE,
    }] as const,
} satisfies WorkflowTask