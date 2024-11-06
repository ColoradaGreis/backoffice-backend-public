// const cognitoSignUp = require('../services/cognito/sign-up.js')
// const cognitoLogin = require('../services/cognito/initiate-auth.js')
// const cognitoSetUserPassword = require('../services/cognito/setUserPassword.js')
// const cognitoDeleteUser = require('../services/cognito/deleteUser.js')
// const cognitoUser = require('../services/cognito/setUsername.js')
const models = require('../database')
const ExcelJS = require('exceljs')
const cognitoMock = require('../../data/cognitoMock.json')

module.exports = {
  get: async (payload) => {
    return models.app_user.findOne({ where: { id: payload.userId } })
  },
  signup: async (payload) => {
    if (!['admin', 'restock', 'read'].includes(payload.role)) {
      throw new Error('Invalid role') // Otra excepción personalizada o manejo de errores
    }
    // -----Cognito sing up process-----
    // const cognitoUser = await cognitoSignUp.signUp(payload.email, payload.password)
    // -----
    const cognitoUser = cognitoMock.signupResponse
    const random = Math.floor(Math.random() * 1000)
    payload.sub = cognitoUser.UserSub + random

    return models.app_user.create(payload)
  },
  login: async (payload) => {
    // -----Cognito login process-----
    // const cognitoUser = await cognitoLogin.initiateAuth(payload.email, payload.password)
    // -----
    const cognitoUser = cognitoMock.loginResponse
    const appUser = await models.app_user.findOne({ where: { email: payload.email } })

    if (!appUser) {
      throw new Error('Usuario no encontrado')
    }
    return { cognitoUser, appUser }
    // return { appUser }
  },
  list: async () => {
    const result = {}
    const order = 'ASC'
    const userList = JSON.parse(JSON.stringify(await models.app_user.findAll({
      order: [
        ['first_name', order]
      ]
    })))
    result.data = userList
    return result
  },
  update: async (payload) => {
    const userIdToUpdate = payload.id

    const updateFields = {}
    const user = await models.app_user.findOne({ where: { id: userIdToUpdate } })
    // -----Cognito update process-----
    // if (payload.email) {
    //   if (user) {
    //     await cognitoUser.setUsername(user.email, payload.email)
    //     updateFields.email = payload.email
    //   } else throw new Error('User not found')
    // }
    // -----
    if (!user) throw new Error('User not found')
    if (payload.role) { updateFields.role = payload.role }
    if (payload.first_name) { updateFields.first_name = payload.first_name }
    if (payload.middle_name) { updateFields.middle_name = payload.middle_name }
    if (payload.first_lastname) { updateFields.first_lastname = payload.first_lastname }
    if (payload.second_lastname) { updateFields.second_lastname = payload.second_lastname }
    // Realiza la actualización en la base de datos
    const result = await models.app_user.update(updateFields, {
      where: {
        id: userIdToUpdate
      }
    })
    if (result[0] === 1) {
      return { message: 'Usuario actualizado correctamente' }
    } else {
      return { message: 'No se pudo actualizar el usuario' }
    }
  },
  updatePassword: async (payload) => {
    // -----Cognito update password process-----
    // return cognitoSetUserPassword.setUserPassword(payload.email, payload.password)
    // -----
    return cognitoMock.updatePasswordResponse
  },
  delete: async (payload) => {
    // console.log(payload.email, 'payload.email')

    // await cognitoDeleteUser.deleteUser(payload.email)
    console.log(`Usuario ${payload.email} eliminado de Cognito (simulado)`)
    return models.app_user.destroy({
      where: {
        id: payload.id
      }
    })
  },
  downloadExcel: async () => {
    const order = 'ASC'
    const userList = JSON.parse(JSON.stringify(await models.app_user.findAll({
      order: [
        ['first_name', order]
      ]
    })))

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Usuarios')

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ff4f81bd' } },
      border: { bottom: { style: 'thick', color: { argb: 'fffafbfd' } } },
      width: 20
    }

    const evenRowStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffb8cce4' } },
      alignment: { horizontal: 'center' },
      width: 20,
      border: { bottom: { style: 'thin', color: { argb: 'fffafbfd' } } }
    }

    const oddRowStyle = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffdce6f1' } },
      alignment: { horizontal: 'center' },
      border: { bottom: { style: 'thin', color: { argb: 'fffafbfd' } } },
      width: 20
    }

    worksheet.columns = [
      { header: 'ID', key: 'user.id', width: 8 },
      { header: 'Nombre', key: 'user.fullname', width: 28 },
      { header: 'Rol', key: 'user.role', width: 15 }

    ]

    // Aplicar estilos al encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle
    })

    // Agregar datos de los usuarios al archivo Excel
    userList.forEach((user, index) => {
      const row = worksheet.addRow([user.id, user.fullname, user.role])

      // Aplicar estilos a las filas alternas
      row.eachCell((cell, cellNumber) => {
        if (index % 2 === 0) {
          // Fila par
          cell.style = evenRowStyle
        } else {
          // Fila impar
          cell.style = oddRowStyle
        }
      })
    })

    // Escribir el archivo Excel en un buffer
    const buffer = await workbook.xlsx.writeBuffer()
    // console.log(buffer, 'buffer')

    return buffer // Devuelve el buffer del archivo Excel generado
  }
}
