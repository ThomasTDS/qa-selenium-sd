FROM node:24-slim

# Instala o Google Chrome estável (mesmo navegador usado no job de CI)
# ca-certificates é necessário para o wget validar HTTPS — a imagem *-slim não
# vem com ele por padrão, o que faz o download da chave falhar silenciosamente.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates wget gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV BROWSER=chrome
ENV HEADLESS=true

CMD ["npm", "test"]
