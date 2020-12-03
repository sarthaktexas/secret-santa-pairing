require('dotenv').config();
require('colors');
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
const users = [];

/**
 * Main Function, yes i know bad code whatever
 */
const main = async () => {
  await getUsers();
  PairUsers(users);
}

main(); // run the app

/**
 * Gets Gifters from Airtable
 */
async function getUsers() {
  const userRes = await usersTable.read();
  userRes.forEach(user => {
    users.push({
      email: user.fields.email,
      id: user.fields.id,
    });
  });
}

/**
 * Pair Users with other Users
 * @param {Array} users Array of users following format in README
 */
function PairUsers(users) {
  if (!isEven(users.length)) throw 'The array given has an odd number of gifters.'.bgRed.white;
    shuffle(users);
    const half = Math.ceil(users.length / 2);
    const firstHalf = users.splice(0, half);
    const secondHalf = users.splice(-half);
    let i = 0;
  firstHalf.forEach(user => {
    console.log(`I'm pairing ${(user.id).red} with ${(secondHalf[i].id).green}`)
    i++
  })
}

/**
 * Check if number is even or odd
 * @param {Number} value number to check
 */
function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
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