const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpMobileSchema = new Schema({
    mobileNumber:{
        type: String,
        default: null
    },
    createdAt:{
        type: Date,
        default: null,
    },
    updatedAt:{
        type: Date,
        default: null,
    }
});

module.exports = mongoose.model("otp", otpMobileSchema);