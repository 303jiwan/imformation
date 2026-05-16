const puppeteer = require('puppeteer-core');

async function run() {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1080 });
    await page.goto('http://localhost:5174/error-card-poster.html', { waitUntil: 'networkidle0' });

    const coordinates = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h2, div, section'));
        
        let y4 = -1;
        let y7 = -1;

        for (const el of headings) {
            const text = el.innerText || el.textContent;
            if (text.includes('§4')) {
                const rect = el.getBoundingClientRect();
                // we want a bit of padding above the heading
                y4 = rect.top + window.scrollY - 20;
            }
            if (text.includes('§7')) {
                const rect = el.getBoundingClientRect();
                y7 = rect.top + window.scrollY - 20;
            }
        }

        return {
            totalHeight: document.documentElement.scrollHeight,
            y4,
            y7
        };
    });

    console.log(JSON.stringify(coordinates));
    await browser.close();
}

run().catch(console.error);
