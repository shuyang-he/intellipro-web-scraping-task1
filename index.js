const puppeteer = require('puppeteer')

class Studinfo {
  constructor ({ name, email, school, educationlevel, major, web, addinfo }) {
    this.name = name || ''
    this.email = email || ''
    this.linkedin = ''
    this.status = 'Student' // Student, Alumni, Faculty, Staff
    this.educationlevel = educationlevel || 'Master' // Undergraduate, Graduate(if Phd and Master mixed, else mark as Phd or Master)
    this.school = school || '' // school name, full name
    this.major = major || '' // major. Normally in each website we crawler, use only one generic major
    this.source = web || '' // web source. ex. 'https://sis.smu.edu.sg/faculty/full-time/research?filter%5Bprofile_type%5D%5B%5D%5B%5D=302&filter%5Btrack%5D=tenure##region-page-top'
    this.date = new Date() // created date , new Date()
    this.addinfo = addinfo || '' // any useful infomation with any format( study fields, phone number, )
  }
}

const web = 'https://www.khoury.northeastern.edu/role/phd-students/'
const nameSelector = '#primary-content > article > header > div > h1 > a'
const emailSelector = '#primary-content > article > section > div.supplemental > div > div.contact-links > p > a'
const school = 'Northeastern University'
const major = 'Computer Science'
const educationlevel = 'PHD'
const addinfo = '';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3617.0 Safari/537.36'
    )

    const content = []
    await page.goto(web)
    await page.waitForSelector('#primary-content > div.row > div > div > div')
    const elements = await page.$$('#primary-content > div.row > div > div > div')
    const length = elements.length
    console.log(length)
    for (let i = 0; i < length; i++) {
      await page.goto(web)
      await page.waitForSelector('#primary-content > div.row > div > div > div')
      const elements = await page.$$('#primary-content > div.row > div > div > div')
      const element = elements[i]
      const link = await element.$('article > div > a')
      await link.click()

      await page
        .waitForSelector(emailSelector, { timeout: 1000 })
        .catch((err) => console.log(err))

      const name = await page.$eval(nameSelector, (node) => {
        return node.innerText.trim()
      })

      const email = emailSelector && (await page.$eval(emailSelector, (node) => {
        return node.innerText.trim()
      }))

      content.push(
        new Studinfo({ name, email, school, educationlevel, major, web, addinfo })
      )
    }

    console.log(content)

    await browser.close()
  } catch (error) {
    console.log(error)
  }
})()
