import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { MousePointerClick, TextIcon } from "lucide-react";

export const ClickElementTask = {
    type: TaskType.CLICK_ELEMENT,
    label: 'Click Element',
    icon: (props) => (<MousePointerClick className="stroke-orange-400" {...props} />),
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
    }] as const,
    outputs: [{
        name: 'web page',
        type: TaskParamType.BROWSER_INSTANCE,
    }] as const,
} satisfies WorkflowTask