import { ExecutionEnvironment } from '@/types/executor'
import { ReadPropertyFromJSONTask } from '../task/readPropertyFromJSON'

export async function ReadPropertyFromJSONExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJSONTask>): Promise<boolean> {
    try {
        const propertyName = environment.getInput('property name')
        if(!propertyName) {
            environment.log.error('input->propertyName not defined')
        }
        const json = environment.getInput('JSON')
        if(!json) {
            environment.log.error('input->json not defined')
        }
        
        const parsedJson = JSON.parse(json)
        const propertyValue = parsedJson[propertyName]
        if(!propertyValue) {
            environment.log.error(`property ${propertyName} not found in JSON`)
            return false
        }

        environment.setOutput('property value', propertyValue)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}