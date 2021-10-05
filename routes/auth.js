const router = require("express").Router();
const User = require("../models/User")
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res) => {

    const encryptedPassword = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: encryptedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }

});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            res.status(401).json("Usuário e/ou senha inválidos")
        }

        const hashPassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)

        const passwordString = hashPassword.toString(cryptoJS.enc.Utf8);

        if (passwordString !== req.body.password) {
            res.status(401).json("Usuário e/ou senha inválidosss")
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        )

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});

    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
})


module.exports = router;