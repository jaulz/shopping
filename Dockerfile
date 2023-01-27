FROM node:18

# Copy project
COPY . /tmp/shopping
WORKDIR /tmp/shopping
RUN ls -la .
RUN yarn 

# Build project
RUN yarn build

# Expose port
EXPOSE 8080

ENTRYPOINT [ "yarn", "start" ]