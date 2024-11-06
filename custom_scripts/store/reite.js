const currentStores = []

module.exports = {
  load: async (models) => {
    for (const store of currentStores) {
      await models.store.create(store)
    }
    console.log('reite stores loaded!')
  }
}
