// Adversarial checks of the numerical linter; passing is not a proof of general correctness.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {instance: linter} = require('../js/timonel_linter.js');
const cases = [
  ['x^2 = 1', 'x = 1', false, 'inconclusive'],
  ['x = 0', '0 = 0', false, 'inconclusive'],
  ['0 = 0', 'x = 0', false, 'inconclusive'],
  ['x^2 = 1', 'x = 1/2', false, 'inconclusive'],
  ['x^2 = 1', 'x = 1 \\lor x = -1', false, 'syntax_error'],
  ['-x^2', '(-x)^2', false, 'divergent'],
  ['-x^2', '-(x^2)', true, 'numerically_consistent'],
  ['2^-2', '0.25', true, 'numerically_consistent'],
  ['2^3^2', '512', true, 'numerically_consistent'],
  ['x', 'x@', false, 'syntax_error'],
  ['x = 0', 'x = 0 = 1', false, 'syntax_error'],
  ['1', '1.2.3', false, 'syntax_error'],
  ['x/x', '1', false, 'domain_mismatch'],
  ['ln(x*y)', 'ln(x)+ln(y)', false, 'domain_mismatch'],
  ['(x^2-y^2)/(x-y)', 'x+y', false, 'domain_mismatch'],
  ['(x-4)*(x+4)', 'x^2-16', true, 'numerically_consistent'],
  ['cos(x)^2+sin(x)^2', '1', true, 'numerically_consistent'],
  ['x+5=12', 'x=7', true, 'numerically_consistent'],
  ['(a+b)^2', 'a^2+b^2', false, 'divergent'],
];
const results = cases.map(([previous, current, valid, status]) => {
  const result = linter.checkEquivalence(previous, current);
  assert.equal(result.valid, valid, `${previous} -> ${current}`);
  assert.equal(result.status, status, `${previous} -> ${current}`);
  if (valid) assert.equal(result.formal_proof, false);
  return {previous, current, expected_valid: valid, ...result};
});
console.log(JSON.stringify({scope: '19 predefined regression cases; no human visualization benefit measured', passed: results.length, results}, null, 2));
