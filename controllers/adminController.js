const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// Admin registration controller
const adminRegisterController = async (req, res) => {
    try {
        // Check if the request is coming from an admin user
        

        const { name, email, password, phone } = req.body;
        
        // You can set isAdmin based on your logic, for example, if email is admin@example.com
        const isAdmin = email === 'admin@example.com';

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

        // Create the admin user
        const adminUser = await User.create({ name, email, password: hashpassword, phone, isAdmin });

        return res.status(201).send({
            success: true,
            message: "Admin user successfully registered.",
            adminUser: { _id: adminUser._id, name, email, phone, isAdmin },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Error in adminRegisterController" });
    }
};

// Admin login controller
const adminLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the request is coming from an admin user
        // if (!req.body.isAdmin) {
        //     return res.status(403).send({
        //         success: false,
        //         message: "Admin users cannot perform admin login actions.",
        //     });
        // }

        // Find the user by email
        const adminUser = await User.findOne({ email });

        if (!adminUser) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, adminUser.password);

        if (isMatch) {
            // Generate access token
            const accessToken = jwt.sign({ _id: adminUser._id, isAdmin: adminUser.isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

            // Generate refresh token
            const refreshToken = jwt.sign({ _id: adminUser._id, isAdmin: adminUser.isAdmin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

            // Save refresh token in the user document
            adminUser.refreshToken = refreshToken;
            await adminUser.save();

            return res.status(200).send({
                success: true,
                message: "Admin login successfully",
                adminUser: { _id: adminUser._id, name: adminUser.name, email: adminUser.email, phone: adminUser.phone, isAdmin: adminUser.isAdmin },
                accessToken,
                refreshToken,
            });
        } else {
            return res.status(401).send({
                success: false,
                message: "Invalid password",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error in adminLoginController",
        });
    }
};
//get admin controller
const getAdminController = async (req, res) => {
    try {
        console.log(req.body.id)
        const user = await User.findById(req.body.id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "user not found"
            });
        }
        user.password = undefined;
        return res.status(200).send({
            success: true,
            message: "get user succesfully",
            user
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message:"error in getUserotroller"
        })
    }
}

module.exports = { adminRegisterController, adminLoginController,getAdminController };
