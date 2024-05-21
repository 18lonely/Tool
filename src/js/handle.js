"use strict"

const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

// Init DOM
const {JSDOM} = require('jsdom')
const DOM = new JSDOM(`<!DOCTYPE html>`)
const DOCUMENT = DOM.window.document

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

    let arr = []

    for(let tag of listsTag) {
        let newDiv = DOCUMENT.createElement('div')
        newDiv.innerHTML = await tag.getAttribute("innerHTML")

        let tagA = newDiv.getElementsByTagName('a')
        let tagImage = newDiv.getElementsByTagName('image')

        let nameGroup = tagA[0].getAttribute('aria-label')
        let url = tagA[0].getAttribute('href')
        let urlImage = tagImage[0].getAttribute('xlink:href').replaceAll('amp;', "")
        
        arr.push([nameGroup, url, urlImage])
    }

    await driver.quit()
    
    return arr
}

const initBrowser = async () => {
    let options = new chrome.Options()
    options.addArguments("--disable-notifications")

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()

    // Set full screen
    await driver.manage().window().maximize()

    return driver
}

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

const findGroupByKyeword = async (keyword, n, email, password) => {
    let driver = await initBrowser()

    await loginFB(driver, email, password)

    return await filterGroups(n, keyword, driver)
}

const filterPropertiesYourGroup = async (groups) => {
    let result = []

    for(let index in groups) {
        let newDiv = DOCUMENT.createElement('div')
        newDiv.innerHTML = await groups[index].getAttribute('innerHTML')

        let tagA = newDiv.getElementsByTagName('a')[0]
        let tagSvg = newDiv.getElementsByTagName('svg')[0]
        let tagImage = newDiv.getElementsByTagName('image')[0]

        // console.log(tagA.getAttribute("href"), tagSvg.getAttribute("aria-label"), tagImage.getAttribute("xlink:href"))

        result.push([tagA.getAttribute("href"), tagSvg.getAttribute("aria-label"), tagImage.getAttribute("xlink:href").replaceAll('amp;', '')])
    }

    return result
}

const getYourGroups = async (email, password) => {
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

    let result = await filterPropertiesYourGroup(groups)
    await driver.quit()
    return result
}

const autoPostGroupFacebook = async (driver ,url, content, files) => {
    await driver.get(url)
    await driver.wait(until.elementsLocated(By.xpath('//div[@class="x1i10hfl xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1lq5wgf xgqcy7u x30kzoy x9jhf4c x78zum5 x1r8uery x1iyjqo2 xs83m0k xl56j7k x1pshirs x1y1aw1k x1sxyh0 xwib8y2 xurb0ha"]')), 10000)

    let inputPost = await driver.findElement(By.xpath('//div[@class="x1i10hfl xjbqb8w xjqpnuy xa49m3k xqeqjp1 x2hbi6w x13fuv20 xu3j5b3 x1q0q8m5 x26u7qi x972fbf xcfux6l x1qhh985 xm0m39n x9f619 x1ypdohk xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j x1n2onr6 x16tdsg8 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x87ps6o x1lku1pv x1a2a7pz x6s0dn4 x1lq5wgf xgqcy7u x30kzoy x9jhf4c x78zum5 x1r8uery x1iyjqo2 xs83m0k xl56j7k x1pshirs x1y1aw1k x1sxyh0 xwib8y2 xurb0ha"]'))
    inputPost.click()

    // _1mf _1mj
    await driver.wait(until.elementsLocated(By.xpath('//div[@class="_1mf _1mj"]')), 10000)
    let container = await driver.findElement(By.xpath('//div[@class="_1mf _1mj"]'))
    
    if(content.length != 0) {
        await container.sendKeys(content)
    }
    
    let inputFile = await driver.findElement(By.xpath('//input[@accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"]'))
    if(files.length != 0) {
        await inputFile.sendKeys(files.join(" \n "))
    }

    await driver.sleep(1000)

    await driver.executeScript(`
        let post = document.getElementsByClassName("x78zum5 xdt5ytf x1pl0jk3 x1n2onr6 x8n7wzh x11pth41 xvue9z")[0].getElementsByClassName("x1n2onr6 x1ja2u2z x78zum5 x2lah0s xl56j7k x6s0dn4 xozqiw3 x1q0g3np xi112ho x17zwfj4 x585lrc x1403ito x972fbf xcfux6l x1qhh985 xm0m39n x9f619 xn6708d x1ye3gou xtvsq51 x1r1pt67")[0]
        console.log(post)
        post.click()
    `)
}

const autoPostGroupsFacebook = async (email, password, groups, content, files, delay) => {
    let driver = await initBrowser()

    await loginFB(driver, email, password)

    for(let gr of groups) {
        if(gr.length == 0) {
            continue
        }
        try {
            await autoPostGroupFacebook(driver, gr[0], content, files)
            await driver.sleep((Math.random() * Number(delay[1])) + Number(delay[0]))
        } catch (err) {
            console.log(err)
        }
    }
}

export default {autoPostGroupsFacebook, filterGroups, initBrowser,
    loginFB, findGroupByKyeword, filterPropertiesYourGroup,
    getYourGroups, autoPostGroupFacebook
}