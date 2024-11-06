const models = require('../../database')

module.exports = {
  list: async () => {
    const result = {}
    const order = 'ASC'

    const taskList = JSON.parse(JSON.stringify(await models.task.findAll({
      order: [
        ['order', order]
      ]
    })))
    result.data = taskList
    return result
  },
  update: async (payload) => {
    const task = await models.task.findOne({
      where: { id: payload }
    })
    if (task) {
      task.dataValues.checked = !task.dataValues.checked
      const [rowsAffected, updatedTask] = await models.task.update(task.dataValues, {
        where: { id: payload },
        returning: true
      })
      if (rowsAffected === 1) {
        return updatedTask
      }
    }
  }
}
