const marked = require("marked")
//TODO: parse the changelog config for the front end.
const parseMarkedDownFile = (markDown) => {
    return marked.parsed(markDown)
}