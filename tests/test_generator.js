import { generateLottoJS, isValidCombination } from '../static/lotto_fallback.js';

function runTests() {
  for (let i=0;i<1000;i++){
    const res = generateLottoJS();
    if (!isValidCombination(res.numbers)) {
      console.error('Invalid combination', res);
      process.exit(2);
    }
    if (new Set(res.numbers).size !== 6) { console.error('Duplicate found', res); process.exit(2); }
  }
  console.log('All tests passed');
}

runTests();
