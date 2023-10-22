const path = require('path');

module.exports = {
  // Mode
  mode: 'development', // 'production' for production

  // Entry point
  entry: "./static/js/main.js", 

  // Output
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static/js'), // Destination in Flask static files
  },
};