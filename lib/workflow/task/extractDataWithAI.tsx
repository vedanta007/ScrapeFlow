import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { BrainIcon } from "lucide-react";

export const ExtractDataWithAITask = {
    type: TaskType.EXTRACT_DATA_WITH_AI,
    label: 'Extract data with AI',
    icon: (props) => (<BrainIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    credits: 4,
    inputs: [{
        name: 'content',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'credentials',
        type: TaskParamType.CREDENTIAL,
        required: true,
    }, {
        name: 'prompt',
        type: TaskParamType.STRING,
        required: true,
        variant: 'textarea',
    }] as const,
    outputs: [{
        name: 'extracted data',
        type: TaskParamType.STRING,
    }] as const,
} satisfies WorkflowTask