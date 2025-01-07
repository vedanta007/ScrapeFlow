import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { Edit3Icon, LucideProps } from "lucide-react";

export const FillInputTask = {
    type: TaskType.FILL_INPUT,
    label: 'Fill Input',
    icon: (props) => (<Edit3Icon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    credits: 1,
    inputs: [{
        name: 'webpage',
        type: TaskParamType.BROWSER_INSTANCE,
        required: true,
    }, {
        name: 'selector',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'value',
        type: TaskParamType.STRING,
        required: true,
    }] as const,
    outputs: [{
        name: 'html',
        type: TaskParamType.STRING,
    }] as const,
} satisfies WorkflowTask