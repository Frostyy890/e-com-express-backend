# Stage 1 - Build
FROM node:20.6.1 AS build

# Install pnpm globally
RUN npm install -g pnpm
# Set working directory
WORKDIR /app
# Copy necessary files
COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/
# Install dependencies
RUN pnpm install --frozen-lockfile
# Copy source code
COPY . .

RUN pnpm start:prod
# Make start script executable
RUN chmod +x ./start.sh

ENTRYPOINT [ "./start.sh" ]



# Stage 2 - Final
FROM node:20.6.1 AS production
# Set working directory
WORKDIR /app

# Copy files from base
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --only=production

COPY --from=build /app/dist ./dist

CMD [ "node", "dist/app.js" ]
