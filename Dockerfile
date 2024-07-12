FROM ghcr.io/puppeteer/puppeteer:20.9.0
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

RUN groupadd -r mygroup && useradd -r -g mygroup myuser
RUN chown -R myuser:mygroup /usr/src/app
USER myuser
COPY package*.json ./
RUN chmod -R 755 /usr/src/app/html-templates /usr/src/app/finalPDF /urs/src/app/pdfOutput

RUN npm ci
COPY . .
CMD ["node", "app.js"]
