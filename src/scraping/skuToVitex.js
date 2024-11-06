const puppeteer = require('puppeteer')

const sku = [1842220, 1637158, 1796180, 656558, 1637157, 934330, 1869929, 1869932, 934324, 1963046, 1726609, 644222, 1354621, 1513101, 1752629, 1955117, 1054771, 925250, 768101, 271819, 768100, 272034, 303847, 272033, 271566, 272071, 1441648, 1842612, 1821201, 1821202, 1995045, 1607070, 1972987, 890921, 1787743, 1787744, 1787741, 1843772, 1787747, 1787742, 1168084, 738093, 1797701, 1880159, 738096, 1880160, 1997540, 1464586, 1691085, 245683, 1757247, 751817, 751815, 1787087, 993680, 1955104, 1955103, 1992575, 1966586, 1905800, 1963629, 1905799]

const getVitex = async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // Utilizando el nuevo modo headless
    ignoreHTTPSErrors: true
  })
  const page = await browser.newPage()

  const fakeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

  await page.evaluateOnNewDocument(fakeUserAgent => {
    const open = window.open
    window.open = (...args) => {
      const newPage = open(...args)
      Object.defineProperty(newPage.navigator, 'userAgent', { get: () => fakeUserAgent })
      return newPage
    }
    window.open.toString = () => 'function open() { [native code] }'
  }, fakeUserAgent)

  await page.setUserAgent(fakeUserAgent)

  await page.setDefaultNavigationTimeout(60000)
  await page.goto('https://www.jumbo.cl/', { waitUntil: 'networkidle0' })
  await page.setViewport({ width: 1920, height: 1080 })

  await page.waitForSelector('#root')
  for (let i = 0; i < sku.length; i++) {
    const element = sku[i]
    await searchSku(page, element)
  }
  console.log('Fin')
  await browser.close()
}

const searchSku = async (page, sku) => {
  if (typeof sku === 'number') {
    await page.focus('#header-search > input')
    await page.keyboard.type(sku.toString())
    await page.click('#header-search > button')

    // Reemplazo de page.waitForTimeout con delay
    await delay(2000)

    await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] })
    await delay(1000)

    const isSelectorPresent = await page.$('#root > div > div.catalog-page.page')

    if (isSelectorPresent) {
      await page.click('#root > div > div.catalog-page.page > div > div > main > div.shelf-wrapper > div.shelf-products-wrap > div > div:nth-child(1) > div > a.product-card-name')
      await delay(2000)
    }
    try {
      const contentNumber = await page.$eval('head > meta[property="product:retailer_item_id"]', meta => meta.getAttribute('content'))
      const contentImage = await page.$eval('head > meta[property="og:image"]', meta => meta.getAttribute('content'))
      const contentPrice = await page.$eval('head > meta[property="product:price:amount"]', meta => meta.getAttribute('content'))

      console.log(`${contentNumber};${contentImage};${page.url()};${contentPrice}`)
    } catch (error) {
      console.log(sku, 'No Encontrado')
    }
  } else {
    console.log('No Encontrado')
  }
}

// Función de delay utilizando setTimeout
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

getVitex()
