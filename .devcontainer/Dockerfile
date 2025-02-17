FROM node:22-bullseye

# Update package index and install necessary packages (unzip, less, wget)
RUN apt-get update && \
    apt-get install -y unzip less wget && \
    rm -rf /var/lib/apt/lists/*

# Install global npm dependencies
RUN npm install -g pnpm turbo

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

RUN apt update && apt install -y zip

# Install Terraform version 1.10.5
ENV TERRAFORM_VERSION=1.10.5
RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    mv terraform /usr/local/bin/terraform && \
    rm terraform_${TERRAFORM_VERSION}_linux_amd64.zip

WORKDIR /workspace
