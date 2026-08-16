FROM node:22-bookworm

WORKDIR /app

COPY package.json package-lock.json ./

# need devDependencies too (tsx lives there for this POC)
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN mkdir -p uploads

EXPOSE 3000

# default = API; worker service will override with npm run worker:start
CMD ["npm", "run", "start"]