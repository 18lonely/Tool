const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

// Init DOM
const {JSDOM} = require('jsdom')
const DOM = new JSDOM(`<!DOCTYPE html>`)
const DOCUMENT = DOM.window.document

/**
 * This method will filter properties of group
 * @param {Int} n Number of group
 * @param {*} keyword Search keyword
 * @param {*} driver Builder
 * @returns 
 */
const filterGroups = async (n, keyword, driver) => {
    await driver.get("https://www.facebook.com/search/groups/?q=" + keyword.trim().replace(" ", "%20"))

    let listsTag = []
    let count = 0
    while(count <= n) {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
        await driver.sleep(1000)
        listsTag = await driver.findElements(By.xpath('//div[@class="x9f619 x1n2onr6 x1ja2u2z x1jx94hy x1qpq9i9 xdney7k xu5ydu1 xt3gfkd xh8yej3 x6ikm8r x10wlt62 xquyuld"]'))
        count = listsTag.length
    }

    let text = ""

    for(let tag of listsTag) {
        let newDiv = DOCUMENT.createElement('div')
        newDiv.innerHTML = await tag.getAttribute("innerHTML")

        let tagA = newDiv.getElementsByTagName('a')
        let tagImage = newDiv.getElementsByTagName('image')

        let nameGroup = tagA[0].getAttribute('aria-label')
        let url = tagA[0].getAttribute('href')
        let urlImage = tagImage[0].getAttribute('xlink:href').replaceAll('amp;', "")
        
        text += `${nameGroup}, ${url}, ${urlImage}\n`
    }
    
    return text
}

/**
 * This method return Builder with option full screen and disable nofitication
 * @returns Builder
 */
const initBrowser = async () => {
    let options = new chrome.Options()
    options.addArguments("--disable-notifications")

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()

    // Set full screen
    await driver.manage().window().maximize()

    return driver
}

/**
 * This method auto login facebook with email and password
 * @param {Builder} driver 
 * @param {String} email Email, ID, Phonenumber,...
 * @param {String} password 
 */
const loginFB = async (driver, email, password) => {
    await driver.get('https://fb.com')

    // Get tag input and field.
    let inputEmail = await driver.findElement(By.id('email'))
    inputEmail.sendKeys(email)

    // Get tag input and field.
    let inputPassword = await driver.findElement(By.name('pass'))
    inputPassword.sendKeys(password)
    
    // Loging when field done.
    let buttonLogin = await driver.findElement(By.name('login'))
    buttonLogin.click()

    await driver.wait(until.elementsLocated(By.id("has-finished-comet-page")), 10000)
}

/**
 * 
 * @param {String} keyword 
 * @param {Int} n Number of group
 * @param {String} email Email, ID, Phonenumber,...
 * @param {String} password 
 */
const findGroupByKyeword = async (keyword, n, email, password) => {
    let driver = await initBrowser()

    await loginFB(driver, email, password)

    return await filterGroups(n, keyword, driver)
}

const filterPropertiesYourGroup = async (groups) => {
    let result = ''

    for(let index in groups) {
        let newDiv = DOCUMENT.createElement('div')
        newDiv.innerHTML = await groups[index].getAttribute('innerHTML')

        let tagA = newDiv.getElementsByTagName('a')[0]
        let tagSvg = newDiv.getElementsByTagName('svg')[0]
        let tagImage = newDiv.getElementsByTagName('image')[0]

        // console.log(tagA.getAttribute("href"), tagSvg.getAttribute("aria-label"), tagImage.getAttribute("xlink:href"))

        result += `${tagA.getAttribute("href")}, ${tagSvg.getAttribute("aria-label")}, ${tagImage.getAttribute("xlink:href").replaceAll('amp;', '')}\n`
    }

    return result
}

const getYourGroup = async (email, password) => {
    let driver = await initBrowser()

    await loginFB(driver, email, password)

    await driver.get('https://www.facebook.com/groups/joins/?nav_source=tab&ordering=viewer_added')

    let elements = await driver.findElements(By.xpath("//span[@class='x1lliihq x6ikm8r x10wlt62 x1n2onr6 x1j85h84']"))

    let title = await elements[elements.length - 1].getAttribute("innerHTML")
    const numberOfYourGroup = Number(title.slice(title.indexOf('(') + 1, title.indexOf(")")))

    let count = 0
    let groups
    while(count < numberOfYourGroup) {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);")
        await driver.sleep(1000)
        groups = await driver.findElements(By.xpath("//div[@class='x6s0dn4 x78zum5 x1q0g3np x1qughib']"))
        count = groups.length
    }

    return await filterPropertiesYourGroup(groups)
}

const autoPostGroupFacebook = async (driver ,url, message) => {
    await driver.get(url)
    await driver.wait(until.elementsLocated(By.xpath('//div[@class="x1i10hfl x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xmjcpbm x107yiy2 xv8uw2v x1tfwpuw x2g32xy x78zum5 x1q0g3np x1iyjqo2 x1nhvcw1 x1n2onr6 xt7dq6l x1ba4aug x1y1aw1k xn6708d xwib8y2 x1ye3gou"]')), 10000)

    let inputPost = await driver.findElement(By.xpath('//div[@class="x1i10hfl x1ejq31n xd10rxx x1sy0etr x17r0tee x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x87ps6o x1lku1pv x1a2a7pz x6s0dn4 xmjcpbm x107yiy2 xv8uw2v x1tfwpuw x2g32xy x78zum5 x1q0g3np x1iyjqo2 x1nhvcw1 x1n2onr6 xt7dq6l x1ba4aug x1y1aw1k xn6708d xwib8y2 x1ye3gou"]'))
    inputPost.click()

    // _1mf _1mj
    await driver.wait(until.elementsLocated(By.xpath('//div[@class="_1mf _1mj"]')), 10000)
    let container = await driver.findElement(By.xpath('//div[@class="_1mf _1mj"]'))
    container.sendKeys(message)

    // Post image future
}

const test = async () => {
    let email = '100079943206635'
    let password = 'rJNWEqpWUI'
    let url = 'https://www.facebook.com/groups/3065537343716084'
    let message = "Test"
    let driver = await initBrowser()
    await loginFB(driver, email, password)

    await autoPostGroupFacebook(driver, url, message)

}

test()