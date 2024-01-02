let counter = 1;

function generateCustomId() {
  const prefix = 'MNSKOL';
  let paddedNumber = counter.toString().padStart(3, '0'); // Start with 3-digit padding

  if (counter > 999) {
    const numDigits = Math.floor(Math.log10(counter)) + 1; // Calculate the number of digits needed
    paddedNumber = counter.toString().padStart(numDigits, '0'); // Adjust padding dynamically
  }

  const customId = `${prefix}${paddedNumber}`;
  counter++;
  return customId;
}
module.exports = generateCustomId;