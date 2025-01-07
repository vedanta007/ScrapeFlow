import { ExecutionEnvironment } from '@/types/executor'
import { WaitForElementTask } from '../task/waitForElement'

export async function WaitForElementExecutor(environment: ExecutionEnvironment<typeof WaitForElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput('selector')
        if(!selector) {
            environment.log.error('input->selector not defined')
        }
        const visibility = environment.getInput('visibility')
        if(!visibility) {
            environment.log.error('input->visibility not defined')
        }
        await environment.getPage()!.waitForSelector(selector, {
            visible: visibility === 'visible',
            hidden: visibility === 'hidden'
        })
        environment.log.info(`Element ${selector} became: ${visibility}`)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}