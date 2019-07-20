/**
 * Returns a function that validates
 * a value to have the minLength provided.
 * @param {number} minLength
 */
function minLengthOf (minLength) {
  return function validateMinLength (val) {
    return val.length >= minLength
  }
}

module.exports = {
  minLengthOf
}
