const mongoose = require("mongoose");
const CourseProgress = require("./CourseProgress");

// Define the user schema  using the mongoose  schema  contructor 

const userSchema = new mongoose.Schema({
    // Define the name field with type String required, and trimmed 
    firstName:{
        type:String,
        required:true,
        trim:true,

    },
    lastName:{
        type:String,
        required:true,
        trim:true,

    },

    // Define the email field with type String,  required and trimmed 
    email:{
        type:String,
        required:true,
        trim:true,
    },

    // Define the password field with type String and required 
    password:{
        type:String,
        required:true,
        // trim:true,
    },
    accountType:{
        type:String,
         enum:["Admin", "Student", "Instructor"],
         required:true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },

    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],

    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,

    },
    resetPasswordExpires:{
           type:Date,
           
    },
    CourseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProcess",
    }],


},
{timestamps:true}
);

module.exports = mongoose.model("User", userSchema)











