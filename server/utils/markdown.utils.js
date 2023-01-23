const marked = require("marked")
const { loadFileContentsIntoMemory } =require("./file.utils")
const { CHANGELOG } = require("../constants/path.constants");
const { DOCUMENTATION } = require("../constants/path.constants");
//TODO: parse the changelog config for the front end.
const parseMarkedDownFile = (markDown) => {
    return marked.parsed(markDown)
}


  const generateChangelog = async () => {
const data = await loadFileContentsIntoMemory(CHANGELOG)
const stringdata = data.toString("UTF8")
  return marked.parse(stringdata)
}


const generateReadMe = async () => {
const data1 = await loadFileContentsIntoMemory(DOCUMENTATION)
const stringdata1 = data1.toString("UTF8")
return marked.parse(stringdata1)
}


module.exports = {
    generateChangelog,
    generateReadMe
  }
