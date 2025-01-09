import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./extractTextFromElement";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fillInput";
import { ClickElementTask } from "./clickElement";
import { WaitForElementTask } from "./waitForElement";
import { DeliverViaWebhookTask } from "./deliverViaWebhook";
import { ExtractDataWithAITask } from "./extractDataWithAI";
import { ReadPropertyFromJSONTask } from "./readPropertyFromJSON";

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJSONTask
}

type Registry = {
    [key in TaskType]: WorkflowTask & { type: key };
}