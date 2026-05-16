const puppeteer = require('puppeteer-core');

const pagesToCapture = [
    { url: 'http://localhost:5173/index.html', file: 'screen1.png' },
    { url: 'http://localhost:5173/test-intro.html', file: 'screen2.png' },
    { url: 'http://localhost:5173/trail.html', file: 'screen3.png' },
    { url: 'http://localhost:5173/avatar.html', file: 'screen4.png' },
    { url: 'http://localhost:5173/lectures.html', file: 'screen5.png' }
];

async function capture() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new',
        defaultViewport: { width: 1280, height: 800 }
    });
    
    for (let p of pagesToCapture) {
        console.log(`Capturing ${p.url}...`);
        const page = await browser.newPage();
        try {
            await page.goto(p.url, { waitUntil: 'networkidle2' });
            await new Promise(r => setTimeout(r, 1000));
            await page.screenshot({ path: p.file });
        } catch (err) {
            console.error(`Failed to capture ${p.url}: ${err.message}`);
        }
        await page.close();
    }
    await browser.close();
    console.log('Capture done.');
}
capture().catch(console.error);
