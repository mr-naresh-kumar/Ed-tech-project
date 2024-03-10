 const User = require("../models/User");

 const mailSender = require("../utils/mailSender");
 const bcrypt  = require("bcrypt");



// resetPasswordToken

exports.resetPasswordToken = async(req, res) =>{

    try{
        // get email from req body 

    const email = req.body.email;
    // check user for this email, email validation
    const user = await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:`Your Email:${email} is not registered with us`
        });
    }
    //generate token 
    const token = crypto.randomBytes(20).toString("hex");
    // update user by adding token and expiration time 
    const updatedDetails = await User.findOneAndUpdate(
                          {email:email},
                          {
                          token:token,
                          resetPasswordExpires:Date.now() + 5*60*1000,
                          },
                          {new:true});
                          console.log("DETAILS", updatedDetails);

    // create url 
    const url =  `http://localhost:3000/update-password/${token}`


       // sent mail containing url

       await mailSender(email,
        "Password Resest Link",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`);
    //    return response
    return res.json({
        success:true,
        message:"Email Sent Successfully, Please Check Email to Continue Futher"
    })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some thing went wrong  while sending reset pwd mail "
        })

    }




}

// resetPassword

 exports.resetPassword = async (req, res) =>{



    try{
        //data fetch 
  const {password, confirmPassword, token} = req.body;


  // valaidation 
  if(password !== confirmPassword){
      return  res.json({
          success:false,
          message:"Password not matching, please try again ",
      })
  }
  // get ueredetails from using token 
  const userDetails = await User.findOne({token:token});


  // if not enrty - invalid token 
  if(!userDetails){
      return res.json({
          success:false,
          message:"Token is Invalid",
      })
  }
  // token time check 
  if(userDetails.resetPasswordExpires > Date.now()){

      return res.json({
          success:false,
          message:"Token is Expired  Please Regenerate Your Token",
      })
  }
      //  password hash 

      const encryptedPassword = await bcrypt.hash(password, 10);

      // update password
      
      await User.findOneAndUpdate(
        {token:token},
        {password:encryptedPassword},
        {new:true},
      )
      // return respone 

      return res.status(200).json({
        success:true,
        message:"Password Reset Successful",
      })
}

    
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went worng  while sending reset password mail ",
        });

    }
}