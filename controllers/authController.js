const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// //user registerController
// const registerController = async (req, res) => {
//     try {
//         const { name, email, password, phone } = req.body
//         const user1 = await User.findOne({ email });
//         if (user1) {
//             return res.status(404).send({
//                 success: false,
//                 message: "given mail id is already register",
//             })
//         }
//         const salt=await bcrypt.genSalt(10)
//         const hashpassword = await bcrypt.hash(password, salt);
//         const user = await User.create({ name, email, password:hashpassword, phone });
//         return res.status(201).send({ success: true, message: "user succesfully added", user });
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(500).send({ success: false, message: "error in registerController" })
//     }
// }
//login 
const loginUserController = async (req, res) => {
    try { 
        const { email, password } = req.body
        console.log(email, password);
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: "Un-authorise User"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message:"user not found"
            })
        }
        
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
             const accessToken = jwt.sign({ _id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            // Generate refresh token
            const refreshToken = jwt.sign({ _id: user._id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

            // Save refresh token in the user document
            user.refreshToken = refreshToken;
            await user.save();
            return res.status(200).send({
                success: true,
                message: "Login succesfully",
                user,
                accessToken,
                refreshToken
            })
        }
        else {
            return res.status(401).send({
                success: false,
                message:"invalid password"
            })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message:"error in loginUserController"
        })
    }
}
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/userSchema');

// User registration controller accessible only by admin
const adminUserRegisterController = async (req, res) => {
    try {
        // Check if the request is coming from an admin user
        if (!req.user.isAdmin) {
            return res.status(403).send({
                success: false,
                message: "Only admin users can register new users.",
            });
        }

        const { name, email, password, phone } = req.body;

        // Check if the email is already registered
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: "Email already registered.",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        // Create the user
        const newUser = await User.create({ name, email, password: hashpassword, phone });

        return res.status(201).send({
            success: true,
            message: "User successfully registered by admin.",
            user: { _id: newUser._id, name, email, phone },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Error in adminUserRegisterController" });
    }
};



module.exports = {
    //registerController,
    loginUserController,
    adminUserRegisterController
}