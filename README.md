# Solana-crowdfunding
A decentralized crowdfunding platform built on Solana blockchain using Rust and Anchor framework. This project allows users to create and contribute to crowdfunding campaigns securely on-chain.

🚀 Features

Create crowdfunding campaigns with a funding goal.

Contribute SOL to active campaigns.

Track total funds raised.

Secure handling of funds via Solana smart contract (PDA-based).

Fully tested using Anchor test suite.

🛠️ Tech Stack

Solana (Blockchain)

Rust (Smart Contract)

Anchor Framework (Program development & testing)

Mocha/TypeScript (Anchor tests)

## 📂 Project Structure  
Solana-crowdfunding/
├── Anchor.toml # Anchor configuration file
├── Cargo.toml # Rust dependencies
├── migrations/ # Deployment scripts
├── programs/ # Rust smart contract programs
│ └── crowdfunding/
│ ├── Cargo.toml
│ └── src/
│ └── lib.rs # Main smart contract logic
├── tests/ # Anchor test files (TypeScript/Mocha)
│ └── crowdfunding.ts
└── README.md # Project documentation




⚡ Prerequisites

Make sure you have the following installed:

Rust
 (latest stable)

Solana CLI
 (≥ v1.18)

Anchor
 (≥ v0.29.0)

Node.js (≥ 16) & Yarn/NPM

🔧 Setup & Build
# Clone the repo
git clone https://github.com/Harsh-Kumar3813/Solana-crowdfunding.git

cd Solana-crowdfunding

# Install dependencies
yarn install   # or npm install

# Build the smart contract
anchor build

# Deploy to localnet
anchor deploy


🧪 Running Tests
# Run Anchor tests
anchor test

📈 Roadmap

 Smart contract in Rust

 Anchor test cases

 Frontend integration (React/Next.js)

 Deployment to devnet/mainnet

🤝 Contributing

Pull requests are welcome! If you’d like to improve functionality, add UI, or extend features, feel free to fork and submit a PR.
