import { Engine } from "@thirdweb-dev/engine";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const {
  WEBHOOK_SECRET_KEY,
  ENGINE_URL,
  ENGINE_ACCESS_TOKEN,
  NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
  NEXT_PUBLIC_BACKEND_WALLET,
} = process.env;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET_KEY) {
    throw 'Server misconfigured. Did you forget to add a ".env.local" file? Webhook';
  } else {
    console.log("WEBHOOK KEY SUCCESS");
  }

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

  switch (event.type) {
    case "checkout.session.completed":
      // Handle the webhook
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    default:
      console.log("test");
    // Ignore. Unexpected Stripe event.
  }

  return NextResponse.json({ message: "OK" });
}

const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  console.log("ENGINE URL:", ENGINE_URL);
console.log("ENGINE ACCESS TOKEN:", ENGINE_ACCESS_TOKEN);
console.log("NFT CONTRACT ADDRESS:", NEXT_PUBLIC_NFT_CONTRACT_ADDRESS);
console.log("BACKEND WALLET:", NEXT_PUBLIC_BACKEND_WALLET);

  if (
    !ENGINE_URL ||
    !ENGINE_ACCESS_TOKEN||
    !NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
    !NEXT_PUBLIC_BACKEND_WALLET
  ) {
    throw 'Server misconfigured. Did you forget to add a ".env.local" file? handlecheckoutseesion fail';
  }

  // Assuming session.metadata is a non-null object
  if (session.metadata) {
    console.log("Running checkout session compelted function");
    // Access the metadata using indexing
    const buyerWalletAddress = session.metadata?.buyerWalletAddress;

    if (buyerWalletAddress) {
      console.log("Buyer Wallet Address:", buyerWalletAddress);

      // Proceed with your logic, e.g., minting NFT
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
              name: "blueEye",
              description: "blueEye from hashlips",
            },
            supply: "1",
          },
        }
      );

      console.log("MINTED");
    } else {
      throw new Error(
        'Metadata "buyerWalletAddress" is missing in the session.'
      );
    }
  } else {
    throw new Error("Session metadata is null or undefined.");
  }
};

// const handleChargeSucceeded = async (session: Stripe.Checkout.Session) => {
//   if (
//     !ENGINE_URL ||
//     !NEXT_PUBLIC_ ||
//     !NEXT_PUBLIC_NFT_CONTRACT_ADDRESS ||
//     !NEXT_PUBLIC_BACKEND_WALLET
//   ) {
//     throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
//   }

//   console.log(session.metadata)
//   const { buyerWalletAddress } = session.metadata;

//   if (!buyerWalletAddress) {
//     throw 'Webhook metadata is missing "buyerWalletAddress".';
//   }

//   // Mint an NFT to the buyer with Engine.
//   const engine = new Engine({
//     url: ENGINE_URL,
//     accessToken: NEXT_PUBLIC_,
//   });
//   await engine.erc1155.mintTo(
//     "mumbai",
//     NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
//     NEXT_PUBLIC_BACKEND_WALLET,
//     {
//       receiver: buyerWalletAddress,
//       metadataWithSupply: {
//         metadata: {
//           name: "Example NFT",
//           description: "Created with thirdweb Engine",
//           image:
//             "ipfs://QmciR3WLJsf2BgzTSjbG5zCxsrEQ8PqsHK7JWGWsDSNo46/nft.png",
//         },
//         supply: "1",
//       },
//     }
//   );
// };
