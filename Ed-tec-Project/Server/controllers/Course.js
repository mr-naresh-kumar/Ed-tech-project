const { isInstructor } = require("../middlewares/auth");
const Course = require("../models/Course");

const Category = require("../models/Category");

const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// createCourse handler function

exports.createCourse = async (req, res) => {
  try {
    // fetch data
    // const { courseName, courseDescription, whatYouWillLearn, price, tag } =
    //   req.body;
    const  userId = req.user.id;

    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
      status,
      instructor,
    } = req.body;

    // get thumbnail

    const thumbnail = req.body.thumbnailImage;

    // validaton
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail ||
      !category
    ) {
      return res.status(400).json({
        success: fasle,
        message: "All fields  are required",
      });
    }
    if(!status || status === undefined){
      status:"Draft";
    }

    // check  for instructor

    const instructorDetails = await User.findById(userId,{
      accountType:"Instructor",
    });

    console.log("Instructor Details", instructorDetails);

    // todo verify that userId and instructorDetails._id are same or deifferent

    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    // check given tag is valid or not

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Category Details not found ",
      });
    }
    // uploda Image to coudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    console.log(thumbnailImage);

    // create an entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      category: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status:status,
      instructor:instructor,
    });

    // add the new course to user schema of Instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    // update the TAG ka shema
    
    await Category.findByIdAndUpdate(
      {_id:category},
      {
        $push:{
          courses:newCourse._id,
        },
      },
      {new: true}
    )

    // return response

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// get allCourse handler function

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully ",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Cannot Fetch course data",
      error: error.message,
    });
  }
};


// getCourseDetails 

exports.getCoursesDetails = async  (req, res) =>{
  try{
    // get id
    const {courseId} = req.body;
    // find course details 

    const courseDetails = await Course.find(
                                         {_id:courseId}
                                         .populate(
                                          {
                                            path:"instructor",
                                            populate:{
                                              path:"additionalDetails",
                                            },
                                          }
                                         )
                                         .populate("category")
                                         .populate("ratingAndreviews")
                                         .populate(
                                          {
                                            path:"courseContent",
                                            populate:{
                                              path:"subSection",
                                            },
                                          }
                                         ).exec()
    );
    // validation 
    if(!courseDetails){
      return res.status(400).json({
        success:false,
        message:`Could not found the code with ${courseId}`,
      });
    }
    // return response 
    return res.status(200).json({
      success:true,
      message:"Course details fetched successfully",
      data:courseDetails,
    })

  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message,
    })

  }
}
