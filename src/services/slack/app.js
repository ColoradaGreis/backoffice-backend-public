const { App, LogLevel } = require('@slack/bolt')
// `logLevel` in the constructor. The available log levels in order of most to least logs are `DEBUG`, `INFO`, `WARN`, and `ERROR`
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.INFO
})

const transactionManager = require('../../core/external/reite/transactionManager')

/*
app.event('app_home_opened', ({ event, say }) => {
    console.log('event called');
    say(`Hello world, <@${event.user}>!`);

});
*/

app.command('/transaction', async ({ command, ack, say }) => {
  await ack()
  try {
    const { ts, channel_id, text } = command //eslint-disable-line
    const message = await say({
      text: 'Buscando detalles de la transacción: ' + text,
      channel: channel_id //eslint-disable-line
    })
    const messageResult = await getTransactionResponse(text)
    await say({
      blocks: formatMsg(messageResult.data),
      channel: channel_id, //eslint-disable-line
      thread_ts: message.ts
    })
  } catch (error) {
    console.error(error)
  }
});

(async () => {
  // Start the app
  if (process.env.NODE_ENV === 'production') {
    await app.start(3500)
    console.log('Bolt app is running!')
  }
})()

async function getTransactionResponse (transactionId) {
  let message = { data: { error: 'Transacción no existe!' } }
  try {
    const transactionResult = await transactionManager.get({ transactionId })
    message = transactionResult
  } catch (error) {
    console.log('error')
    console.log(error)
  }
  return message
}

function formatMsg (msg) {
  const blocks = []
  for (const prop in msg) {
    if (msg.hasOwnProperty(prop)) {
      const block = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${capitalizeFirstLetter(prop)}:*\n${JSON.stringify(msg[prop])}`
        }

      }
      blocks.push(block)
    }
  }
  blocks.push({ type: 'divider' })
  // console.log(JSON.stringify(blocks));
  return blocks
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
