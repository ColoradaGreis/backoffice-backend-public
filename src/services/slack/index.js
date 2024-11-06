// https://api.slack.com/messaging/sending
// https://api.slack.com/messaging/composing/layouts
const { WebClient, LogLevel } = require('@slack/web-api')
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  // logLevel: LogLevel.DEBUG
})
const channelId = process.env.SLACK_CHANNEL

module.exports = {
  sendTemplate: async (source, msg) => {
    return client.chat.postMessage({
      channel: channelId,
      blocks: formatMsg(source, msg),
      text: source
    })
  },
  sendText: async (source, msg) => {
    return client.chat.postMessage({
      channel: channelId,
      text: msg
    })
  },
  sendArrayTemplate: async (source, msg) => {
    // formatArrayMsg(source, msg);
    return client.chat.postMessage({
      channel: channelId,
      blocks: formatArrayMsg(source, msg),
      text: source
    })
  }
}

function formatMsg (source, msg) {
  const blocks = [{
    type: 'header',
    text: {
      type: 'plain_text',
      text: capitalizeFirstLetter(source) + ' :level_slider:',
      emoji: true
    }
  },
  {
    type: 'section',
    fields: []
  }]
  for (const prop in msg) {
    if (msg.hasOwnProperty(prop)) {
      const block = {
        type: 'mrkdwn',
        text: `*${capitalizeFirstLetter(prop)}:*\n${msg[prop]}`
      }

      blocks[1].fields.push(block)
    }
  }
  blocks.push({ type: 'divider' })
  // console.log(JSON.stringify(blocks));
  return blocks
}

function formatArrayMsg (source, msg, omitHeaders = true) {
  const blocks = [{
    type: 'header',
    text: {
      type: 'plain_text',
      text: capitalizeFirstLetter(source) + ' :level_slider:',
      emoji: true
    }
  }
  ]
  for (const prop in msg) {
    if (msg.hasOwnProperty(prop)) {
      if (typeof msg[prop] === 'string' || msg[prop] instanceof String) {
        const block = {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${msg[prop]}`
          }
        }
        blocks.push(block)
      } else if (Array.isArray(msg[prop])) {
        for (const element of msg[prop]) {
          let txtLine = ''
          let propCount = 0
          for (const header in element) {
            propCount++
            txtLine += element[header]
            if (propCount < Object.keys(element).length) {
              txtLine += ' : '
            }
          }
          const block = {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${txtLine}`
            }
          }
          blocks.push(block)
        }
      }
    }
  }
  blocks.push({ type: 'divider' })
  console.log(JSON.stringify(blocks))
  return blocks
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
