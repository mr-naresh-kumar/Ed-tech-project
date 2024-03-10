const SubSection = require("../models/SubSection");
const Section  = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { deletesection } = require("./Section");
const { findByIdAndDelete } = require("../models/User");


// create Subsection
 exports.createSubSection = async(req, res) =>{
    try{
        //fetch data from req body 
        const  {sectionId, title, timeDuration, description} =  req.body;

        // extract file/video 
        const video = req.file.videoFile;
        // valadation video to cloudinary 
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(404).json({
                success:false,
            message:"All fields are required",
            })
        }
        // upload video to cloudnary 
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        // create a sub section 
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            descripton:description,
            vidoeUrl:uploadDetails.secure_url,
        })
        // update section with this sub section objectId 

        const updatedSection  = await Section.findByIdAndUpdate({_id:sectionId},
                                                       {$push:{
                                                        subSecton:subSectionDetails._id,
                                                       }},
                                                       {new:true},
            ).populate("subSection");

          
        // return response 

        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            updatedSection,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal  Server error",
            error:error.message,
        })

    }
 };



//  HW updatSubSection 
exports.updateSubSection = async (req, res) => {

    try{
        // data input 
        const {subSectionId, subSectionName} = req.body;


        // data valadation 
        if(!subSectionId || !subSectionName){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        // update data 
        const subSection = await  subSection.findOneAndUpdate(subSectionId, {subSectionName},
            {new:true});
        // return res 
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
        });

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to data, please try again"
        });
    }
}

// HW :deleteSubSection 


exports.deleteSubSection = async(req,res)=>{
    try{
        // get Id - assuming that we are sending ID in Params 
        const {subSectionId, subSection} = req.params
        // use findByIdAndDelete
        await subSection.findByIdAndDelete(subSectionId);

        // Todo [testing] do we need to delete the entry from the course schema
        // return response 
        return   res.status(200).json({
            success:false,
            message:"SubSection Deleted Successfully "
        });
    
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete SuSection, please try again ",
            error: error.message,
        })

    }
}