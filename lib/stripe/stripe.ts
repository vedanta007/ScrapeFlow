import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
})

/*This is the main file for the Stripe API. It initializes the Stripe object with the secret key from the environment variables. 
The  apiVersion  is the version of the Stripe API that we are using. 
4. Create a webhook handler 
The webhook handler is responsible for receiving events from Stripe. */