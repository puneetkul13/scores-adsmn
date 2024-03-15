
const registerService = require("../services/register")
const isNumeric = /^\d+$/;
exports.getOtp = async (req, res) => {
    try{
    let mobileNumber = req.body.mobileNumber
    if (!isNumeric.test(mobileNumber)) {
        res.status(500).json({ error: "mobile number should only contain digits" });
      } 
    if(mobileNumber.length!==10){
        res.status(500).json({ error: "mobile number should be of length 10" });
    }
    let res1 = await registerService.createOtp(mobileNumber)
    return res.status(200).json({success: true});}
    catch(error){
        return res.status(500).json({error: 'error'})
    }
}

exports.registerUser = async (req, res) => {
    try{
    let {mobileNumber, dateOfBirth, name, email, otp} = req.body
    if(!otp){
        res.status(500).json({ error: "otp is mandatory" });
    }
    if(otp !== "1234"){
        res.status(500).json({ error: "otp is incorrect" });
    }
    if(!mobileNumber){
        res.status(500).json({ error: "mobile number is mandatory" });
    }
    if(!dateOfBirth){
        res.status(500).json({ error: "date of birth is mandatory" });
    }
    if(!name){
        res.status(500).json({ error: "name is mandatory" });
    }
    if(!email){
        res.status(500).json({ error: "email is mandatory" });
    }
    let res1 = await registerService.createUser(mobileNumber, dateOfBirth, name, email)
    return res.status(200).json(res1);}
    catch(error){
        return res.status(500).json({error: 'error'})
    }
}