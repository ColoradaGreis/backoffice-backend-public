const { WebClient } = require('@slack/web-api')
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  // logLevel: LogLevel.DEBUG
})
const channelId = process.env.SLACK_TRANSACTIONS_CHANNEL

module.exports = {
  sendTemplate: async (source, msg) => {
    const formattedBlocks = formatMsg(source, msg)
    // console.log(JSON.stringify(formattedBlocks, null, 2))

    return await client.chat.postMessage({
      channel: channelId,
      text: source,
      blocks: formattedBlocks
    })
  }

}

function formatMsg (source, msg) {
  const blocks = [{
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':warning: ' + capitalizeFirstLetter(source) + ' :warning:',
      emoji: true
    }
  },
  {
    type: 'section',
    fields: []
  }
  ]

  const maxLength = 2000 // Establecer la longitud máxima permitida por la API de Slack

  let currentBlock = blocks[1]
  let currentText = ''

  for (const prop in msg) {
  if (msg.hasOwnProperty(prop)) { // eslint-disable-line
      const value = msg[prop]
      const text = `*${capitalizeFirstLetter(prop)}:*\n${formatValue(value)}`

      if (currentText.length + text.length > maxLength) {
      // Si agregar este texto excede el límite, comienza un nuevo bloque
        currentBlock = {
          type: 'section',
          fields: []
        }
        blocks.push(currentBlock)
        currentText = ''
      }

      // Divide el texto en partes más pequeñas si excede el límite
      const parts = splitTextIntoParts(text, maxLength)
      parts.forEach((part) => {
        const block = {
          type: 'mrkdwn',
          text: part
        }

        currentBlock.fields.push(block)
        currentText += part
      })
    }
  }

  blocks.push({
    type: 'divider'
  })

  // console.log(JSON.stringify(blocks));
  return blocks
}

function splitTextIntoParts (text, maxLength) {
  const parts = []
  let currentPart = ''

  text.split('\n').forEach((line) => {
    if (currentPart.length + line.length <= maxLength) {
      currentPart += line + '\n'
    } else {
      parts.push(currentPart.trim())
      currentPart = line + '\n'
    }
  })

  if (currentPart.length > 0) {
    parts.push(currentPart.trim())
  }

  return parts
}
function formatValue (value) {
  if (Array.isArray(value)) {
    // If it's an array, format each item
    return value.map((item) => formatValue(item)).join('\n')
  } else if (typeof value === 'object' && value !== null) {
    // If it's an object, format key-value pairs
    return Object.entries(value)
      .map(([key, val]) => `*${key}:* ${formatValue(val)}`)
      .join('\n')
  } else if (value instanceof Object) {
    // If it's an object (but not an array), stringify it
    return JSON.stringify(value)
  } else {
    // Otherwise, use the value as is
    return String(value)
  }
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
