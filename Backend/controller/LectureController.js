const Lecture = require("../model/Lecture");
const { success, failure } = require("../utils/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { uploadFileAws, deleteFileAws } = require("../utils/awsMethod");

class LectureController {
  async createLecture(req, res) {
    try {
      const { teacherID, title } = req.body;

      //   let imageUploadUrl = await uploadFileAws(req.imageFile, "images/lecture");
      let videoUploadUrl = await uploadFileAws(req.file, "videos/lecture");

      const newLecture = new Lecture({
        teacherID,
        // sectionID,
        title,
        // imageUrl: imageUploadUrl,
        videoUrl: videoUploadUrl,
      });

      const savedLecture = await newLecture.save();

      res
        .status(HTTP_STATUS.CREATED)
        .json(success("Lecture created successfully", savedLecture));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to create lecture", error));
    }
  }

  async deleteLecture(req, res) {
    try {
      const lectureId = req.params.lectureId;

      // Fetch the lecture by ID from the database
      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Lecture not found"));
      }

      // Delete the file from S3 (assuming the file URL is stored in videoUrl field of the Lecture model)
      if (lecture.videoUrl) {
        await deleteFileAws(lecture.videoUrl); // Delete the video file from S3 bucket
      }

      // Delete the course from the database
      await Lecture.findByIdAndDelete(lectureId);

      res.status(HTTP_STATUS.OK).json(success("Lecture deleted successfully"));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to delete Lecture", error));
    }
  }
}

module.exports = new LectureController();
