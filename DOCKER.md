# Docker Setup for Scaffold-ETH 2

This document explains how to run your Scaffold-ETH 2 application using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   docker-compose up
   ```

   This will start:
   - Hardhat blockchain node on port 8545
   - Next.js frontend on port 3000

2. **Deploy contracts (in a separate terminal):**
   ```bash
   docker-compose --profile deploy up deploy
   ```

3. **Access your application:**
   - Frontend: http://localhost:3000
   - Hardhat node: http://localhost:8545

### Production Environment

1. **Build and start production containers:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

2. **Access your application:**
   - Frontend: http://localhost:3000

## Individual Docker Commands

### Development

```bash
# Build development image
docker build -f Dockerfile.dev -t se2-dev .

# Run development container
docker run -p 3000:3000 -p 8545:8545 -v $(pwd):/app se2-dev

# Run with specific command
docker run -p 3000:3000 -v $(pwd):/app se2-dev yarn chain
```

### Production

```bash
# Build production image
docker build -t se2-prod .

# Run production container
docker run -p 3000:3000 se2-prod
```

## Docker Compose Services

### Development (`docker-compose.yml`)

- **hardhat-node**: Runs the local blockchain node
- **frontend**: Runs the Next.js development server
- **deploy**: Deploys contracts to the blockchain (profile service)

### Production (`docker-compose.prod.yml`)

- **frontend**: Runs the optimized Next.js production server

## Environment Variables

You can customize the behavior by setting environment variables:

```bash
# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Volumes

The development setup uses volumes for hot reloading:

- `./packages/nextjs`: Frontend source code
- `./packages/hardhat`: Smart contract source code
- `./packages/hardhat/deployments`: Contract deployment artifacts

## Useful Commands

```bash
# View logs
docker-compose logs -f frontend
docker-compose logs -f hardhat-node

# Execute commands in running containers
docker-compose exec frontend yarn test
docker-compose exec hardhat-node yarn compile

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build

# Clean up
docker-compose down -v
docker system prune -f
```

## Troubleshooting

### Port Conflicts
If ports 3000 or 8545 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Map host port 3001 to container port 3000
```

### Permission Issues
If you encounter permission issues on Linux/macOS:

```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Or run with current user
docker-compose run --user $(id -u):$(id -g) frontend
```

### Build Issues
If the build fails, try:

```bash
# Clean build
docker-compose build --no-cache

# Or rebuild specific service
docker-compose build --no-cache frontend
```

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Set production environment variables
2. **Reverse Proxy**: Use nginx or similar for SSL termination
3. **Database**: Connect to external blockchain networks
4. **Monitoring**: Add health checks and logging

Example production deployment:

```bash
# Build production image
docker build -t se2-prod .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY \
  --name se2-prod \
  se2-prod
```

## Security Considerations

- Never commit `.env` files to version control
- Use secrets management in production
- Regularly update base images
- Run containers as non-root users (already configured)
- Use multi-stage builds to reduce attack surface 