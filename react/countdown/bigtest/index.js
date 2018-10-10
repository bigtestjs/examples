import '@babel/polyfill';

// other setup could be done here too, such as registering chai helpers

// we import our tests using webpack's require.context
const requireTest = require.context('.', true, /-test/);
requireTest.keys().forEach(requireTest);
