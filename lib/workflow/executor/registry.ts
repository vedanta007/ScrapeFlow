import { ExtractTextFromElementExecutor } from "./extractTextFromElementExecutor";
import { LaunchBrowserExecutor } from "./launchBrowserExecutor";
import { PageToHtmlExecutor } from "./pageToHtmlExecutor";

export const ExecutorRegistry = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    //PAGE_TO_HTML: PageToHtmlExecutor,
    PAGE_TO_HTML: () => Promise.resolve(true),
    //EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: () => Promise.resolve(true),
}