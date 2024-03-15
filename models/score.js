const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    userId: {
        type: String,
    },
    score:  {
        type: Number,
    },
    createdAt:{
        type:Date
    }

});

module.exports = mongoose.model("scores", scoreSchema);