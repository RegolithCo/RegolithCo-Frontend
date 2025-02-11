# Dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

# Install wget if not already installed
RUN apt-get update && apt-get install -y wget

# Install Gatsby CLI and Yarn
RUN npm install -g yarn dotenv-cli

# Let's get the latest version of Yarn
RUN corepack enable
RUN yarn set version berry

# Download .zshrc from remote address
USER node
COPY ./cfg/regolith-ys.zsh-theme ~/.oh-my-zsh/custom/themes/regolith-ys.zsh-theme
COPY ./cfg/aliases ~/.aliases
COPY ./cfg/zshrc ~/.zshrc