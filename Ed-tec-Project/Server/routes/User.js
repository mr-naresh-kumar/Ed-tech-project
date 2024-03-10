const express = require("express")
const router = express.Router()


// Import the requied contollers and middleware funciton 


const {
    login,
    signUp,
    sendotp,
    changePassword,
} = require("../controllers/Auth")

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")


const {auth} = require("../middlewares/auth")

// Routes  for Login, Signup, and Authentication 

// Authentication routes 



// Route for user login
router.post("/login", login)

// Route for user signup 
router.post("/signup", signUp)

// Route for sending OTP to the user's email 
router.post("/sendotp", sendotp)

// Router for Changing the passoword 
router.post("/changepassword", auth, changePassword)


// Reset Password 

// Route for generating  a reset password token 
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's passoword  after verifaction 

router.post("/reset-password", resetPassword)

// Export the router for use in the  main application 

module.exports = router