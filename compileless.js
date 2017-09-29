var fse   = require('fs-extra');
var path = require('path');
var less = require('less');

function toCSS(lessFileName) {
    return lessFileName.replace(".less", ".css");
}

module.exports = (async ()=> {
    console.log("Compiling LESS files");
    
    let lessFolder = `${__dirname}/less/`;
    let outFolder = `${__dirname}/public/less/`;
    await fse.ensureDir(outFolder);
    
    let lessFileNames = await fse.readdir(lessFolder);
    for (let lessFileName of lessFileNames) {
        let lessFile = await less.render((await fse.readFile(lessFolder + lessFileName)).toString());
        await fse.writeFile(outFolder+toCSS(lessFileName), lessFile.css, {flag:'w'});
    }
    
    console.log("Compiled LESS files");
})();