const otpMobileModel = require("../models/otpMobile");
const userModel = require("../models/user");
const moment = require("moment")
const crypto = require('crypto');
const key = 'yourSecretKeyYourSecretKey'; // Replace with a secure secret key
const algorithm = 'aes-256-cbc';
exports.createOtp = async (mobileNumber) => {
    try {
        let otp = await otpMobileModel.find({ mobileNumber })

        if (otp.length === 0) {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30);
            return await otpMobileModel.create({ mobileNumber, otp: "1234", createdAt: currentDate, updatedAt: currentDate });
        }
        else {
            const currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30);
            let res = await otpMobileModel.updateOne({ mobileNumber }, { updatedAt: currentDate })
            console.log(res)
            return res
        }
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

exports.createUser = async (mobileNumber, dateOfBirth, name, email) => {
    try {
        let otp = await otpMobileModel.find({ mobileNumber })
        if (otp.length === 0) {
            return "No otp found for this mobile Number"
        }
        let currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30);
        let otpDate = otp[0].updatedAt;
        const timeDifferenceInMinutes = Math.abs((currentDate - otpDate) / (1000 * 60));
        console.log(timeDifferenceInMinutes)
        if ((timeDifferenceInMinutes) > 1) {
            return {error: "The otp has expired"}
        }
        let existinguser = await userModel.find({ mobileNumber })
        if (existinguser.length !== 0) {
            return {error: "Mobile number already exists in the system"}
        }
        let user = await userModel.create({ mobileNumber, dateOfBirth, name, email })
        let _id = user._id
        _id = _id.toHexString()
        var cipher = crypto.createCipher(algorithm, key);
        var encrypted = cipher.update(_id, 'utf8', 'hex') + cipher.final('hex');
        await userModel.updateOne({_id:user._id}, {userId:encrypted})
        return {success: true, userId: encrypted}
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

exports.getUser = async(userId) => {
    try{
        let user = await userModel.find({userId});
        return user;
    }
    catch(error){
        throw new Error(error)
    }
}