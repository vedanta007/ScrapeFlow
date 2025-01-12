'use server'

import { GetAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function PurchaseCredits(packId: PackId) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthenticated')
    }

    const selectedPack = getCreditsPack(packId)
    if (!selectedPack) {
        throw new Error('Invalid pack')
    }

    const priceId = selectedPack?.priceId

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        invoice_creation: {
            enabled: true,
        },
        success_url: GetAppUrl('billing'),
        cancel_url: GetAppUrl('billing'),
        metadata: {
            userId,
            packId,
        },
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
    })
    if (!session.url) {
        throw new Error('Cannot create stripe session')
    }

    redirect(session.url)
}