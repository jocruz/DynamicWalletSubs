import React, { useState } from "react";
import {
  ConnectWallet,
  useAddress,
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

//Purchase Page component:
function PurchasePage() {
  const [sub, setSub] = useState(false);

  const userWallets = useUserWallets();
  const dynamicAddress = userWallets[0];
  console.log(dynamicAddress?.address);
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    "edition"
  );
  const { data: contractMetadata } = useContractMetadata(contract);
  const { data: nft, isLoading, error } = useNFT(contract, "0");
  console.log(nft);

  const [clientSecret, setClientSecret] = useState("");

  const onClick = async () => {
    const resp = await fetch("/api/stripe-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerWalletAddress: address,
      }),
    });
    if (resp.ok) {
      const json = await resp.json();
      setClientSecret(json.clientSecret);
    }
  };

  const checkout = async () => {
    try {
      const res = await fetch("/api/stripecheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerWalletAddress: dynamicAddress?.address }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const session = await res.json();
      console.log("Session data:", session); // Debugging
      setClientSecret(session.client_secret);
      setSub(true);
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
    }
  };

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw 'Did you forget to add a ".env.local" file?';
  }
  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  console.log(contractMetadata?.image);

  return (
    <main className="flex flex-col gap-y-8 items-center p-12">
      <ConnectWallet />

      {contractMetadata && (
        <div className="flex flex-col gap-8 border border-gray-700 rounded-xl p-12">
          <MediaRenderer className="rounded-lg" src={nft?.metadata.image} />

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold">{contractMetadata.name}</h2>
            <p className="text-gray-500">
              We are using the following contract:{" "}
              {contractMetadata.description ||
                "There was an error getting the contract Metadata"}
            </p>
          </div>
        </div>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:opacity-50"
        onClick={checkout}
      >
        Subscribe
      </button>

      {sub ? (
        <EmbeddedCheckoutProvider stripe={stripe} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p>NONE</p>
      )}
    </main>
  );
}

export default PurchasePage;
