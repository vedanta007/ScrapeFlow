import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { EyeIcon } from "lucide-react";

export const WaitForElementTask = {
    type: TaskType.WAIT_FOR_ELEMENT,
    label: 'Wait for Element',
    icon: (props) => (<EyeIcon className="stroke-amber-400" {...props} />),
    isEntryPoint: false,
    credits: 1,
    inputs: [{
        name: 'web page',
        type: TaskParamType.BROWSER_INSTANCE,
        required: true,
    }, {
        name: 'selector',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'visibility',
        type: TaskParamType.SELECT,
        hideHandle: true,
        required: true,
        options: [
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
        ],
    }] as const,
    outputs: [{
        name: 'web page',
        type: TaskParamType.BROWSER_INSTANCE,
    }] as const,
} satisfies WorkflowTask