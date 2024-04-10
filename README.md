# Project Name: Wallet-Integrated Payment System

## 🚀 Overview

This project integrates Stripe payments, dynamic wallets, and Thirdweb Engine to provide a comprehensive solution for managing cryptocurrency transactions and smart contracts. It offers a seamless user experience for buying NFTs, managing subscriptions, and handling smart contracts across various EVM chains.

## ✨ Features

- **Managed Backend Wallets**: Utilize company wallets with local backups or integration with AWS KMS / Google KMS.
- **EVM Chain Compatibility**: Supports interactions with any contract on over 1000 EVM blockchains, including private subnets.
- **High Transaction Throughput**: Ensures efficient blockchain transaction processing, parallel execution, and automatic retries for stuck transactions.
- **Smart Contracts**: Deploy and interact with various smart contracts, including tokens, NFTs, marketplaces, and smart accounts.
- **Account Abstraction**: Manage smart accounts, control access with session keys, and perform transactions on behalf of users.
- **Gasless Transactions**: Implement gasless relayers to sponsor user transactions and streamline operations.
- **Real-Time Notifications**: Leverage webhooks for wallet and contract events to automate workflows, like email notifications and customer billing.
- **Advanced Analytics (Coming Soon)**: Access detailed transaction histories, event logs, and financial summaries for backend wallets.

## 📦 Installation

1. Clone the repository

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure your environment variables in a `.env.local` file:

   ```plaintext
   STRIPE_SECRET_KEY=your_stripe_secret_key
   WEBHOOK_SECRET_KEY=your_webhook_secret_key
   ENGINE_URL=your_thirdweb_engine_url
   ENGINE_ACCESS_TOKEN=your_access_token
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your_nft_contract_address
   NEXT_PUBLIC_BACKEND_WALLET=your_backend_wallet_address
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   NEXT_PUBLIC_THIRDWEB_CLIENT=your_thirdweb_client_id
   NEXT_PUBLIC_DYNAMIC_WALLET_ID=your_dynamic_wallet_id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## 🔧 Usage

1. **Start the Application**: Run the development server and navigate to `http://localhost:3000` in your web browser.

2. **Make a Transaction**: Use the web interface to initiate and manage subscriptions or purchase NFTs.

3. **Manage Subscriptions**: Access the Stripe billing portal to manage user subscriptions and payments.

4. **Interact with Smart Contracts**: Deploy and manage smart contracts using the Thirdweb Engine integrated into the application.

## 🛠️ Technologies Used

- **Stripe**: For handling payments and subscription management.
- **Thirdweb Engine**: For deploying and managing smart contracts and blockchain interactions.
- **Dynamic Wallets**: For integrating user wallet management within the application.


## Files & Explaination

### `src/app/api/stripecheckout/route.ts`

- **Purpose**: This file handles the Stripe checkout process.
- **Functionality**:
  - Verifies the Stripe secret key and buyer's wallet address.
  - Searches for existing Stripe customers linked to the wallet address; if none found, creates a new customer.
  - Initiates a Stripe checkout session for the customer, preparing for the subscription or payment process.

### `src/app/api/stripesubs/route.ts`

- **Purpose**: Manages Stripe subscription sessions.
- **Functionality**:
  - Confirms the presence of the Stripe secret key.
  - Retrieves customer information based on the wallet address.
  - Creates a Stripe billing portal session, allowing customers to manage their subscriptions.

### `src/app/api/webhook/route.ts`

- **Purpose**: Processes webhooks from Stripe to handle various events, such as the completion of a checkout session.
- **Functionality**:
  - Validates the Stripe webhook signature to ensure the request's authenticity.
  - Processes the `checkout.session.completed` event to finalize the transaction, potentially minting an NFT using Thirdweb Engine based on the transaction details.

### `src/app/components/CreditCardForm.tsx`

- **Purpose**: Renders a form for credit card information input and handles payment submission.
- **Functionality**:
  - Uses Stripe’s `PaymentElement` for secure credit card input.
  - Manages payment state, including loading and completion statuses.
  - Submits the payment through Stripe and provides user feedback based on the transaction outcome.

### `src/app/components/PurchasePage.tsx`

- **Purpose**: Provides the main interface for initiating NFT purchases and managing Stripe subscriptions.
- **Functionality**:
  - Displays NFT and contract information.
  - Integrates with Stripe for initiating checkout and managing subscriptions.
  - Uses Dynamic Wallet integration to retrieve and use the buyer’s wallet address.

### `src/app/page.tsx`

- **Purpose**: Serves as the entry point for the web application, integrating Thirdweb and Dynamic Wallet providers.
- **Functionality**:
  - Sets up the Thirdweb and Dynamic contexts to interact with blockchain and wallets.
  - Renders the `PurchasePage` component, centralizing the application's functionality.

These files collectively create a web application capable of handling blockchain transactions, including NFT minting and management, subscriptions, and payments through Stripe, while integrating user wallets and ensuring a seamless experience.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
