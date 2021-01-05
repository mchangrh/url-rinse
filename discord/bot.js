// imports
require('dotenv').config()
const Discord = require('discord.js')
const rinse = require('../src/urlrinse')

const client = new Discord.Client() // create client
client.on('ready', () => {
  console.log('Ready')
  client.user.setPresence({ // set presence
    activity: { type: process.env.ACT_TYPE, name: process.env.ACT_NAME },
    status: process.env.STATUS
  })
})
client.login(process.env.TOKEN) // login

client.on('message', message => {
  const prefix = process.env.PREFIX // set prefix
  if (!message.author.bot && message.content.startsWith(prefix)) { // check if sent by self & check for prefix
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    const url = args[0]
    if (url) { // run appropiate command
      if (command === 'clean') { // clean url
        rinse.unshorten(url)
        .then((longUrl) => message.channel.send(rinse.removeQuery(longUrl)))
      } else if (command === 'unshort') { // unshorten url
        rinse.unshorten(url).then((longUrl) => message.channel.send(longUrl))
      } else if (command === 'removequery') {
        message.channel.send(rinse.removeQuery(url))
      } else if (command === 'defer') {
        message.channel.send(rinse.defer(url))
      }
      message.delete({ timeout: 5000}) // delete message
    } else {
      message.channel.send('No URL')
    }
}})

process.on('uncaughtException', function(err) { 
	console.log(err) 
})
