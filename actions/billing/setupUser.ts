'use server'

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function SetupUser() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const balance = await prisma.userBalance.findUnique({
        where: {
            userId,
        },
    })
    if (!balance) {
        // Free 100 credits for new users
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 100,
            },
        })
    }

    redirect('/')
}