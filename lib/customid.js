const fs = require('fs');

let counter = 1;

function generateCustomId() {
  const prefix = 'MNSKOL';
  let paddedNumber = counter.toString().padStart(3, '0');

  if (counter > 999) {
    const numDigits = Math.floor(Math.log10(counter)) + 1;
    paddedNumber = counter.toString().padStart(numDigits, '0');
  }

  const customId = `${prefix}${paddedNumber}`;
  counter++;
  saveCounterValue(counter); // Save the updated counter value
  return customId;
}

function saveCounterValue(value) {
  fs.writeFile('counter.txt', value.toString(), (err) => {
    if (err) {
      console.error('Error saving counter value:', err);
    } else {
      console.log('Counter value saved successfully.');
    }
  });
}

function readCounterValue() {
  try {
    const data = fs.readFileSync('counter.txt', 'utf8');

    return parseInt(data, 10) || 1;
  } catch (err) {
    console.error('Error reading counter value:', err);
    return 1;
  }
}

counter = readCounterValue();

module.exports = generateCustomId;
