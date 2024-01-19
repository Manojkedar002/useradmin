const User = require("../models/userSchema");

//get user details
const getUserController = async (req, res) => {
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
//update user 
const updateUserController = async (req, res) => {
    try { 
        const user = await User.findById(req.body.id);
        const { name, address, phone } = req.body
        if (name) user.name = name;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        await user.save()
        return res.status(200).send({
            success: true,
            message: "user update succesfully",
            user
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message:"error in updateUserController"
        })
    }
}
//delete user
const deleteUserController = async (req, res) => {
    try { 
        const deleteduser = await User.findByIdAndDelete(req.body.id);
        return res.status(200).send({
            success: true,
            message: "uder deleted succesfully",
            deleteduser
        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({
            success: false,
            message:"error in deleteUserController"
        })
    }
}

module.exports={getUserController,updateUserController,deleteUserController}