exports.getMessages = (req, res) => {
    try{
        res.json(['first', 'second', 'third'])
    } catch (err){
        res.status(500).send(err.message)
    }
}