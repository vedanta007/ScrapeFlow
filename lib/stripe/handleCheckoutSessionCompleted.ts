import { getCreditsPack, PackId } from '@/types/billing';
import 'server-only'
import Stripe from 'stripe';
import prisma from '../prisma';

export async function HandleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
    if (!event.metadata) {
        throw new Error('Missing metadata')
    }

    const { userId, packId } = event.metadata
    if (!userId) {
        throw new Error('Missing user id')
    }
    if (!packId) {
        throw new Error('Missing pack id')
    }

    const purchasedPack = getCreditsPack(packId as PackId)
    if (!purchasedPack) {
        throw new Error('Invalid pack')
    }

    await prisma.userBalance.upsert({
        where: {
            userId,
        },
        update: {
            credits: {
                increment: purchasedPack.credits,
            },
        },
        create: {
            userId,
            credits: purchasedPack.credits,
        },
    })
}