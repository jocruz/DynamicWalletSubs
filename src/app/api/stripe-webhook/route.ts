  import { Engine } from "@thirdweb-dev/engine";
  import { headers } from "next/headers";
  import { NextResponse } from "next/server";

  import Stripe from "stripe";


  const {
    WEBHOOK_SECRET_KEY,
    ENGINE_URL,
    ENGINE_ACCESS_TOKEN,
    NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BACKEND_WALLET,
  } = process.env;

  export async function POST(req: Request) {
    console.log("Webhook hit!");
    if (!WEBHOOK_SECRET_KEY) {
      throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
    // Validate the Stripe webhook signature.
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    if (!signature) {
      throw "Stripe webhook signature not provided. This request may not be valid.";
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      WEBHOOK_SECRET_KEY
    );

    console.log(`Received event: ${event.type}`);
    switch (event.type) {
      case "charge.succeeded":
        // Handle the webhook
        await handleChargeSucceeded(event.data.object);
        break;
      default:
      // Ignore. Unexpected Stripe event.
    }

    return NextResponse.json({ message: "OK" });
    
  }

  
  const handleChargeSucceeded = async (charge: Stripe.Charge) => {
    if (
      !ENGINE_URL ||
      !ENGINE_ACCESS_TOKEN ||
      !NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
      !NEXT_PUBLIC_BACKEND_WALLET
    ) {
      throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
    }

    const { buyerWalletAddress } = charge.metadata;
    if (!buyerWalletAddress) {
      throw 'Webhook metadata is missing "buyerWalletAddress".';
    }

    // Mint an NFT to the buyer with Engine.
    const engine = new Engine({
      url: ENGINE_URL,
      accessToken: ENGINE_ACCESS_TOKEN,
    });
    await engine.erc1155.mintTo(
      "mumbai",
      NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
      NEXT_PUBLIC_BACKEND_WALLET,
      {
        receiver: buyerWalletAddress,
        metadataWithSupply: {
          metadata: {
            name: "Example NFT",
            description: "Created with thirdweb Engine",
            image:
              "ipfs://QmciR3WLJsf2BgzTSjbG5zCxsrEQ8PqsHK7JWGWsDSNo46/nft.png",
          },
          supply: "1",
        },
      }
    );
  };
