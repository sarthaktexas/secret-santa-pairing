require('dotenv').config();
require('colors');
const axios = require('axios');
const AirtablePlus = require('airtable-plus');
const usersTable = new AirtablePlus({
  baseID: 'appErDYUv6Oppe9Cc',
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Users',
});

const matchingTable = new AirtablePlus({
  baseID: 'appErDYUv6Oppe9Cc',
  apiKey: process.env.AIRTABLE_API_KEY,
  tableName: 'Matching',
});

/**
 * Main Function, yes i know bad code whatever
 */
const main = async () => {
  // gets gifters from each area
  await getUsers('North America').then(users => PairUsers(users));
  await getUsers('South America').then(users => PairUsers(users));
  await getUsers('Europe').then(users => PairUsers(users));
  await getUsers('India').then(users => PairUsers(users));
  await getUsers('Asia except India').then(users => PairUsers(users));
  await getUsers('Africa').then(users => PairUsers(users));
}

main().then(() => console.log(`I've finished matching everybody. Happy Gifting!`.bgCyan.black)); // run the app

/**
 * Gets Gifters from Airtable
 */
async function getUsers(region) {
  const userRes = await usersTable.read({
    filterByFormula: `region = "${region}"`
  });
  const users = [];
  userRes.forEach(user => {
    users.push({
      email: user.fields.email,
      id: user.fields.id,
      region: user.fields.region,
      address: user.fields.address,
      likes: user.fields.likes,
    });
  });
  return (users);
}

/**
 * Pair Users with other Users
 * @param {Array} users Array of users following format in README
 */
function PairUsers(users) {
  shuffle(users);
  users.forEach(async (user, i) => {
    let user_1 = user;
    let user_2;
    if (i !== users.length - 1) {
      user_2 = users[i + 1];
      console.log(`I'm pairing ${(user_1.id).red} (${user_1.region.gray}) with ${(user_2.id).green} (${user_2.region.gray})`);
    } else {
      user_2 = users[0];
      console.log(`I'm pairing ${(user_1.id).red} (${user_1.region.gray}) with ${(user_2.id).green} (${user_2.region.gray})`)
    }
    const matchRecord = await matchingTable.create({ id: user_1.id, match: user_2.id, regionmatch: user_1.region === user_2.region ? true : false, region: user_1.region }).catch(err => console.log(err));
    const webhookLink = "https://hooks.slack.com/workflows/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"
    axios({
      method: 'post',
      url: webhookLink,
      data: {
        userId: user_1.id,
        matchedUser: user_2.id,
        address: user_2.address,
        recordId: matchRecord.id,
        likes: user_2.likes,
        userIdLiteral: user_1.id,
      },
    });
  });
}

/**
 * Shuffle an Array
 * @param {Array} array Array Object to shuffle
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}