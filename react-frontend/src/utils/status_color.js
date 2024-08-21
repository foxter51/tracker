const statusColor = (scrumStatus) => {
    switch (scrumStatus) {
        case "TO DO":
            return "text-danger"
        case "IN PROGRESS":
            return "text-warning"
        case "IN REVIEW":
            return "text-primary"
        case "DONE":
            return "text-success"
        default:
            return "text-secondary"
    }
}

module.exports = statusColor