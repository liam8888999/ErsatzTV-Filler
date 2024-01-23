const marked = require("marked")
const { loadFileContentsIntoMemory } =require("./file.utils")
const { CHANGELOG } = require("../constants/path.constants");
const logger = require("../utils/logger.utils");


const parseMarkedDownFile = (markDown) => {
    return marked.parsed(markDown)
}


  const generateChangelog = async () => {
const data = await loadFileContentsIntoMemory(CHANGELOG)
const stringdata = data.toString("UTF8")
  return marked.parse(stringdata)
}

const changelogReplace = async (res,req) => {
let html = await generateChangelog()
html = html.replace(/<ul>/g,"<ul style='list-style-position: inside;'>").replace(/<h3/g,"<h4").replace(/<\/h3>/g,"</h4>").replace(/<h2/g,"<h3").replace(/<\/h2>/g,"</h3>").replace(/ id=\"[^"]*\"/g, "").replace(/<h4>Fixed<\/h4>/g, "<h4 style='color: blue;'>Fixed</h4>").replace(/<h4>Added<\/h4>/g, "<h4 style='color: green;'>Added</h4>").replace(/<h4>Note<\/h4>/g, "<h4 style='color: purple;'>Note</h4>").replace(/<h4>Removed<\/h4>/g, "<h4 style='color: red;'>Removed</h4>").replace(/<h4>Changed<\/h4>/g, "<h4 style='color: orange;'>Changed</h4>").replace(/<h4>Refactored<\/h4>/g, "<h4 style='color: gold;'>Refactored</h4>").replace(/<h3>/g, "<h3 style='color: brown; border-top: 1px solid darkgray; padding-top: 15px;'>").replace(/<li>/g, "<li style='color: white;'>").replace(/<h1>Changelog<\/h1>/g, '<u><center><h1>Changelog</h1></center></u>');
logger.debug(`Changelog replace html: ${html}`)
return html
}




module.exports = {
    generateChangelog,
    changelogReplace
  }
