import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { DatabaseIcon } from "lucide-react";

export const AddPropertyToJSONTask = {
    type: TaskType.ADD_PROPERTY_TO_JSON,
    label: 'Add Property to JSON',
    icon: (props) => (<DatabaseIcon className="stroke-orange-400" {...props} />),
    isEntryPoint: false,
    credits: 1,
    inputs: [{
        name: 'JSON',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'property name',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'property value',
        type: TaskParamType.STRING,
        required: true,
    }] as const,
    outputs: [{
        name: 'updated JSON',
        type: TaskParamType.STRING,
    }] as const,
} satisfies WorkflowTask