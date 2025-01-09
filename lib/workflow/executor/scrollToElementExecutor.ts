import { ExecutionEnvironment } from '@/types/executor'
import { ScrollToElementTask } from '../task/scrollToElement'

export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput('selector')
        if(!selector) {
            environment.log.error('input->selector not defined')
        }
        await environment.getPage()!.evaluate((selector: string) => {
            const element = document.querySelector(selector)
            if (!element) {
                throw new Error(`Element with selector ${selector} not found`)
            }

            const y = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({ top: y })
        }, selector)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}