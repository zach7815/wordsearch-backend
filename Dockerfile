FROM ghcr.io/puppeteer/puppeteer:20.9.0
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN mkdir -p ./html-templates ./finalPDF ./pdfOutput
COPY . .
USER root
CMD ["node", "app.js"]