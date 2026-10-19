import jwt from 'jsonwebtoken'

function auth(...roles) {
    return function (req, res, next) {
        try {
           let token = req.cookies.token || req.headers.authorization?.split(" ")[1]
            if (!token) {
                return res.status(401).json({ success: false, message: "Token missing" })
            }
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ success: false, message: "Access denied" })
            }
            req.user = decoded
            next()
        } catch (error) {
            return res.status(401).json({ success: false, message: "Invalid token" })
        }
    }
}

export default auth