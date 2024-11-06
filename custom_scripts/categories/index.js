/* eslint-disable camelcase */
const categories = require('./categories.json')
module.exports = {
  load: async (models) => {
    const { first_category, second_category, third_category } = models

    for (const [firstCategoryName, secondCategories] of Object.entries(categories)) {
      const firstCategory = await first_category.create({
        name: firstCategoryName
      })

      for (const [secondCategoryName, thirdCategories] of Object.entries(secondCategories)) {
        const secondCategory = await second_category.create({
          name: secondCategoryName,
          first_category_id: firstCategory.id
        })

        for (const thirdCategoryName of thirdCategories) {
          await third_category.create({
            name: thirdCategoryName,
            second_category_id: secondCategory.id
          })
        }
      }
    }
    console.log('Categories loaded')
  }
}
