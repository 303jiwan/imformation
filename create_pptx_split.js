const { Jimp } = require('jimp');
const pptxgen = require('pptxgenjs');

async function splitAndCreate() {
    console.log("Loading image with Jimp...");
    const image = await Jimp.read('poster_full.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const halfHeight = Math.floor(height / 2);

    console.log("Cropping top half...");
    const topHalf = image.clone().crop({ x: 0, y: 0, w: width, h: halfHeight });
    await topHalf.write('poster_top.png');

    console.log("Cropping bottom half...");
    const bottomHalf = image.clone().crop({ x: 0, y: halfHeight, w: width, h: height - halfHeight });
    await bottomHalf.write('poster_bottom.png');

    console.log("Creating PPTX...");
    let pres = new pptxgen();

    let pptWidth = 10;
    let pptHeight = pptWidth * (halfHeight / width);

    pres.defineLayout({ name: 'HALF_POSTER', width: pptWidth, height: pptHeight });
    pres.layout = 'HALF_POSTER';

    let slide1 = pres.addSlide();
    slide1.addImage({ path: 'poster_top.png', x: 0, y: 0, w: '100%', h: '100%' });

    let slide2 = pres.addSlide();
    slide2.addImage({ path: 'poster_bottom.png', x: 0, y: 0, w: '100%', h: '100%' });

    await pres.writeFile({ fileName: 'error-card-poster-split.pptx' });
    console.log("Done!");
}

splitAndCreate().catch(console.error);
