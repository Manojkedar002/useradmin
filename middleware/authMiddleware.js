const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        console.log(req.headers['authorization']);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                console.log(err);
                return res.status(401).send({
                    
                    success: false,
                    meassage: "un-authorise user"
                });
            }
            else {
                console.log(decode)
                req.body.id = decode._id;
                next();
           } 
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message:"error in auth middleware"
        })
    }
}