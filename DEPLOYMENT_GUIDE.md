# HealthcareAI Contract Deployment Guide

## Prerequisites
- Node.js and Yarn installed
- A wallet with some test ETH for gas fees
- Access to a Sapphire network (testnet or local)

## Step 1: Fix Dependencies (if needed)
If you encounter dependency issues, try:
```bash
# Clean and reinstall
rm -rf node_modules
yarn install

# Or try with npm
npm install
```

## Step 2: Deploy the Contract

### Option A: Deploy to Local Network
```bash
# Start local blockchain
yarn chain

# In another terminal, deploy the contract
yarn deploy --tags HealthcareAI
```

### Option B: Deploy to Sapphire Testnet
```bash
# Set your private key (replace with your actual private key)
export PRIVATE_KEY=your_private_key_here

# Deploy to Sapphire testnet
yarn deploy --network sapphire-testnet --tags HealthcareAI
```

### Option C: Deploy to Sapphire Mainnet
```bash
# Set your private key
export PRIVATE_KEY=your_private_key_here

# Deploy to Sapphire mainnet
yarn deploy --network sapphire --tags HealthcareAI
```

## Step 3: Update Contract Address
After deployment, copy the contract address from the output and update it in:
`packages/nextjs/contracts/deployedContracts.ts`

Replace the address in the appropriate network section (31337 for local, 0x5aff for testnet, etc.)

## Step 4: Set AI Backend Address
After deployment, you need to set the AI backend address:
```bash
# Get the deployed contract address from step 3
# Then call setAIBackend with your AI backend wallet address
```

## Step 5: Test the System
1. Start the frontend: `yarn start`
2. Navigate to: `http://localhost:3000/healthcare`
3. Connect your wallet
4. Try sending a message

## Contract Functions

### For Users:
- `submitPrompt(string prompt)` - Submit a healthcare question
- `getMyPrompts()` - Get your prompt history
- `getMyResponses()` - Get AI responses for your prompts
- `submitFeedback(uint promptId, uint8 rating, string comment)` - Submit feedback

### For AI Backend:
- `storeResponse(address user, string output)` - Store AI response (only callable by AI backend)

### For Contract Owner:
- `setAIBackend(address _backend)` - Set the AI backend address

## Testing
Run the test suite:
```bash
cd packages/hardhat
yarn test
```

## Troubleshooting

### Dependency Issues
If you get `@noble/hashes` errors:
1. Clear yarn cache: `yarn cache clean`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `yarn install`

### Contract Not Found
If the frontend can't find the contract:
1. Check the contract address in `deployedContracts.ts`
2. Ensure you're on the correct network
3. Verify the ABI is correct

### Permission Errors
If you get "Not authorized" errors:
1. Make sure the AI backend address is set correctly
2. Only the AI backend can call `storeResponse`
3. Only the contract owner can call `setAIBackend` 