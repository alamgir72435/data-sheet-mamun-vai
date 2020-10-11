const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    accountNo:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    signature_card:{
        type:String,
        required:true
    },
    photo_id:{
        type:String,
        required:true
    },
    acc_holder_id:{
        type:String,
        required:true
    },
    nomeny_holder_id:{
        type:String,
        required:true
    }
})


module.exports = User = mongoose.model('user', userSchema)