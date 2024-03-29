
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    isAdmin:{type:Boolean,default:false},
    refreshToken:{type:String},
});

const User = new mongoose.model('User', userSchema);
module.exports=User