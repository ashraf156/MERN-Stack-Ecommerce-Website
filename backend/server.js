require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

//connect to database
const connectDB = require("./config/db");
connectDB();

//Routers
app.use("/api/users", require("./routers/userRouter"));
app.use("/api/category", require("./routers/categoryRouter"));
app.use("/api/product", require("./routers/productRouter"));
app.use("/api/upload", require("./routers/uploadRouter"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
