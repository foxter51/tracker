const db = require('../models')
const { Op } = require("sequelize")
const { checkDomain } = require('./auth.service')
const User = db.user

const Team = db.team

async function findOne(userId) {
    try{
        const user = await User.findByPk(userId, {
            include: [
                { model: Team }
            ],
            attributes: { exclude: ['password'] }
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

async function findAllExcept(userIds) {
    try{
        const users = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: userIds
                }
            }
        })
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

        let validDomainName

        await checkDomain(patchedUser.email.split('@')[1]).then(() => {
            validDomainName = true
        }).catch(() => {
            validDomainName = false
        }).finally(() => {
            if (!validDomainName) {
                throw new Error('Invalid email domain')
            }
        })

        if(patchedUser.email !== oldUser.email && await User.findOne({ where: { email: patchedUser.email } })){
            throw new Error('Email is already taken')
        }

        if(patchedUser.password === " "){
            delete patchedUser.password
        }

        const updatedUser = await User.update(patchedUser, {
            where: { id: userId },
            individualHooks: patchedUser.hasOwnProperty('password')
        })

        if(updatedUser === 0){
            throw new Error('User not found')
        }

        return { user: await User.findByPk(userId, {
            include: [
                { model: Team }
            ]
        }) }
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
    findAllExcept,
    update,
    destroy
}
