const Section = require("../models/Section");
const Course = require("../models/Course");
const { findByIdAndDelete } = require("../models/User");
exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validstion

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required Properties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });

    // update Course  with section objectID
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      }
    }).exec();
    // return response
    return res.status(200).json({
      success: true,
      message: "Section  Created Successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again ",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;
    // data valadation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // update data

    const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
    // return res

    return  res.status(200).json({
        success:true,
        message:"Section Updated Successfully",
        section,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again ",
      error: error.message,
    });
  }
};


exports.deleteSection = async(req, res) =>{
    try{
        // get Id  - assuming that we are sending ID in Params
        const{sectionId}  = req.params;

        // use findByIdAndDelete 
        await Section.findByIdAndDelete(sectionId);
        // Todo [testing] do we need to delete the entry from the course schema 
        // return response 
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, Please try again ",
            error:error.message,
        })

    }
}
