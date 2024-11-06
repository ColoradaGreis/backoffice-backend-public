const puppeteer = require('puppeteer')

// const sku = '4286,55853,97942,2573,5853'
// const quantity = '5,4,3,2,1'
const email = 'yourEmail'
const password = 'yourPassword'
const store = 'Jumbo La Florida'
const indice = 1
const CONTINUE_SHOPPING_SELECTOR = '#general-portal > section > div.drawer-content > div > div.minicartcontent-actions > div.minicartcontent-buttons > button'
const NEW_MODAL_SELECTOR = '#general-portal > div > div.new-modal-content >'
const WITHDRAWAL_SELECTOR = NEW_MODAL_SELECTOR + ' div > div.new-modal-scroll > div.delivery-selector-container > div.delivery-selector-tabs.titles > div:nth-child(2)'
const test = async () => {
  const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true })
  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(60000)

  await page.goto('https://www.jumbo.cl/?action=add&sku=4286,55853,97942,2573,5853&quantity=5,1,1,1,1', { waitUntil: 'networkidle0' })

  await page.setViewport({ width: 1366, height: 768 })

  await page.waitForSelector('#root')

  await page.waitForSelector(CONTINUE_SHOPPING_SELECTOR)
  await page.click(CONTINUE_SHOPPING_SELECTOR)
  // LOGIN MODAL PAGE
  await login(page)
  // SELECCIONAR OPCIÓN DE RETIRO EN TIENDA
  await selectWithdrawal(page)
  // SELECCIONAR LA TIENDA EN DONDE VOY A REALIZAR EL RETIRO
  await selectStoreByName(page, store)
  await new Promise(resolve => setTimeout(resolve, 2000))
  // IR AL CARRITO
  await goToCart(page)

  await page.waitForSelector('.cart-page-wrap')
  // IR A COMPRAR Y SELECCIONAR HORARIO
  await goToBuy(page)
  // SELECCIONAR PERSONA QUE RETIRA
  await selectWithdrawer(page)

  console.log('aaa')
}
const selectWithdrawer = async (page) => {
  await page.waitForSelector('#root > div > div.newcheckout-page > div > div.new-checkout-wrap > div.newcheckout-steps-container > div > div.new-delivery-mode > div.delivery-mode-content > div.delivery-mode-car-pickup-wrapper')
  await page.click('#root > div > div.newcheckout-page > div > div.new-checkout-wrap > div.newcheckout-steps-container > div > div.new-delivery-mode > div.delivery-mode-content > div.delivery-mode-car-pickup-wrapper > button')
  await page.waitForSelector('#general-portal > div')
  await page.click('#general-portal > div > div.new-modal-content > div > div.new-modal-scroll > div:nth-child(2) > div > input')
}
const goToBuy = async (page) => {
  const NEW_CART_PAGE_SELECTOR = '#root > div > div.new-cart-page > div > div > div > aside > div > div'
  await page.waitForSelector(NEW_CART_PAGE_SELECTOR)

  await page.click(NEW_CART_PAGE_SELECTOR + ' > div.new-cart-button-container > div > button')

  await new Promise(resolve => setTimeout(resolve, 2000))

  await page.click('#general-portal > section > div.drawer-content > div > div.drawer-actions > button.primary-btn.upselling-cart-order-btn')

  // // seleccionar horario

  const selector = `.date-delivery-wrap-hours:nth-child(${indice}) .date-delivery-hours-wrap .input-radio-button`
  await page.waitForSelector(selector)
  await page.click(selector)
}

const goToCart = async (page) => {
  await page.goto('https://www.jumbo.cl/mi-carro', { waitUntil: 'networkidle0' })
}
const INPUT_MAIL_SELECTOR = NEW_MODAL_SELECTOR + ' form > div.new-modal-scroll > div > div:nth-child(1) > label > input'
const INPUT_PASSWORD_SELECTOR = NEW_MODAL_SELECTOR + ' form > div.new-modal-scroll > div > div:nth-child(2) > label > input'

const login = async (page) => {
  // Enfoco para tipear el mail
  await page.waitForSelector(INPUT_MAIL_SELECTOR)
  await page.focus(INPUT_MAIL_SELECTOR)
  await page.keyboard.type(email)
  // Enfoco para tipear la contraseña

  await page.focus(INPUT_PASSWORD_SELECTOR)
  await page.keyboard.type(password)

  await page.click(NEW_MODAL_SELECTOR + ' form > div.modal-actions > button.primary-btn')
}

const selectWithdrawal = async (page) => {
  await page.waitForSelector(NEW_MODAL_SELECTOR + ' div > div.new-modal-scroll')
  await new Promise(resolve => setTimeout(resolve, 2000))

  await page.click(WITHDRAWAL_SELECTOR)
  await new Promise(resolve => setTimeout(resolve, 2000))
}
// #general-portal > div > div.new-modal-content >

const selectStoreByName = async (page, storeName) => {
  try {
    // Construye el selector XPath para encontrar el elemento que contiene el nombre de la tienda
    const STORE_SELECTOR = `//li[contains(@class, 'store-item-wrap') and contains(.//span[@class='store-item-title'], '${storeName}')]`

    // Espera a que al menos un elemento de tienda esté presente en la página
    await page.waitForXPath(STORE_SELECTOR)

    // Obtén todos los elementos que coinciden con el selector
    const elements = await page.$x(STORE_SELECTOR)

    if (elements.length > 0) {
      await elements[0].click()
      // Espera hasta que el botón de Confirmar deje de estar deshabilitado
      await page.waitForFunction(() => {
        const button = document.querySelector('#general-portal > div > div.new-modal-content > div > div.modal-actions > span > button.primary-btn.delivery-selector-btn')
        return !button.disabled
      })

      // Ahora haz clic en el botón Confirmar
      await page.click('#general-portal > div > div.new-modal-content > div > div.modal-actions > span > button.primary-btn.delivery-selector-btn')
    } else {
      console.error(`No se encontró la tienda con el nombre: ${storeName}`)
    }
  } catch (error) {
    console.log(error)
  }
}

test()
