'use server'

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { CreateCredentialSchema, createCredentialSchemaType } from "@/schema/credentials";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function CreateCredential(form: createCredentialSchemaType) {
    const { success, data } = CreateCredentialSchema.safeParse(form)
    if(!success) {
        throw new Error('Invalid form data')
    }

    const { userId } = await auth()
    if(!userId) {
        throw new Error('Unauthenticated')
    }

    // Encrypt the value before storing it in the database
    const encryptedValue = await symmetricEncrypt(data.value)

    // Store the encrypted value in the database
    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptedValue,
        },
    })
    if(!result) {
        throw new Error('Failed to create credential')
    }

    revalidatePath('/credentials')
}