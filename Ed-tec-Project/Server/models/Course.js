const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    
    courseName:{
        type:String,
        trim:true,
        
    },
    courseDescription:{
        type:String,
        trim:true,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,

    },
    whatYouWillLearn:{
        type:String,

    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    price:{
        type:Number,

    },
    thumbnail:{
        type:String,

    },
    tag:{
        type:[String],
        required:true,
    },
    category:{
       type:mongoose.Schema.Types.ObjectId,
    //    type:String,
       ref:"Category",
    },

    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    }],
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft", "Published"],
    },


});

module.exports = mongoose.model("Course", courseSchema)