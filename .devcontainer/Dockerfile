FROM node:22-bullseye

# Install global dependencies
RUN npm install -g pnpm turbo

# Install AWS CLI
RUN apt-get update && apt-get install -y unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install

WORKDIR /workspace
