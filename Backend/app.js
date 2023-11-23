const express = require("express");
const app = express();
const cors = require("cors");
// const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const AuthRouter = require("./routes/AuthRouter");
const StudentRouter = require("./routes/StudentRouter");
const TeacherRouter = require("./routes/TeacherRouter");
const CourseRouter = require("./routes/CourseRouter");
const QuestionRouter = require("./routes/QuestionRouter");
const QuizRouter = require("./routes/QuizRouter");
const CartRouter = require("./routes/CartRouter");
const SubscriptionRouter = require("./routes/SubscriptionRouter");
const ReviewRouter = require("./routes/ReviewRouter");
const WishlistRouter = require("./routes/WishlistRouter");
const LectureRouter = require("./routes/LectureRouter");

const databaseConnection = require("./config/database");
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRouter);
app.use("/student", StudentRouter);
app.use("/teacher", TeacherRouter);
app.use("/course", CourseRouter);
app.use("/question", QuestionRouter);
app.use("/quiz", QuizRouter);
app.use("/cart", CartRouter);
app.use("/subscription", SubscriptionRouter);
app.use("/review", ReviewRouter);
app.use("/wishlist", WishlistRouter);
app.use("/lecture", LectureRouter);

app.use((req, res) => {
  return res.status(400).send({ message: "Invalid Request" });
});

databaseConnection(() => {
  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
});
