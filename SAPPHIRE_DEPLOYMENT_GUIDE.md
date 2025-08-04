# 🎯 Sapphire HealthcareAI Deployment Guide

## 🚀 Quick Start

### 1. Get TEST ROSE Tokens for Testing
**Your Testing Wallet:** `0xfE04249705eaa696e7c6fcAEE20aFf8a9C360F67`

#### Option A: Official Sapphire Faucet
1. Go to: https://faucet.sapphire.oasis.io/
2. Enter your address: `0xfE04249705eaa696e7c6fcAEE20aFf8a9C360F67`
3. Request TEST ROSE tokens

#### Option B: Oasis Faucet
1. Go to: https://faucet.oasis.io/
2. Select "Sapphire Testnet"
3. Enter: `0xfE04249705eaa696e7c6fcAEE20aFf8a9C360F67`
4. Request TEST ROSE tokens

### 2. Deploy Contract to Sapphire Testnet

#### Step 1: Configure Hardhat for Sapphire
```bash
cd packages/hardhat
```

#### Step 2: Add Sapphire Network to Hardhat Config
Edit `hardhat.config.ts` to include Sapphire testnet:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sapphireTestnet: {
      url: "https://testnet.sapphire.oasis.io",
      chainId: 23295,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
```

#### Step 3: Set Up Environment Variables
Create `.env` file in `packages/hardhat/`:
```env
PRIVATE_KEY=your_private_key_here
```

#### Step 4: Deploy Contract
```bash
npx hardhat deploy --network sapphireTestnet
```

### 3. Update Frontend Configuration

#### Step 1: Update Contract Address
After deployment, copy the deployed contract address and update `packages/nextjs/contracts/deployedContracts.ts`:

```typescript
const deployedContracts = {
  23295: { // Sapphire Testnet
    HealthcareAI: {
      address: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
      abi: [
        // ... existing ABI
      ],
    },
  },
};
```

#### Step 2: Set AI Backend Address
Once deployed, call the `setAIBackend` function to set your AI backend address:

```bash
npx hardhat console --network sapphireTestnet
```

```javascript
const contract = await ethers.getContract("HealthcareAI");
await contract.setAIBackend("YOUR_AI_BACKEND_ADDRESS");
```

## 🔧 Testing Your Deployment

### 1. Test Contract Functions
```bash
npx hardhat test --network sapphireTestnet
```

### 2. Test Frontend Integration
1. Start the frontend: `yarn start`
2. Navigate to: http://localhost:3000/healthcare
3. Connect your MetaMask wallet
4. Try sending a message

## 💎 Sapphire Benefits

- **Confidential Storage**: All healthcare data is encrypted
- **Privacy**: Only you can access your conversations
- **Security**: Built-in encryption at blockchain level
- **TEST ROSE Tokens**: Free test tokens for development

## 🆘 Troubleshooting

### Insufficient TEST ROSE Balance
- Get more TEST ROSE from: https://faucet.sapphire.oasis.io/
- Check balance in MetaMask

### Contract Not Found
- Verify contract address in `deployedContracts.ts`
- Ensure you're connected to Sapphire testnet in MetaMask

### Network Issues
- Add Sapphire testnet to MetaMask:
  - Network Name: Sapphire Testnet
  - RPC URL: https://testnet.sapphire.oasis.io
  - Chain ID: 23295
  - Currency Symbol: TEST ROSE

## 🎉 Success!

Once deployed, your HealthcareAI system will:
- Store prompts confidentially on Sapphire
- Use TEST ROSE tokens for transactions
- Provide secure healthcare data storage
- Allow user feedback and ratings

Your testing wallet: `0xfE04249705eaa696e7c6fcAEE20aFf8a9C360F67` 