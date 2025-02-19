const puppeteer = require('puppeteer');

const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the target URL
    const url = 'https://www.northbeach.co.nz/sale/sale-mens/footwear';
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the content to load
    await page.waitForSelector('.ps-category-items.four-wide');

    // Scroll the page gradually to load all products
    const scrollPage = async (page) => {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 200;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 300);
            });
        });
    };
    await scrollPage(page);

    // Get all product links
    const productLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.ps-category-item a')).map(el => el.href);
    });

    let shoesData = [];

    for (const link of productLinks) {
        await page.goto(link, { waitUntil: 'networkidle2' });

        await page.waitForSelector('.product-summary__price.s-price');

        // Extract price and URL details
        const shoeDetails = await page.evaluate(() => {
            const nowPrice = document.querySelector('.s-price__now')?.innerText || 'N/A';
            const wasPrice = document.querySelector('.s-price__was')?.innerText || 'N/A';
            return {
                url: window.location.href,
                priceNow: nowPrice,
                priceWas: wasPrice
            };
        });

        shoesData.push(shoeDetails);

        // Navigate back to the main page
        await page.goBack({ waitUntil: 'networkidle2' });

       
        await new Promise(r => setTimeout(r, randomDelay(2000, 4000)));

    }

    // Log the scraped data
    console.log(shoesData);

    await browser.close();
})();