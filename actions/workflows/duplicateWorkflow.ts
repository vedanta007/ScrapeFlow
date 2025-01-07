'use server'

import prisma from "@/lib/prisma";
import { DuplicateWorkflowSchema, duplicateWorkflowSchemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
    // Validate the form data
    const { success, data } = DuplicateWorkflowSchema.safeParse(form)
    if(!success) {
        throw new Error('Invalid form data')
    }
    // Get the current user ID
    const { userId } = await auth()
    // If the user is not authenticated, throw an error
    if(!userId) {
        throw new Error('Unauthenticated')
    }

    // Find the source workflow
    const sourceWorkflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId,
            userId,
        },
    })
    // If the source workflow is not found, throw an error
    if(!sourceWorkflow) {
        throw new Error('Workflow not found')
    }

    // Create a new workflow based on the source workflow
    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            status: WorkflowStatus.DRAFT,
            definition: sourceWorkflow.definition,
        },
    })
    // If the new workflow is not created, throw an error
    if(!result) {
        throw new Error('Failed to duplicate workflow')
    }

    revalidatePath('/workflows')
}