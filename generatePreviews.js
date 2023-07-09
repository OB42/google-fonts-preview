const puppeteer = require('puppeteer');
const fs = require('fs');
const fonts = require('./fonts.json').filter(x => x.type === 'google');// from https://api.fontsource.org/v1/fonts
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < fonts.length; i++) {
    const fontFamily = fonts[i].family;
    const fontUrl = 'https://fonts.googleapis.com/css2?family=' + fontFamily.replace(/\s+/g, "+");
    const previewHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <link href="${fontUrl}" rel="stylesheet">
        <style>
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .text {
            font-family: '${fontFamily}';
            font-size: 48px;
          }
        </style>
      </head>
      <body>
        <div class="text">Aa</div>
      </body>
      </html>
    `;
    await page.goto('data:text/html,' + previewHtml, {waitUntil: 'networkidle2'});
    const element = await page.$('.text');
    const screenshot = await element.screenshot();
    const outputFilename = `./fonts/${fontFamily}.png`;
    fs.writeFileSync(outputFilename, screenshot);
    console.log(`Generated preview for ${fontFamily}: ${outputFilename}`);
  }
  await browser.close();
})();



