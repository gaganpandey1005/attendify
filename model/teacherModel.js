const mongoose=require('mongoose');

const teacherSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    token:String,
    tokenExpiry:Date,
    isVerified:{
        type:Boolean,
        default:false
    },
    batch:[{type:mongoose.Schema.Types.ObjectId, ref:"batchModel"}]
    
        
    

})
const Teacher=mongoose.model('Teacher',teacherSchema);
module.exports = Teacher;