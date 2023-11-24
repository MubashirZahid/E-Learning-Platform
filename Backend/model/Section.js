const mongoose = require("mongoose");
const sectionSchema = new mongoose.Schema({
  teacherID: {
    type: mongoose.Types.ObjectId,
    ref: "teachers",
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
      ref: "Quiz",
    },
  ],

  assignments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Section = mongoose.model("sections", sectionSchema);

module.exports = Section;
