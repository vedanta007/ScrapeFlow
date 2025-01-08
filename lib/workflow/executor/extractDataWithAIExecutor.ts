import { ExecutionEnvironment } from '@/types/executor'
import { ExtractDataWithAITask } from '../task/extractDataWithAi'
import prisma from '@/lib/prisma'
import { symmetricDecrypt } from '@/lib/encryption'
import OpenAI from 'openai'

export async function ExtractDataWithAIExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
    try {
        const credentials = environment.getInput('credentials')
        if(!credentials) {
            environment.log.error('input->credentials not defined')
        }

        const prompt = environment.getInput('prompt')
        if(!prompt) {
            environment.log.error('input->prompt not defined')
        }

        const content = environment.getInput('content')
        if(!content) {
            environment.log.error('input->content not defined')
        }

        // Get credentials from DB
        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials,
            },
        })
        if(!credential) {
            environment.log.error('credentials not found')
            return false
        }

        const plainCredentialValue = symmetricDecrypt(credential.value)
        if(!plainCredentialValue) {
            environment.log.error('credentials decryption failed')
            return false
        }

        const openai = new OpenAI({
            apiKey: plainCredentialValue,

        })

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a webscrapper helper that extracts data from HTML or text.
                    You will be give a piece of text or HTML content as input and also the prompt with the data you have to extact.
                    The response should always be only the extracted data as a JSON array or object, without any additional words or explanations.
                    Analyze the imput carefully and extract the data precisely based on the prompt.
                    If you are unable to extract the data, you should return an JSON empty array.
                    Work only with the provided content and ensure the ouput is always a valid JSON array without any surrounding text.`,
                },
                {
                    role: 'user',
                    content: content,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 1,
        })

        environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`)
        environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`)

        const result = response.choices[0].message?.content
        if(!result) {
            environment.log.error('No response from AI')
            return false
        }

        environment.setOutput('extracted data', result)

        return true
    } catch (error: any) {
        environment.log.error(error.message)
        return false
    }
}