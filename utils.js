const color = require('log-color-utils')

exports.min = (...nums) => {
  return nums.sort()[0]
}

exports.info = (...args) => console.log(color.info(...args))

exports.logPad = color.logPad

exports.yellow = color.chalk.yellow

exports.error = color.bgError

exports.warning = (...args) => console.log(color.bgWarning(...args))
