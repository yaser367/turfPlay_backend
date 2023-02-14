const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:[true,"Username should required"]
    },
    email:{
        type:String,
        require:[true,"email should required"]
        
    },
    password:{
        type:String,
        require:[true,"password should required"]
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    address:{
        type:String
    },
    mobile:{
        type:Number
    },
    profile:{
        type:String
    },
    isverified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("User",userSchema)