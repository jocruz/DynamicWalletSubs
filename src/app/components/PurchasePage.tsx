import React, { useState } from "react";
import {
  useContract,
  useContractMetadata,
  useNFT,
  MediaRenderer,
} from "@thirdweb-dev/react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUserWallets } from "@dynamic-labs/sdk-react-core";

// PurchasePage Component: Manages the display and interaction with the NFT purchase process.
function PurchasePage() {
  // State to track if the subscription process has started
  const [isCheckoutInitiated, setCheckoutInitiated] = useState(false);

  // State to store the client secret for Stripe checkout
  const [clientSecret, setClientSecret] = useState("");

  // Fetching user wallet details
  const userWallets = useUserWallets();
  const dynamicAddress = userWallets[0];


  // Contract interaction hooks
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    "edition"
  );
  const { data: contractMetadata } = useContractMetadata(contract);
  const { data: nft, isLoading, error } = useNFT(contract, "0");

  // Function to initiate the Stripe checkout process
  const checkout = async () => {
    try {
      // Request to create a Stripe checkout session
      const res = await fetch("/api/stripecheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerWalletAddress: dynamicAddress?.address }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const session = await res.json();
      setClientSecret(session.client_secret);
      setCheckoutInitiated(true);
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
    }
  };

  // Load Stripe with the publishable key
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw 'Did you forget to add a ".env.local" file?';
  }
  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  return (
    <main className="flex flex-col justify-center items-center gap-y-8 min-h-screen p-12">
      {/* Contract Metadata and NFT Media Renderer */}
      {contractMetadata && (
        <div className="flex flex-col gap-8 border border-gray-700 rounded-xl p-12">
          <MediaRenderer className="rounded-lg" src={nft?.metadata.image} />
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold">{contractMetadata.name}</h2>
            <p className="text-gray-500">
              We are using the following contract: {contractMetadata.description || "There was an error getting the contract Metadata"}
            </p>
          </div>
        </div>
      )}

      {/* Subscription Button */}


      <button
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:opacity-50"
        onClick={checkout}
      >
        Subscribe
      </button>

      {/* Embedded Checkout Provider for Stripe */}

{isCheckoutInitiated ? (
        <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p>Check out has not been initiated so the Subscription Checkout is hiding</p>
      )}

    </main>
  );
}

export default PurchasePage;
