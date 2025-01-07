import { ExecutionEnvironment } from '@/types/executor'
import { DeliverViaWebhookTask } from '../task/deliverViaWebhook'

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>): Promise<boolean> {
    try {
        const body = environment.getInput('body')
        if(!body) {
            environment.log.error('input->body not defined')
        }

        const targetUrl = environment.getInput('target url')
        if(!targetUrl) {
            environment.log.error('input->targetUrl not defined')
        }

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const statusCode = response.status
        if(statusCode !== 200) {
            environment.log.error(`Received status code ${statusCode} from target URL`)
            return false
        }

        const responseBody = await response.json()
        environment.log.info(JSON.stringify(responseBody, null, 4))
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}