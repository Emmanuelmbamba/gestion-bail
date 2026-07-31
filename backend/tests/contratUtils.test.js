const test = require('node:test');
const assert = require('node:assert/strict');
const { generateContractNumber, calculateDurationInMonths, getContractStatus } = require('../utils/contratUtils');

test('generateContractNumber returns a contract number', () => {
  const number = generateContractNumber();
  assert.match(number, /^CT-/);
});

test('calculateDurationInMonths returns the correct month difference', () => {
  const start = new Date('2025-01-01');
  const end = new Date('2025-04-01');
  assert.equal(calculateDurationInMonths(start, end), 3);
});

test('getContractStatus marks expired contracts', () => {
  const now = new Date('2025-06-01');
  const start = new Date('2025-01-01');
  const end = new Date('2025-05-01');
  assert.equal(getContractStatus(start, end, now), 'expire');
});
