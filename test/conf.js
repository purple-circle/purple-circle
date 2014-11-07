exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    showColors: true,
    isVerbose: true,
    includeStackTrace: true
  },
  specs: ['specs/**/*.js']
};