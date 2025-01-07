import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: 'Extract Text From Element',
    icon: (props) => (<TextIcon className="stroke-rose-400" {...props} />),
    isEntryPoint: false,
    credits: 2,
    inputs: [{
        name: 'html',
        type: TaskParamType.STRING,
        required: true,
        variant: 'textarea',
    }, {
        name: 'selector',
        type: TaskParamType.STRING,
        required: true,
    }] as const,
    outputs: [{
        name: 'extractedText',
        type: TaskParamType.STRING,
    }] as const,
} satisfies WorkflowTask