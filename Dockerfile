FROM ghcr.io/puppeteer/puppeteer:20.9.0
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
RUN mkdir -p ./html-templates && chmod -R 755 ./html-templates
RUN mkdir -p ./finalPDF && chmod -R 755 ./finalPDF
RUN mkdir -p ./pdfOutput && chmod -R 755 ./pdfOutput
COPY . .
CMD ["node", "app.js"]