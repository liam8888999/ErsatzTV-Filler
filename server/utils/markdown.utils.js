const marked = require("marked")
const { loadFileContentsIntoMemory } =require("./file.utils")
const { CHANGELOG } = require("../constants/path.constants");
//TODO: parse the changelog config for the front end.
const parseMarkedDownFile = (markDown) => {
    return marked.parsed(markDown)
}


  const generateChangelog = async () => {
const data = await loadFileContentsIntoMemory(CHANGELOG)
const stringdata = data.toString("UTF8")
  return marked.parse(stringdata)
}


module.exports = {
    generateChangelog
  }
