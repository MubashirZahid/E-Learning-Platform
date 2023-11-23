const Course = require("../model/Course");
const { success, failure } = require("../utils/common");
const HTTP_STATUS = require("../constants/statusCodes");
const { uploadFileAws, deleteFileAws } = require("../utils/awsMethod");
const AuthModel = require("../model/Auth");
const path = require("path");
const ejs = require("ejs");
const transporter = require("../config/mail");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const { default: mongoose } = require("mongoose");

class CourseController {
  async getAllCourses(req, res) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      if (isNaN(pageNum) || isNaN(limitNum)) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .json(failure("Page and Limit must be valid numbers"));
      }

      const skipValue = (pageNum - 1) * limitNum;

      // Fetch courses with pagination from the database
      const courses = await Course.find()
        .populate("teacherID", "name email")
        .populate("enrolledStudents", "name email")
        .skip(skipValue)
        .limit(limitNum);

      // const totalCourses = await Course.countDocuments();

      res.status(HTTP_STATUS.OK).json({
        message: "Courses retrieved successfully",
        currentPage: pageNum,
        totalPages: Math.ceil(courses.length / limitNum),
        totalCourses: courses.length,
        courses: courses,
      });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to fetch courses", error));
    }
  }

  // Function to create a new course
  async createCourse(req, res) {
    try {
      // Create a new course object using the Course model
      const {
        teacherID,
        enrolledStudents,
        title,
        description,

        //   sections,
        isPublic,
        status,
      } = req.body;

      //   console.log(req.body);

      let url = await uploadFileAws(req.file, "images/course");

      //   console.log(req.body);
      const newCourse = new Course({
        teacherID,
        enrolledStudents,
        title,
        description,
        imageUrl: url,
        // sections,
        isPublic,
        status,
      });

      // Save the new course to the database
      const savedCourse = await newCourse.save();

      res
        .status(HTTP_STATUS.CREATED)
        .json(success("Course created successfully", savedCourse)); // Sending success response with HTTP status code 201 (Created)
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to create course", error)); // Sending failure response with HTTP status code 500 (Internal Server Error)
    }
  }

  async partialUpdateById(req, res) {
    try {
      const courseId = req.params.courseId;

      const updatedFields = {};

      // Fetch the course by ID from the database
      let course = await Course.findById(courseId);

      if (!course) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Course not found"));
      }

      // Check if there is an updated image file to upload
      if (req.file) {
        // Delete the existing file from S3 if it exists
        if (course.imageUrl) {
          await deleteFileAws(course.imageUrl);
        }

        // Upload the updated file to S3 and get the new URL
        let url = await uploadFileAws(req.file, "images/course");
        updatedFields.imageUrl = url; // Update imageUrl in the updateData object
      }

      if (req.body.title) {
        updatedFields.title = req.body.title;
      }
      if (req.body.description) {
        updatedFields.description = req.body.description;
      }

      //  Perform the partial update of the course in the database
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: updatedFields },
        { new: true }
      );

      // Perform the partial update of the course in the database
      //   course = await Course.findByIdAndUpdate(courseId, updateData, {
      //     new: true,
      //   });

      res
        .status(HTTP_STATUS.OK)
        .json(success("Course updated successfully", updatedCourse));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to update course", error));
    }
  }

  async deleteCourse(req, res) {
    try {
      const courseId = req.params.courseId;

      // Fetch the course by ID from the database
      const course = await Course.findById(courseId);

      if (!course) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Course not found"));
      }

      // Delete the file from S3 (assuming the file URL is stored in imageUrl field of the Course model)
      if (course.imageUrl) {
        await deleteFileAws(course.imageUrl); // Delete the file from S3 bucket
      }

      // Delete the course from the database
      await Course.findByIdAndDelete(courseId);

      res.status(HTTP_STATUS.OK).json(success("Course deleted successfully"));
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to delete course", error));
    }
  }

  async requestToPublish(req, res) {
    try {
      const { courseID } = req.body;
      // const course = await Course.find({ _id: courseID }, { title: 1, _id: 0 });
      const course = await Course.find({ _id: courseID });
      console.log(course[0].title);

      let result = await AuthModel.find({ role: 1 });
      // console.log(result);

      const verifyCourse = path.join(
        process.env.FRONTEND_URL,
        "verify-course"

        // result._id.toString()
      );
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "course-verification.ejs"),
        {
          name: result[0].name,
          course: course[0].title,
          verifyCourse: verifyCourse,
        }
      );

      let name = result[0].name;
      let email = result[0].email;

      const result2 = await transporter.sendMail({
        from: "zahid-app.com",
        to: `${name} ${email}`,
        subject: "Request To Publish Course",
        html: htmlBody,
      });

      if (result2.messageId) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully requesting for course subscription", result)
          );
      }

      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Something went wrong during course request"));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async acceptCourse(req, res) {
    try {
      const { teacherID, courseID } = req.body;

      const course = await Course.findOne({
        _id: new mongoose.Types.ObjectId(courseID),
      });
      if (!course) {
        return res.status(HTTP_STATUS.OK).send(failure("No Course Found"));
      }

      const result = await Course.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(courseID) },
        {
          isPublic: true,
          status: "approved",
        }
      );

      if (result.isModified) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully published the course"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal Server Error"));
    }
  }
}

module.exports = new CourseController();
