const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwttoken;
        
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token});
        if(!rootUser){throw new error("user not found")}

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();

    } catch (error) {
        res.status(401).json({error: "error has occore inside authenticate middleware"})
    }
}

module.exports = Authenticate;