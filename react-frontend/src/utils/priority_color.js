const priorityColor = (priority) => {
    switch (priority) {
        case "LOW":
            return "text-success"
        case "MEDIUM":
            return "text-warning"
        case "HIGH":
            return "text-danger"
        default:
            return "text-secondary"
    }
}

module.exports = priorityColor