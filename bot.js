require('dotenv').config()

const { Client, Intents, MessageEmbed } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, 'GUILD_PRESENCES', 'GUILDS', 'GUILD_MEMBERS'] })
const Twitter = require('twitter-v2')

const serverStatsUpdateTime = (60000 * 3)

const tokens = {
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const twitterClient = new Twitter(tokens)

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'surprise') {
    await interaction.reply('No surprise right now! Check back later.')
  }

  // else if (interaction.commandName === 'rules') {
  //   let rulesChannel = await interaction.guild.channels.fetch('933129837994967110')
  //   await setRules(rulesChannel)
  //   await interaction.reply('Rules set!')
  // } else if (interaction.commandName === 'links') {
  //   let officialLinksChannel = await interaction.guild.channels.fetch('914260751483539546')
  //   await setOfficialLinks(officialLinksChannel)
  //   await interaction.reply('Official links set!')
  // } else if (interaction.commandName === 'faq') {
  //   let faqChannel = await interaction.guild.channels.fetch('914263160880508929')
  //   await setFaq(faqChannel)
  //   await interaction.reply('FAQ set!')
  // } else if (interaction.commandName === 'earn') {
  //   let earnChannel = await interaction.guild.channels.fetch('932166354453286912')
  //   await setEarn(earnChannel)
  //   await interaction.reply('Earn set!')
  // } else if (interaction.commandName === 'whitelist') {
  //   let whitelistChannel = await interaction.guild.channels.fetch('934617827858599937')
  //   await setWhitelist(whitelistChannel)
  //   await interaction.reply('Whitelist set!')
  // }
})

const serverStatsInterval = setInterval(async () => {
  const guild = await client.guilds.fetch('914243808017932321', { force: true })
  await updateServerStats(guild)
}, serverStatsUpdateTime)

// Updating server stats functions

const updateServerStats = async guild => {
  await updateMemberCount(guild)
  await updateWhitelistCount(guild)
  await updateTwitterCount(guild)
}

const updateMemberCount = async guild => {
  let memberChannel = await guild.channels.fetch('914247236379082772', { force: true })
  await memberChannel.setName(`Members: ${guild.memberCount}`)
}

const updateWhitelistCount = async guild => {
  let whitelistChannel = await guild.channels.fetch('914297565980295218')
  let whitelistRole = await guild.roles.fetch('914248289489133671', { force: true })
  await whitelistChannel.setName(`Whitelisted: ${whitelistRole.members.size}`)
}

const updateTwitterCount = async guild => {
  let twitterData = await twitterClient.get('users/me', { 'user.fields': 'public_metrics' })
  let twitterChannel = await guild.channels.fetch('914297604785975316')
  await twitterChannel.setName(`Twitter Followers: ${Intl.NumberFormat().format(twitterData.data.public_metrics.followers_count)}`)
}

// const setRules = async channel => {
//   let rulesEmbed = new MessageEmbed()
//     .setColor('#2ac6ea')
//     .setTitle('Discord Rules')
//     .setAuthor({ name: 'House Game', iconURL: 'https://i.imgur.com/EQj6l06.png' })
//     .addFields(
//       { name: '1. Be respectful', value: 'Don\'t send offensive messages or set any offensive nicknames. Be reasonable, if you think something you want to send is offensive, it probably is.' },
//       { name: '2. No innapropriate content', value: 'No NSFW content, gore, or death videos. This discord server isn\'t the place for that kind of content.' },
//       { name: '3. No spam', value: 'Don\'t spam any text channels with messages or content, and don\'t spam in any voice channel with your mic. This includes continuously mentioning a moderator or member.' },
//       { name: '4. No Harassment', value: 'Don\'t sexually harass people or promote harassment. This will lead to a permanent ban.' },
//       { name: '5. No self bots', value: 'This is a violation of the official discord rules. If you are self botting, you will be banned and reported to discord. We have bots on this server which you have access to.' },
//       { name: '6. Use appropriate channels', value: 'We have created categorized text channels that allow you to keep certain discussions in certain channels. Post content in the correct channels.' },
//       { name: '7. Read the #faq', value: 'We suggest all our members to read the #faq. You can learn more about the project and in turn can assist other members for effectively.' },
//       { name: '\u200B', value: 'If our moderators feel that you have done something that is wrong that is not listed in the rules, we have every right to take the proper actions. If you have any questions or need support, be sure to use our #support channel.' }
//     )

//   channel.send({ embeds: [rulesEmbed] })
// }

// const setOfficialLinks = async channel => {
//   let officialLinksEmbed = new MessageEmbed()
//     .setColor('#2ac6ea')
//     .setTitle('Official Links')
//     .setAuthor({ name: 'House Game', iconURL: 'https://i.imgur.com/EQj6l06.png' })
//     .addFields(
//       { name: 'Website', value: 'https://house.game' },
//       { name: 'Twitter', value: 'https://twitter.com/housegamenft' },
//       { name: 'Whitepaper', value: 'https://medium.com/@housegamenft/house-game-whitepaper-8f8dc75e62a6' },
//       { name: 'Docs', value: 'https://docs.house.game' },
//       { name: '\u200B', value: 'Beware of scams! We will NEVER message you on any platform asking you for money or to send your wallet information.' }
//     )

//   channel.send({ embeds: [officialLinksEmbed] })
// }

// const setFaq = async channel => {
//   let officialLinksEmbed = new MessageEmbed()
//     .setColor('#2ac6ea')
//     .setTitle('Frequently Asked Questions')
//     .setAuthor({ name: 'House Game', iconURL: 'https://i.imgur.com/EQj6l06.png' })
//     .addFields(
//       { name: 'What is House Game?', value: 'On-chain investors compete to grow their virtual real estate portfolio and earn $CASH. Players can earn ETH with their houses, utility buildings and $CASH.' },
//       { name: 'How do I earn ETH?', value: 'In House Game, there are 3 primary ways of earning ETH. You can learn all the ways to earn by playing House Game in our #how-to-earn text channel.' },
//       { name: 'How do I play?', value: 'In order to play House Game, you\'ll need to own a house or utility building. Players will be able to go to our website, connect their wallet and play right on our website. This will be made public on launch day.' },
//       { name: 'When will House Game launch?', value: 'We will be launching House Game in February 2022. Players will be able to mint houses and utility buildings, as well as purchase them on secondary marketplaces like Opensea. We\'ll make several announcements both on disocrd and twitter prior to launch.' },
//       { name: 'Will there be whitelist?', value: 'We will whitelist a total of 1,000 wallets. Each wallet will be able to mint up to 3 houses or 1 utility building.' },
//       { name: 'What is $CASH?', value: '$CASH is House Game\'s token in it\'s game ecosystem. $CASH is what players will receive on a daily basis for staking their houses and utility buildings. Players can use $CASH to mint additional houses, as well as pay voluntary taxes.' },
//       { name: 'What are voluntary taxes?', value: 'Voluntary Taxes is House Game\'s reward system. There will be a leaderboard that will be reset every Sunday. Players can choose to burn their $CASH by paying voluntary taxes. The top 300 players who burned the most $CASH in that week will receive ETH based on their leaderboard position. You can read more about this in our documentation. (https://docs.house.game)' },
//       { name: 'How many houses and utility buildings will there be?', value: 'There will be a total of 14,000 houses and 700 utility buildings. Players will be able to mint 7,000 houses and 350 utility buildings with ETH. The rest of the houses and utility buildings will only be minted with $CASH.' },
//       { name: 'How much will a house and utility building cost to mint?', value: 'During the whitelist sale, you will be able to mint a house for 0.07 ETH and a utility building for 0.35 ETH. During public sale, we will be hosting a dutch auction. The price to mint a house will start at 0.35 ETH and will drop 0.01 ETH every 2 minutes. The price to mint a utility building will start at 1.75 ETH and drop 0.1 ETH every 2 minutes.' },
//       { name: 'How much $CASH does a house yield?', value: 'Each house model yields a different amount of $CASH per day. Houses on average yield 14 $CASH per day. You can find exactly how much $CASH a house model yields in our docs. (https://docs.house.game)' },
//       { name: 'How much $CASH does a utility building yield?', value: 'Utility Buildings don\'t yield $CASH like houses do. When an investor claims yielded $CASH from a house, the investor pays  25% of all claimed $CASH to utility buildings. You can learn more about this in our docs. (https://docs.house.game)' },
//       { name: 'Still have more questions?', value: 'There are a lot of mechanics and concepts in House Game. If you still have questions, we suggest you read our whitepaper (https://medium.com/@housegamenft/house-game-whitepaper-8f8dc75e62a6) as well as our docs (https://docs.house.game). If you still have questions, make sure to send it in our #support text channel.' }
//     )

//   channel.send({ embeds: [officialLinksEmbed] })
// }

// const setEarn = async channel => {
//   let officialLinksEmbed = new MessageEmbed()
//     .setColor('#2ac6ea')
//     .setTitle('How To Earn')
//     .setAuthor({ name: 'House Game', iconURL: 'https://i.imgur.com/EQj6l06.png' })
//     .addFields(
//       { name: '1. Resell houses or utility buildings', value: 'One of the first ways to earn while playing House Game is to flip houses/utility buildings. They will be worth more in the secondary market compared to their cost to mint. You can purchase and sell houses/utility buildings on secondary marketplaces like Opensea.' },
//       { name: '2. Exchange $CASH for Ethereum', value: 'Players will be able to take their $CASH to a decentralized exchange like Uniswap and convert their $CASH into Ethereum. We will be setting up an initial liquidity pool once the game launches.' },
//       { name: '3. Pay voluntary taxes', value: 'In House Game, there is a leaderboard of players who’ve paid the most voluntary taxes (using $CASH). Every Sunday, the top 300 players will receive ETH airdropped to their wallet. The amount of ETH directly correlates with their leaderboard placement. The more voluntary taxes you pay with $CASH, the higher your placement, and the higher your reward will be.' },
//       { name: '\u200B', value: 'You can read more about how to earn in our whitepaper (https://medium.com/@housegamenft/house-game-whitepaper-8f8dc75e62a6) as well as in our docs (https://docs.house.game).' }
//     )

//   channel.send({ embeds: [officialLinksEmbed] })
// }

// const setWhitelist = async channel => {
//   let officialLinksEmbed = new MessageEmbed()
//     .setColor('#2ac6ea')
//     .setTitle('How to get whitelist')
//     .setAuthor({ name: 'House Game', iconURL: 'https://i.imgur.com/EQj6l06.png' })
//     .addFields(
//       { name: '1. Invite players to the House Game discord server', value: 'We will be giving away 300 whitelist spots to people who invite 70+ people to the House Game discord. We have systems to check for bots as well as fake invites, so if you\'re thinking of cheating your way through it, don\'t waste your time.' },
//       { name: '2. Whitelist giveaways', value: 'We will be hosting whitelist giveaways on both our twitter and discord server, so keep notifications on! We will also be collaborating with other influencers, groups, and projects and they will be hosting whitelist giveaways as well.' },
//       { name: '\u200B', value: 'We will announce any new methods and ways of obtaining whitelist. We\'ll update this guide as well as make an announcement.' }
//     )

//   channel.send({ embeds: [officialLinksEmbed] })
// }

// Logging in as the bot

client.login(process.env.BOT_TOKEN)