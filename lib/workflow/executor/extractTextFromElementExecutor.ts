import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/extractTextFromElement";
import * as cheerio from 'cheerio'

export async function ExtractTextFromElementExecutor(environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput('selector')
        if (!selector) {
            environment.log.error('Selector is not provided')
            return false
        }

        const html = environment.getInput('html')
        if (!html) {
            environment.log.error('HTML not provided')
            return false
        }

        const $ = cheerio.load(html)
        const element = $(selector)
        if (!element) {
            environment.log.error(`Element not found for selector: ${selector}`)
            return false
        }

        const extractedText = $.text(element)
        if (!extractedText) {
            environment.log.error('Element has no text')
            return false
        }

        environment.setOutput('extractedText', extractedText)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}