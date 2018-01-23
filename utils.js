const color = require('log-color-utils')

exports.min = (...nums) => {
  return nums.sort()[0]
}

exports.info = str => {
  const info = `${color.chalk.blue('info')} ${str}`
  console.log(info)
}

exports.logPad = color.logPad

exports.yellow = color.chalk.yellow

exports.error = color.error

exports.warning = color.warning
