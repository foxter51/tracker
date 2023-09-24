const db = require('../models')
const User = db.user

const Team = db.team

async function findOne(userId) {
    try{
        const user = await User.findByPk(userId, {
            include: [
                { model: Team }
            ]
        })

        if(!user){
            throw new Error('User not found')
        }

        return { user }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function findAll() {
    try{
        const users = await User.findAll()
        return { users }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function update(patchedUser, userId) {
    try{
        const oldUser = await User.findByPk(userId)

        if(!oldUser){
            throw new Error('User not found')
        }

        if(patchedUser.username !== oldUser.username && await User.findOne({ where: { username: patchedUser.username } })){
            throw new Error('Username is already taken')
        }

        if(patchedUser.email !== oldUser.email && await User.findOne({ where: { email: patchedUser.email } })){
            throw new Error('Email is already taken')
        }

        const updatedUser = await User.update(patchedUser, {
            where: { id: userId },
            individualHooks: true
        })

        if(updatedUser === 0){
            throw new Error('User not found')
        }

        return { user: await User.findByPk(userId) }
    } catch (err) {
        throw new Error(err.message)
    }
}

async function destroy(userId) {
    try{
        await User.destroy({
            where: { id: userId }
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    findOne,
    findAll,
    update,
    destroy
}
