const marked = require("marked")
const parseMarkedDownFile = (markDown) => {
    return marked.parsed(markDown)
}