const router = require('express').Router()
const SignupUser = require('../controller/Auth/Signup')
const LoginUser = require('../controller/Auth/Login')
const Logout = require('../controller/Auth/Logout')
const ChangePassword = require("../controller/Auth/ChangePassword")

const authRequired = require("../middleware/auth")

router.post('/signup', SignupUser)
router.post('/login', LoginUser)
router.post("/logout",authRequired,Logout)

router.put("/update_password",authRequired,ChangePassword)
module.exports = router
