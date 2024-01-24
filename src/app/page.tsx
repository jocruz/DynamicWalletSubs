"use client";

import { embeddedWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import {
  DynamicContextProvider,
  DynamicWidget,
  useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import PurchasePage from "./components/PurchasePage";

export default function Home() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT}
      supportedWallets={[embeddedWallet()]}
    >
      <DynamicContextProvider
        settings={{
          // Find your environment id at https://app.dynamic.xyz/dashboard/developer
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_WALLET_ID as string,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWidget />
        <PurchasePage />
      </DynamicContextProvider>
    </ThirdwebProvider>
  );
}
