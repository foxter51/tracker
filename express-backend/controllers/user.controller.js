const userService = require('../services/user.service')

async function findOne(req, res) {
    const { id } = req.params

    try{
        const user = await userService.findOne(id)
        res.json(user)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function findAll(req, res) {
    let { exceptUserIds } = req.query
    exceptUserIds = exceptUserIds?.split(',') ?? []

    try{
        const users = exceptUserIds.length === 0 ? await userService.findAll() : await userService.findAllExcept(exceptUserIds)
        res.json(users)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function update(req, res) {
    const { id } = req.params

    try{
        const updatedUser = await userService.update(req.body, id)
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

async function destroy(req, res) {
    const { id } = req.params

    try{
        await userService.destroy(id)
        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

module.exports = {
    findOne,
    findAll,
    update,
    destroy
}