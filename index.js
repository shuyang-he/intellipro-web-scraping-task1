const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.ischool.berkeley.edu/people?role=124&degr=MIDS&page=1',
      { waitUntil: 'networkidle2' })

    const nameArray = await page.$$(
      'div.view-content:nth-child(2) div.views-row div.views-field.views-field-field-profile-fullname a'
    )
    const emailArray = await page.$$(
      'div.view-content:nth-child(2) div.views-row div.views-field.views-field-field-profile-email a'
    )
    const data = []
    for (let i = 0; i < nameArray.length; i++) {
      const ele = {}
      for (const nameEle of nameArray) {
        const info = await page.evaluate((nameEle) => nameEle.innerHTML, nameEle)
        ele.name = info
      }
      for (const emailEle of emailArray) {
        const info = await page.evaluate((emailEle) => emailEle.innerHTML, emailEle)
        ele.email = info
      }
      data.push(ele)
    }

    console.log(data)

    await browser.close()
  } catch (error) {
    console.log(error)
  }
})()
