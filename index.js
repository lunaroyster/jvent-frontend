const fse = require('fs-extra');

module.exports = (async function() {
    console.log("Compiling frontend assets.");
    
    await require('./compileless');
    // require("./webpack");
    
    console.log("Compiled frontend assets.");
})();