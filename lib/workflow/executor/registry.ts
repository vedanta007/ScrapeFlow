import { TaskType } from "@/types/task";
import { ExtractTextFromElementExecutor } from "./extractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "./launchBrowserExecutor";
import { PageToHtmlExecutor } from "./pageToHtmlExecutor";
import { ExecutionEnvironment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>

type RegistryType = {
    [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
}