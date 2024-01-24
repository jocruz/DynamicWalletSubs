import { NextResponse } from "next/server";
import Stripe from "stripe";

const { STRIPE_SECRET_KEY } = process.env;

export async function POST(req: Request, res: Response) {
  if (!STRIPE_SECRET_KEY) {
    throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
  }

  const { buyerWalletAddress } = await req.json();
  console.log("This is the buyerwalletaddress", buyerWalletAddress)
  if (!buyerWalletAddress) {
    throw 'Request is missing "buyerWalletAddress".';
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
  });

  // Check for stripe customers already associated with authenticated wallet address
  const customers = await stripe.customers.search({
    query: `metadata["walletAddress"]:"${buyerWalletAddress}"`,
  });

  let customer;
  if (customers.data.length > 0) {
    // If there is already a customer for this wallet, use it
    customer = customers.data[0];
  } else {
    // Otherwise create a new customer associated with this wallet
    customer = await stripe.customers.create({
      metadata: {
        walletAddress: buyerWalletAddress,
      },
    });
  }

  // Finally, create a new checkout session for the customer to send to the client-side
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customer.id,
    line_items: [{ price: process.env.PRICE_ID as string, quantity: 1 }],
    return_url: "http://localhost:3000",
    ui_mode: "embedded",
  });

  console.log(session);
  return NextResponse.json(session);
}
