import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
import * as ejs from 'ejs';
import pkg from 'lodash';
const { escape } = pkg;
import { Wordsearch } from './classes/wordsearch.class.js';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { htmlToPDF } from './puppeteerFunctions/pdfCreation.js';
import { mergePDFS } from './puppeteerFunctions/mergePDF.js';
import { emptyDirectory } from './utils/emptyDirectories.js';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { headerPaths } from './utils/paths.js';
dotenv.config();
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wordsearch-frontend.onrender.com/');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'append,delete,entries,foreach,get,has,keys,set,values,Authorization');
    next();
});
app.use(cors());
const currentModulePath = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentModulePath);
const viewsDirectory = join(currentDirectory, 'views');
app.set('views', viewsDirectory);
app.set('view engine', 'ejs');
app.post('/api/WordsearchData', (req, res) => {
    console.log('I have been pinged');
    const { submission } = req.body;
    const { authorName, header, title, difficulty, words } = submission;
    const removedNullsOrBlanks = words.filter((word) => word !== null || '');
    const removeRepeats = removedNullsOrBlanks.filter((word, index) => removedNullsOrBlanks.indexOf(word) === index);
    const escapedWords = removeRepeats.map((word) => escape(word));
    const escapedUserDetails = [
        authorName,
        header,
        title,
        difficulty,
    ].map((info) => escape(info ?? ''));
    const wordsearch = new Wordsearch(escapedWords, difficulty);
    wordsearch.makeGrid();
    const answers = wordsearch.placeWords();
    wordsearch.fillGrid();
    const wordPositions = wordsearch.wordLocations;
    console.log(wordPositions);
    const finishedWordSearch = wordsearch.showGrid;
    const wordSearchTemplate = readFileSync(join(viewsDirectory, 'wordsearch.ejs'), 'utf-8');
    const data = {
        authorName: escapedUserDetails[0],
        header: escapedUserDetails[1],
        title: escapedUserDetails[2],
        wordSearchData: finishedWordSearch,
        answers: answers,
        words: escapedWords,
        level: escapedUserDetails[3],
        wordLocations: wordPositions,
    };
    const answersTemplate = readFileSync(join(viewsDirectory, 'answers.ejs'), 'utf-8');
    const htmlWordSearch = ejs.render(wordSearchTemplate, {
        headerPaths,
        ...data,
    });
    const htmlAnswerGrid = ejs.render(answersTemplate, { ...data });
    const wordSearchFileName = `${data.title}.html`;
    const answerSheetFileName = `${data.title}_answers.html`;
    try {
        writeFileSync(`./html-templates/${wordSearchFileName}`, htmlWordSearch, 'utf8');
        writeFileSync(`./html-templates/${answerSheetFileName}`, htmlAnswerGrid, 'utf8');
        (async function convertToPDF() {
            await htmlToPDF(`./html-templates/${wordSearchFileName}`, title);
            await htmlToPDF(`./html-templates/${answerSheetFileName}`, title + 'answers');
        })()
            .then(async () => {
            const finalPDFPath = await mergePDFS(`./pdfOutput/${title}.pdf`, `./pdfOutput/${title}answers.pdf`);
            return finalPDFPath;
        })
            .then((finalPDFPath) => {
            emptyDirectory('./html-templates');
            emptyDirectory('./pdfOutput');
            if (finalPDFPath) {
                const verifiedPath = path.resolve(finalPDFPath);
                const pdf = readFileSync(verifiedPath);
                const dataUrl = `data:application/pdf;base64,${pdf.toString('base64')}`;
                res.status(200).json({
                    data: {
                        data: [data],
                        dataURL: dataUrl,
                    },
                });
            }
            else {
                console.error('finalPDFPath is undefined');
            }
        })
            .then(() => {
            emptyDirectory('./finalPDF');
        })
            .finally(() => {
            console.log('wordsearch sheet created');
        });
    }
    catch (error) {
        console.log(error);
    }
});
const PORT = process.env.PORT ?? 3000;
app.get('/', (req, res) => {
    res.send('The wordsearch app is running');
});
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map