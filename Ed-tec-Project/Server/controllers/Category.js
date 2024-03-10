const { response } = require("express");
const Category = require("../models/Category");
// create Tag ka handler function

exports.createCategory = async (req, res) => {
  try {
      // fetch data
    const { name, description } = req.body;
    // validation


    // 2 change to description change nhi kiya mene validation ye karna baki h


    if (!name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // create entry in DB
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// getALl tags handler fuction

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags return succesfully",
      allCategorys,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// categoryPageDetails


exports.categoryPageDetails = async (req, res) =>{

  try{
    // get category id  
    const {categoryId} = req.body;
        
    // get courses for the specified category 
    const selectedCategory = await Category.findById(categoryId).populate("courses").exec();
    console.log(selectedCategory);
    // validation 
    if(!selectedCategory){
      return res.status(404).json({
        success:false,
        message:"Category Not Found"
      });
    }


    // Haldle the case when there are no courses  
    if(selectedCategory.course.length === 0){
      cosole.log("No is courses found for the selected category");
      return res.status(404).json({
        success:false,
        message:"No courses found for the selected category"
      });
    }
    const selectedCourses = selectedCategory.course;
    // get courses for  different categoryies
    const categoriesExceptSelected = await Category.find({
                                _id: {$ne:categoryId},
                                
                               })
                               .populate("courses")
                               .exec();
                               let differentCourses = [];
                               for(const category of categoriesExceptSelected){
                                differentCourses.push(...category.course);
                               }
    // get top selling course 
    const allCategorys = await Category.find().populate("courses");
    const allCourses = allCategorys.flatMap((category)=> category.course);
    const mostSellingCourses= allCourses.sort((a, b) => b.sold - a.sold).slice(0,10);

    
    // return response
   res.status(200).json({
      success:true,
      data:{
        selectedCategory:selectedCourses,
        differentCourses:differentCourses,
        mostSellingCourses:mostSellingCourses,
      }
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
