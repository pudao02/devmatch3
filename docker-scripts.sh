#!/bin/bash

# Docker scripts for Scaffold-ETH 2
# Usage: ./docker-scripts.sh [command]

set -e

case "$1" in
  "dev")
    echo "Starting development environment..."
    docker-compose up
    ;;
  "dev-build")
    echo "Building and starting development environment..."
    docker-compose up --build
    ;;
  "prod")
    echo "Starting production environment..."
    docker-compose -f docker-compose.prod.yml up --build
    ;;
  "deploy")
    echo "Deploying contracts..."
    docker-compose --profile deploy up deploy
    ;;
  "stop")
    echo "Stopping all containers..."
    docker-compose down
    ;;
  "clean")
    echo "Cleaning up Docker resources..."
    docker-compose down -v
    docker system prune -f
    ;;
  "logs")
    echo "Showing logs..."
    docker-compose logs -f
    ;;
  "frontend-logs")
    echo "Showing frontend logs..."
    docker-compose logs -f frontend
    ;;
  "hardhat-logs")
    echo "Showing hardhat logs..."
    docker-compose logs -f hardhat-node
    ;;
  "shell")
    echo "Opening shell in frontend container..."
    docker-compose exec frontend sh
    ;;
  "hardhat-shell")
    echo "Opening shell in hardhat container..."
    docker-compose exec hardhat-node sh
    ;;
  "build-dev")
    echo "Building development image..."
    docker build -f Dockerfile.dev -t se2-dev .
    ;;
  "build-prod")
    echo "Building production image..."
    docker build -t se2-prod .
    ;;
  "test")
    echo "Running tests in container..."
    docker-compose exec frontend yarn test
    ;;
  "compile")
    echo "Compiling contracts..."
    docker-compose exec hardhat-node yarn compile
    ;;
  "push-image")
    if [ -z "$2" ]; then
      echo "Usage: $0 push-image <dockerhub-username/repo:tag>"
      exit 1
    fi
    IMAGE_TAG="$2"
    echo "Building development image as $IMAGE_TAG..."
    docker build -f Dockerfile.dev -t "$IMAGE_TAG" .
    echo "Pushing $IMAGE_TAG to Docker Hub..."
    docker push "$IMAGE_TAG"
    ;;
  *)
    echo "Usage: $0 {dev|dev-build|prod|deploy|stop|clean|logs|frontend-logs|hardhat-logs|shell|hardhat-shell|build-dev|build-prod|test|compile|push-image}"
    echo ""
    echo "Commands:"
    echo "  dev          - Start development environment"
    echo "  dev-build    - Build and start development environment"
    echo "  prod         - Start production environment"
    echo "  deploy       - Deploy contracts"
    echo "  stop         - Stop all containers"
    echo "  clean        - Clean up Docker resources"
    echo "  logs         - Show all logs"
    echo "  frontend-logs - Show frontend logs"
    echo "  hardhat-logs - Show hardhat logs"
    echo "  shell        - Open shell in frontend container"
    echo "  hardhat-shell - Open shell in hardhat container"
    echo "  build-dev    - Build development image"
    echo "  build-prod   - Build production image"
    echo "  test         - Run tests"
    echo "  compile      - Compile contracts"
    echo "  push-image   - Build and push Docker image to Docker Hub (usage: $0 push-image <dockerhub-username/repo:tag>)"
    exit 1
    ;;
esac