const express = require("express")
const router = express.Router()


// Import the controller 

// Course Controllers Import 

const {
    createCourse,
    getAllCourses,
    getCoursesDetails
} = require("../controllers/Course");

// categorires Controller Import 

const {
    showAllCategories,
    createCategory,
    categoryPageDetails,

} = require ("../controllers/Category")

// section Controllers Import 

const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

// sub-Section controllers Import  

const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection")


// Rating Controllers Import  
 
const {
    createRating,
    getAverageRating,
    getAllRating,
} = require ("../controllers/RatingAndReview")

// import middewares 

const {auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth")

// course routes 


// Course can only be Created by Instructor 

router.post("/createCourse", auth, isInstructor, createCourse)

// Add a Section to a Course 

router.post("/addSection", auth, isInstructor, createSection)

// update a Section 

router.post("/updateSection", auth, isInstructor, updateSection)

// Delete a section 
router.post("/deleteSection", auth, isInstructor, deleteSection)

// Edit Sub Section 

router.post("/updateSubSection", auth, isInstructor, updateSubSection)

// Delete A Sub Section 

router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)

// Add a Sub  Section to a Section 

router.post("/addSubSection", auth, isInstructor, createSubSection)

// Get all Registered Courses 

router.get("/getAllCourses", getAllCourses)

// Get Details for a Specific Courses 

router.post("/getCoursesDetails", getCoursesDetails)




// Category routes (Only by Admin) 


// Category can only be Created be Admin 
// TODO :Put ISAdmin middleware here  

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)



// Review and Rating 


router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router
