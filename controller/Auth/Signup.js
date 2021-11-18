const User = require('../../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {JWT_SECRET, JWT_EXP} = require("../../config")

module.exports = async (req, res) => {
    const {name, email, password, postal_code, birthday_date, neighbourhood} = req.body

    try {
        const user = await User.findOne({email})
        if (user) res.status(400).json({error: 'email already exists'})

        const hashPassword = await bcrypt.hash(password, 8)

        const registerUser = new User({
            name,
            email,
            password: hashPassword,
            postal_code,
            birthday_date,
            neighbourhood
        })

        const saveUser = await registerUser.save()

        const token = jwt.sign({userId: saveUser.id}, JWT_SECRET, {
            expiresIn: JWT_EXP,
        })

        saveUser.active = true
        await saveUser.save()

        res.status(201).json({
            message: `Account created for ${email}`,
            token,
            user: saveUser
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Something went wrong"})
    }
}