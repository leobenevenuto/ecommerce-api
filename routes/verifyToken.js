const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const authorization = authHeader.split(" ")[1]

        jwt.verify(authorization, process.env.JWT_SEC, (err, user) => {

            if (err) {
                res.status(403).json("Token incorreto")
            }

            req.user = user
            next();
        })
    } else {
        return res.status(401).json("Você não está autenticado")
    }
}




const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Você não possui permissão para executar esta ação")
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("Você não possui permissão para executar esta ação")
        }
    })
}



module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken }