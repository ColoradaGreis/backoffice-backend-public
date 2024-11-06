const { compareLayouts } = require('../utils/layout/index')

const layout1 = {}
const layout2 = {};

(async () => {
  try {
    const result = await compareLayouts(layout1, layout2)
    console.log(result)
  } catch (error) {
    console.error('Error al obtener y procesar los datos:', error)
  }
})()
