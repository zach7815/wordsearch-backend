FROM ghcr.io/puppeteer/puppeteer:20.9.0
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=TRUE \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .m
RUN mkdir -p ./html-templates ./finalPDF ./pdfOutput
RUN chmod -R 755 ./html-templates ./finalPDF ./pdfOutput
CMD ["node", "app.js"]
