const pptxgen = require("pptxgenjs");

async function createPoster() {
    let pres = new pptxgen();
    // A4 size, commonly used for such posters
    pres.layout = 'LAYOUT_16x9'; // Let's use standard first, then resize if needed, or define custom

    pres.defineLayout({ name: 'POSTER', width: 8.27, height: 11.69 });
    pres.layout = 'POSTER';

    let slide = pres.addSlide();
    
    // Add image, scale to fit width while keeping aspect ratio. 
    // width: 8.27. So if we stretch it to width 8.27, we can set h: 'auto'. But 'auto' might not be supported.
    // I'll set width and height to 100%.
    slide.addImage({ path: 'poster.png', x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'contain', w: 8.27, h: 11.69 } });

    await pres.writeFile({ fileName: 'error-card-poster.pptx' });
    console.log("PPTX created successfully.");
}

createPoster();
