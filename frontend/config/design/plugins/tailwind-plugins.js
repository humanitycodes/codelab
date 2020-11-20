function customUtilities ({addUtilities, config}) {
  const controlHeight = parseInt(config('height.control-height').split('p')[0])
  const newUtilities = {
    '.text-control-font-size': {
      fontSize: controlHeight * .3 + 'px',
    },
    '.leading-control-line-height': {
      lineHeight: controlHeight + 'px'
    },
    '.px-control-x': {
      'paddingLeft': controlHeight * .4 + 'px',
      'paddingRight': controlHeight * .4 + 'px'
    }
  }
  addUtilities(newUtilities, {
    respectPrefix: false,
    respectImportant: false,
  })
}

module.exports = [customUtilities]
