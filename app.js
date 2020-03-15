const express = require('express');
const app = express();
const shell = require('shelljs');
let num = 0;

const moment = require('moment');

const compareImages = require("resemblejs/compareImages");
const fs2 = require("mz/fs");

const testFolder = './scripts/cypress/screenshots/vrt-color-pallete.spec.js';
const testFolderResults = './scripts/cypress/results';
const testFolderRoute = 'scripts/cypress/screenshots/vrt-color-pallete.spec.js';
const testFolderResultsRoute = 'scripts/cypress/results';
const fs = require('fs');
const cors = require('cors');

app.use(cors({origin: 'http://localhost:8080'}));

app.get('/',  (req, res) => {
    const results = [];
    fs.readdirSync(testFolder).forEach(file => {
        console.log(file);
        let fileSplit = file.split('.');
        console.log(fileSplit);
        if(results[parseInt(fileSplit[1])] !== undefined) {
            results[parseInt(fileSplit[1])].push(`${testFolderRoute}/${file}`);
        } else {
            results[parseInt(fileSplit[1])] = [`${testFolderRoute}/${file}`];
        }
    });
    fs.readdirSync(testFolderResults).forEach(file => {
        console.log(file);
        let fileSplit = file.split('.');
        console.log(fileSplit);
        if(results[parseInt(fileSplit[1])] !== undefined) {
            file = fileSplit[fileSplit.length-1] === 'json' ? fs.readFileSync(`${testFolderResultsRoute}/${file}`) : `${testFolderResultsRoute}/${file}`;
            file = (typeof file) === 'object' ? JSON.parse(file) : file;
            results[parseInt(fileSplit[1])].push(file);
        } else {
            results[parseInt(fileSplit[1])] = [`${testFolderResultsRoute}/${file}`];
        }
    });
    console.log(results);
    res.send(results);
});

app.post('/', async(req,res) => {
    try {
        console.log('NUM: ', num);
        shell.env['PICTURE_1'] = `.${num}.1`
        shell.env['PICTURE_2'] = `.${num}.2`
        shell.exec('npm run cypress:run');

        let data = await compareTwoImages();
        num = num + 1;
        console.log('NUM: ', num);
        data.fecha = moment().format('YYY-MM-DD HH:mm');
        res.json({succes: true, data: data});
    } catch (error) {
        console.log(error);
    }
});

const compareTwoImages = async() => {
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };

    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        await fs2.readFile(`./scripts/cypress/screenshots/vrt-color-pallete.spec.js/VRT${process.env.PICTURE_1}.png`),
        await fs2.readFile(`./scripts/cypress/screenshots/vrt-color-pallete.spec.js/VRT${process.env.PICTURE_2}.png`),
        options
    );
    await fs2.writeFile(`./scripts/cypress/results/output${process.env.PICTURE_1}.png`, data.getBuffer());
    await fs2.writeFile(`./scripts/cypress/results/output${process.env.PICTURE_1}.json`, JSON.stringify(data));
    return data;

}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});