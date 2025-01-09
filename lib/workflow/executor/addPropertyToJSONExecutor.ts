import { ExecutionEnvironment } from '@/types/executor'
import { AddPropertyToJSONTask } from '../task/addPropertyToJSON'

export async function AddPropertyToJSONExecutor(environment: ExecutionEnvironment<typeof AddPropertyToJSONTask>): Promise<boolean> {
    try {
        const propertyName = environment.getInput('property name')
        if(!propertyName) {
            environment.log.error('input->propertyName not defined')
        }

        const json = environment.getInput('JSON')
        if(!json) {
            environment.log.error('input->json not defined')
        }

        const propertyValue = environment.getInput('property value')
        if(!propertyValue) {
            environment.log.error('input->propertyValue not defined')
        }

        const parsedJSON = JSON.parse(json)
        parsedJSON[propertyName] = propertyValue

        environment.setOutput('updated JSON', JSON.stringify(parsedJSON))
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}