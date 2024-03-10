const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
const { validate } = require("../models/Course");
require("dotenv").config();

// SignUp

exports.signUp = async (req, res) => {
  try {
    // data fetch fro req ki body

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate krlo

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }
    // check password and  confirm password match

    if (password !== confirmPassword) {
      res.status(400).json({
        succes: false,
        message:
          "Password and ConfirmPassword Value does not match , please Enter the valid password ",
      });
    }

    // check user alredy exit or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User is already registered, please sign in to continue ",
      });
    }
    // find most recent otp stored for the user

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    // validate otp

    if (recentOtp.length == 0) {
      // OTP nhi mila
      return res.status(400).json({
        succes: false,
        message: "The OTP is not valid",
      });
    } else if (otp !== recentOtp[0].otp) {
      // Invalid otp

      return res.status(400).json({
        succes: false,
        message: " Invalid OTP",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).josn({
      success: true,
      message: "User is registered Successfuly",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User can not be  registered . Please try again",
    });
  }
};
// login

exports.login = async (req, res) => {
  try {
    // get data from req ki body

    const { email, password } = req.body;

    // validation of data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields  are required, please Fill all fields  again",
      });
    }

    // user check  exit or not

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered , plese sign first ",
      });
    }

    // generate JWT, after password matching

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      user.password = undefined;

      // compare code with lovebhaiya 1 change

      // if (await bcrypt.compare(password, user.password)) {
      //   const payload = {
      //     email: user.email,
      //     id: user._id,
      //     accountType: user.accountType,
      //   };
      //   const token = jwt.sign(payload, process.env.JWT_SECRET, {
      //     expiresIn: "2h",
      //   });

      // create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User Login Success",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    // / Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: "Login Failed, Please Try again",
    });
  }
};

// send OTP

exports.sendotp = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    // check if user already exit

    const checkUserPresent = await User.findOne({ email });

    // if user already exits, then return a response

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered",
      });
    }
    // generated otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generator:", otp);

    // check unique otp or not

    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        // lowerCaseAlphabets: false,
        // specialChar: false,
      });
      // result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = {email, otp};
    // console.log( "otp payload now", otpPayload);

    // create an entry for OTP

    const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};








//     const otpBody = await OTP.create(otpPayload);
//     console.log("OTP  Body ", otpBody);

//     // return response

//     res.status(200).json({
//       success: true,
//       message: `OTP Send succesfully `,
//       otp,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Change Password

exports.changePassword = async (req, res) => {
  try{
    // get data from req body
    const userDetails = await User.findById(req.user.id);
  // get oldPassword, newPassword, confirmPassword

  const{oldPassword, newPassword, confirmNewPassword} = req.body;

  // validation old password 

  const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password);
  if(!isPasswordMatch){
    // if old password does not match return 401 (Unauthorized ) error
  return res.status(401).json({
    success:false,
    message:"The Pasword is incorrect"
  });
  }
  // match new password and confirm password 

  if(newPassword !== confirmNewPassword){
    // If new password and confirm new password do not match, return a 400 (Bad Request) error
    return res.status(400).json({
      success:false,
      message:"The password and confirm passoword does not match"
    });

  }
  // update password
  const encryptedPassword = await
  bcrypt.hash(newPassword, 10);
  const updatedUserDetails = await 
  User.findByIdAndUpdate(
    req.user.id,
    {password:encryptedPassword},
    {new:true}
  );
  // send mail - password update
  try{
    const emailResponse = await
    mailSender(
      updatedUserDetails.email,
      passwordUpdated(
        updatedUserDetails.email,
        `Password updated successfully for ${updatedUserDetails.firstName}
${updatedUserDetails.lastName}`
      )
    );
    console.log("Email sent successfully", emailResponse.response);
  }
  catch(error){
    // / If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while sending email", error);
    return res.status(500).json({

          success:false,
      error:error.message,
    })

  }
  // return respone
  return res.status(200).json({
    success:true,
    message:"Password updated successfully"
  });

  }
  catch(error){
    // / If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
