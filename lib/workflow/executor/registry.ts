import { TaskType } from "@/types/task";
import { ExtractTextFromElementExecutor } from "./extractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "./launchBrowserExecutor";
import { PageToHtmlExecutor } from "./pageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { FillInputExecutor } from "./fillInputExecutor";
import { ClickElementExecutor } from "./clickElementExecutor";
import { WaitForElementExecutor } from "./waitForElementExecutor";
import { DeliverViaWebhookExecutor } from "./deliverViaWebhookExecutor";
import { ExtractDataWithAIExecutor } from "./extractDataWithAIExecutor";
import { ReadPropertyFromJSONExecutor } from "./readPropertyFromJSONExecutor";
import { AddPropertyToJSONExecutor } from "./addPropertyToJSONExecutor";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
    FILL_INPUT: FillInputExecutor,
    CLICK_ELEMENT: ClickElementExecutor,
    WAIT_FOR_ELEMENT: WaitForElementExecutor,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAIExecutor,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONExecutor,
    ADD_PROPERTY_TO_JSON: AddPropertyToJSONExecutor,
}