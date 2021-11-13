const User = require('../../model/User')
const FilterUserData = require('../../utils/FilterUserData')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET, JWT_EXP} = require("../../config")

module.exports = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({error: 'E-mail não cadastrado ou incorreto'})
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({error: 'E-mail e/ou Senha incorreto'})
        }

        const token = jwt.sign({userId: user.id}, JWT_SECRET, {
            expiresIn: JWT_EXP,
        })

        user.active = true
        await user.save()

        const notifications = await Notification.find({ user: user.id }).sort({
            createdAt: -1,
        })
        let notifData = notifications.map((notif) => {
            return {
                id: notif.id,
                body: notif.body,
                createdAt: notif.createdAt,
            }
        })

        return res.status(200).json({
            message: 'login Efetuado com sucesso',
            token,
            user: FilterUserData(user),
            notifications: notifData
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Erro inesperado , por favor entre em contato"})
    }
}