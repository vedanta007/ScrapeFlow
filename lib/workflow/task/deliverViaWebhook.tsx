import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { SendIcon } from "lucide-react";

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: 'Deliver via Webhook',
    icon: (props) => (<SendIcon className="stroke-blue-400" {...props} />),
    isEntryPoint: false,
    credits: 1,
    inputs: [{
        name: 'target url',
        type: TaskParamType.STRING,
        required: true,
    }, {
        name: 'body',
        type: TaskParamType.STRING,
        required: true,
    }] as const,
    outputs: [] as const,
} satisfies WorkflowTask