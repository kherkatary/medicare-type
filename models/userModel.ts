import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    mailCrypto:{
        type:String,
        require:true
    },
    isMailVerified:{
        type:Boolean,
        defaultValue:false

    }

}, { timestamps: true })

export default mongoose.model('users', userSchema);
