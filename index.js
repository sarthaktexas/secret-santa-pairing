require('dotenv').config();
require('colors');
const users = require('./users.json');

PairUsers(users);

/**
 * Pair Users with other Users
 * @param {Array} users Array of users following format in README
 */
function PairUsers(users) {
    if (!isEven(users.length)) console.error('The array given has an odd number of gifters.'.bgRed.white);
    shuffle(users);
    const half = Math.ceil(users.length / 2);
    const firstHalf = users.splice(0, half);
    const secondHalf = users.splice(-half);
    let i = 0;
    firstHalf.forEach(user => {
        console.log(`I'm pairing ${user.red} with ${secondHalf[i].green}`)
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

/**
 * array of users, split in half, pair with first half, send data to airtable
 */