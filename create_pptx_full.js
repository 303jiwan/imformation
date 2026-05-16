const puppeteer = require('puppeteer-core');
const pptxgen = require('pptxgenjs');
const fs = require('fs');

async function run() {
    console.log("Launching Edge...");
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1080 }); // Initial viewport
    console.log("Navigating to page...");
    await page.goto('http://localhost:5174/error-card-poster.html', { waitUntil: 'networkidle0' });

    // Wait a little bit for fonts/animations
    await new Promise(r => setTimeout(r, 1000));

    const dimensions = await page.evaluate(() => {
        return {
            width: document.documentElement.scrollWidth,
            height: document.documentElement.scrollHeight
        };
    });

    console.log("Page dimensions:", dimensions);

    await page.screenshot({ path: 'poster_full.png', fullPage: true });
    await browser.close();
    console.log("Screenshot saved.");

    // Create PPTX
    let pres = new pptxgen();
    
    // Convert px to inches (assuming 96 DPI, but let's just use aspect ratio)
    // PPT max size is 56 inches. Let's make width = 10 inches, height = 10 * (height/width)
    let pptWidth = 10;
    let pptHeight = pptWidth * (dimensions.height / dimensions.width);
    
    if (pptHeight > 56) {
        // Cap at 56 inches
        pptHeight = 56;
        pptWidth = 56 * (dimensions.width / dimensions.height);
    }

    pres.defineLayout({ name: 'FULL_POSTER', width: pptWidth, height: pptHeight });
    pres.layout = 'FULL_POSTER';

    let slide = pres.addSlide();
    slide.addImage({ path: 'poster_full.png', x: 0, y: 0, w: '100%', h: '100%' });

    await pres.writeFile({ fileName: 'error-card-poster-full.pptx' });
    console.log("PPTX created successfully with full dimensions.");
}

run().catch(console.error);
