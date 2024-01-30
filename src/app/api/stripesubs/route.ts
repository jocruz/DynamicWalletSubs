import { NextResponse } from "next/server";
import Stripe from "stripe";

const { STRIPE_SECRET_KEY } = process.env;

export async function POST(req: Request, res: Response) {
    if (!STRIPE_SECRET_KEY) {
      throw 'Server misconfigured. Did you forget to add a ".env.local" file?'
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
    });

    try {
        const { buyerWalletAddress } = await req.json();

        // Search for customers with the given wallet address
        const customers = await stripe.customers.search({
            query: `metadata["walletAddress"]:"${buyerWalletAddress}"`,
        });

        let customer;
        if (customers.data.length > 0) {
            // If there is already a customer for this wallet, use it
            customer = customers.data[0];
            console.log(customer);
        } else {
            // Handle the case where no customer exists for the wallet address
            // You might want to create a new customer or handle this as an error
            throw 'No customer found for the provided wallet address'
        }

        // Create a billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: 'https://example.com/account', // The URL to which the customer is redirected after managing their subscription
        });

        // Return the session URL to the client
        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error(error);
    
    }
}
