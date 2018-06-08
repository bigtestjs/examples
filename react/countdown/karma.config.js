module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: ['Chrome'],

    files: [
      // karma-webpack will watch our files
      { pattern: 'tests/index.js', watched: false }
    ],

    preprocessors: {
      'tests/index.js': ['webpack']
    },

    mochaReporter: {
      showDiff: true
    },

    // our webpack config exports a function
    webpack: require('./webpack.config')(),

    webpackMiddleware: {
      stats: 'minimal'
    }
  });
};
