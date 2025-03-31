# Wallet-Integrated Payment System

## Project Overview

This project integrates Stripe payments, dynamic wallet management, and Thirdweb Engine to create a comprehensive system for managing cryptocurrency transactions and NFT subscriptions using smart contracts. It provides a seamless user experience for purchasing NFTs, handling subscriptions, and interacting with smart contracts across Ethereum-compatible blockchains, primarily focusing on Ethereum and Polygon (Mumbai).

## Key Features

- **Managed Wallet Integration**: Supports secure backend wallets, including local backups and cloud integration (AWS KMS, Google KMS).
- **EVM Chain Compatibility**: Compatible with over 1000 EVM-based blockchains, including private subnets.
- **High Transaction Throughput**: Optimized blockchain transaction processing with parallel execution and automatic retries for stalled transactions.
- **Smart Contract Management**: Deploy and interact with tokens, NFTs, marketplaces, and account abstraction.
- **Account Abstraction**: Manage smart accounts, access controls, and transaction delegation.
- **Gasless Transactions**: Utilize gasless relayers to cover transaction costs and enhance user experience.
- **Real-Time Notifications**: Automate workflows through webhooks, providing immediate updates for wallet and contract events.
- **Advanced Analytics (Coming Soon)**: Detailed transaction histories, event logs, and financial summaries.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd wallet-integrated-payment-system
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   Create a `.env.local` file with your configuration:

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

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

## Usage

- **Application Launch**: Open `http://localhost:3000` in your browser after starting the server.
- **Transactions and Subscriptions**: Use the provided interface to purchase NFTs and manage subscriptions through Stripe.
- **Smart Contract Interaction**: Deploy and interact with smart contracts using integrated Thirdweb Engine functionality.

## Technology Stack

- **Stripe**: Payment and subscription management.
- **Thirdweb Engine**: Blockchain smart contract deployment and management.
- **Dynamic Wallets**: User wallet integration and management.

## Project Structure and Explanation

### `src/app/api/stripecheckout/route.ts`

- Manages the Stripe checkout process, customer creation, and session initiation.

### `src/app/api/stripesubs/route.ts`

- Handles Stripe subscription sessions and user billing portal interactions.

### `src/app/api/webhook/route.ts`

- Processes Stripe webhooks securely and automates post-payment workflows, including NFT minting.

### `src/app/components/CreditCardForm.tsx`

- Securely captures payment details and integrates with Stripe to process transactions.

### `src/app/components/PurchasePage.tsx`

- Central user interface for initiating NFT purchases and managing subscriptions, integrating Dynamic Wallet and Stripe.

### `src/app/page.tsx`

- Application entry point, initializing Thirdweb and Dynamic Wallet providers, and rendering core application components.

## Windows-Specific Configuration

### Docker and Memory Management

For Windows users running Docker:

- **Port Management**:
  - Disable PostgreSQL services on your host machine to avoid port conflicts.

- **WSL2 Memory Management**:
  - Create a `.wslconfig` file in your user directory (`C:\Users\YourUsername`) with the following settings:

    ```ini
    [wsl2]
    memory=1GB
    ```
  - Restart WSL2 by rebooting your machine or executing:

    ```bash
    wsl --shutdown
    ```

This configuration optimizes Docker and WSL2 resource usage, preventing memory issues on Windows.

