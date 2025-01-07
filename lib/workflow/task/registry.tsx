import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./extractTextFromElement";
import { LaunchBrowserTask } from "./launchBrowser";
import { PageToHtmlTask } from "./pageToHtml";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./fillInput";

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
}

type Registry = {
    [key in TaskType]: WorkflowTask & { type: key };
}