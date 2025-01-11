import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits"
import ReactCountupWrapper from "@/components/reactCountupWrapper"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CoinsIcon } from "lucide-react"
import { Suspense } from "react"

export default function BillingPage() {
    return (
        <div className="mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">Billing</h1>
            <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
                <BalanceCard />
            </Suspense>
        </div>
    )
}

async function BalanceCard() {
    const userBalance = await GetAvailableCredits()
    return (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex flex-col justify-between overflow-hidden">
            <CardContent className="p-6 relative items-center">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Available Credits</h3>
                        <p className="text-4xl font-bold text-primary">
                            <ReactCountupWrapper value={userBalance} />
                        </p>
                    </div>
                    <CoinsIcon size={140} className="text-primary opacity-20 absolute bottom-0 right-0" />
                </div>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm">
                When your credit balance reaches zero, your workflow will stop running.
            </CardFooter>
        </Card>
    )
}