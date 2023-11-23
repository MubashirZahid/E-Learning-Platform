const mongoose = require("mongoose");
const sectionSchema = new mongoose.Schema({
  teacherID: {
    type: mongoose.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  courseID: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  lectures: [
    {
      type: mongoose.Types.ObjectId,
      ref: "lectures",
    },
  ],
  // contents: [
  //   {
  //     type: mongoose.Types.ObjectId,
  //     ref: "contents",
  //   },
  // ],
  quizzes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
    },
  ],

  assignments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "assignments",
    },
  ],
  review: {
    type: mongoose.Types.ObjectId,
    ref: "Review",
    required: true,
  },
});

const Section = mongoose.model("sections", sectionSchema);

module.exports = Section;
