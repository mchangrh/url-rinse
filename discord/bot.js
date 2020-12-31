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
    // run appropiate command
    if (command === 'rinse' || command === 'clean') { // clean url
      if (url) {
        rinse.unshorten(url)
        .then((longUrl) => {
          message.channel.send(rinse.removeQuery(longUrl))
        })
        message.delete({ timeout: 5000})
      } else {
        message.channel.send('No URL')
        .delete({ timeout: 5000 })
      }
    } else if (command === 'unshort') { // unshorten url
      if (url) {
        rinse.unshorten(url).then((longUrl) => {
            message.channel.send(longUrl)
        })
        message.delete({ timeout: 5000})
      } else {
        message.channel.send('No URL')
        .delete({ timeout: 5000 })
      }
    } else if (command === 'removequery') {
      if (url) {
        message.channel.send(rinse.removeQuery(url))
        message.delete({ timeout: 5000})
      } else {
        message.channel.send('No URL')
        .delete({ timeout: 5000 })
      }
    } else if (command === 'defer') {
      if (url) {
        message.channel.send(rinse.defer(url))
        message.delete({ timeout: 5000})
      } else {
        message.channel.send('No URL')
        .delete({ timeout: 5000 })
      }
    }
}})

process.on('uncaughtException', function(err) { 
	console.log(err) 
})
