FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g serve

COPY . .

ENV VITE_API_URL=http://backend:8000

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]