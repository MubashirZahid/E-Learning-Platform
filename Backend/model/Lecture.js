const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  teacherID: {
    type: mongoose.Types.ObjectId,
    ref: "teachers",
    required: true,
  },
  //   sectionID: {
  //     type: mongoose.Types.ObjectId,
  //     ref: "sections",
  //     required: true
  //   },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const Lecture = mongoose.model("lectures", lectureSchema);

module.exports = Lecture;
