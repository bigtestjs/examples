module.exports = (config) => {
  config.set({
    frameworks: ['mocha'], // sets up the Mocha framework automatically
    reporters: ['mocha'], // reports back to the CLI formatted like Mocha
    browsers: ['Chrome'], // automatically launches chrome to run our tests

    files: [
      // karma-webpack will watch our files
      { pattern: 'tests/index.js', watched: false }
    ],

    preprocessors: {
      // tells Karma that we'll be using Webpack to process this file
      'tests/index.js': ['webpack']
    },

    // Mocha reporter options
    mochaReporter: {
      showDiff: true
    },

    // our webpack config exports a function
    webpack: require('./webpack.config')(),

    // webpack dev middleware options
    webpackMiddleware: {
      stats: 'minimal'
    },

    // for more Karma config options, check out the documentation
    // http://karma-runner.github.io/2.0/config/configuration-file.html
  });
};
