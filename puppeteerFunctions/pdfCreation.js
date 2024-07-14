import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
export const htmlToPDF = async (htmlFile, title) => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : await puppeteer.executablePath(),
    });
    console.log(htmlFile);
    const page = await browser.newPage();
    const html = readFileSync(htmlFile, 'utf-8');
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
    await page.setViewport({ width: 800, height: 600 });
    const pdfBuffer = await page.pdf({
        format: 'letter',
        margin: {
            top: '0.1in',
            right: '0.1in',
            bottom: '0.1in',
            left: '0.1in',
        },
    });
    await browser.close();
    const pdfFileName = `${title}.pdf`;
    writeFileSync(`./pdfOutput/${pdfFileName}`, pdfBuffer);
};
