const { Jimp } = require('jimp');
const pptxgen = require('pptxgenjs');

async function split3AndCreate() {
    console.log("Loading image with Jimp...");
    const image = await Jimp.read('poster_full.png');
    const width = image.bitmap.width;

    const y4 = Math.floor(1132.75);
    const y7 = Math.floor(3838.1875);
    const totalHeight = 4216;

    console.log("Cropping slice 1 (1~3)...");
    const slice1 = image.clone().crop({ x: 0, y: 0, w: width, h: y4 });
    await slice1.write('poster_slice1.png');

    console.log("Cropping slice 2 (4~6)...");
    const slice2 = image.clone().crop({ x: 0, y: y4, w: width, h: y7 - y4 });
    await slice2.write('poster_slice2.png');

    console.log("Cropping slice 3 (7~10)...");
    const slice3 = image.clone().crop({ x: 0, y: y7, w: width, h: totalHeight - y7 });
    await slice3.write('poster_slice3.png');

    console.log("Creating PPTX...");
    let pres = new pptxgen();

    // Use height of the tallest slice (slice2) to determine the uniform slide size.
    let pptWidth = 10;
    let pptHeight = pptWidth * ((y7 - y4) / width);

    pres.defineLayout({ name: 'THREE_SPLIT', width: pptWidth, height: pptHeight });
    pres.layout = 'THREE_SPLIT';

    // Helper: align image to top instead of center by computing y manually if we want,
    // but pptxgenjs contain centers it. Let's just calculate it.
    function addTopAligned(slide, imageFile, hPx) {
        let hInches = pptWidth * (hPx / width);
        // y=0 means top
        slide.addImage({ path: imageFile, x: 0, y: 0, w: pptWidth, h: hInches });
    }

    let s1 = pres.addSlide();
    addTopAligned(s1, 'poster_slice1.png', y4);

    let s2 = pres.addSlide();
    addTopAligned(s2, 'poster_slice2.png', y7 - y4);

    let s3 = pres.addSlide();
    addTopAligned(s3, 'poster_slice3.png', totalHeight - y7);

    await pres.writeFile({ fileName: 'error-card-poster-3screens.pptx' });
    console.log("Done!");
}

split3AndCreate().catch(console.error);
