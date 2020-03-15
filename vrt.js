const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");

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

    console.log('ENV : ',process.env)
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        await fs.readFile(`../screenshots/vrt-color-pallete.spec.js/VRT${process.env.PICTURE_1}.PNG`),
        await fs.readFile(`../screenshots/vrt-color-pallete.spec.js/VRT${process.env.PICTURE_2}.PNG`),
        options
    );
    await fs.writeFile(`../results/output${process.env.PICTURE_1}.PNG`, data.getBuffer());
    await fs.writeFile(`../results/output${process.env.PICTURE_1}.json`, data);
    return data;

}

module.exports = compareTwoImages;