import { ExecutionEnvironment } from '@/types/executor'
import { PageToHtmlTask } from '../task/pageToHtml'

export async function PageToHtmlExecutor(environment: ExecutionEnvironment<typeof PageToHtmlTask>): Promise<boolean> {
    try {
        const html = await environment.getPage()!.content()
        environment.setOutput('html', html)
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}