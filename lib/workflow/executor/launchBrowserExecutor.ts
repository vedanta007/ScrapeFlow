import { waitFor } from '@/lib/helper/waitFor'
import { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/launchBrowser'

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput('url')
        const browser = await puppeteer.launch({
            headless: false,
        })
        await waitFor(3000)
        await browser.close()
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}