import { ExecutionEnvironment } from '@/types/executor'
import puppeteer from 'puppeteer'
import { LaunchBrowserTask } from '../task/launchBrowser'

const BROWSER_WS = "wss://brd-customer-hl_3a4091a7-zone-scrape_flow_browser:7srldae7zafs@brd.superproxy.io:9222"

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput('url')
        const browser = await puppeteer.connect({
            browserWSEndpoint: BROWSER_WS,
        })
        environment.log.info('Browser launched successfully')
        environment.setBrowser(browser)
        const page = await browser.newPage()
        page.setViewport({ width: 2560, height: 1440 })
        await page.goto(websiteUrl)
        environment.setPage(page)
        environment.log.info(`Navigated to ${websiteUrl}`)
        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}