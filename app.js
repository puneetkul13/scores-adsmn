const express = require("express");
const app = express();
app.use(express.json());

app.listen(3001, async () => {
  console.log("Server is running on port 3001");
});

const mongoose = require("mongoose");
//configure mongoose
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/scores",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);
const scoreRoutes = require("./routes/scoreRoutes");
app.use("/api/scores", scoreRoutes);

module.exports = app;