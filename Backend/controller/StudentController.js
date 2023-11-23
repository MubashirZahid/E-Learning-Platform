const Student = require("../model/Student");
const Auth = require("../model/Auth");
const { success, failure } = require("../utils/common");
const HTTP_STATUS = require("../constants/statusCodes");
const path = require("path");

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await Student.find();

      return res
        .status(HTTP_STATUS.OK)
        .json(success("All students retrived successfully", students));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("An error occurred while fetching students", error));
    }
  }

  async getOneById(req, res) {
    const { id } = req.params; // Extract the student ID from the URL parameter

    try {
      const student = await Student.findById(id);

      if (!student) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Student not found"));
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success(`Student with ID ${id} retrieved successfully`, student));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("An error occurred while fetching the student", error));
    }
  }

  async deleteById(req, res) {
    const { id } = req.params; // Extract the student ID from the URL parameter

    try {
      const deletedStudent = await Student.findByIdAndDelete(id);

      if (!deletedStudent) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Student not found or already deleted"));
      }

      // Deleting in the Auth database
      let email = deletedStudent.email;
      await Auth.deleteOne({ email });

      return res
        .status(HTTP_STATUS.OK)
        .json(success(`Successfully Deleted`, deletedStudent));
    } catch (error) {
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("An error occurred while deleting the student", error));
    }
  }

  async updateById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findById({ _id: id });
      if (!student) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("There is no student exist with the given ID"));
      }

      const updatedFields = {};

      if (req.body.name) {
        updatedFields.name = req.body.name;
      }
      if (req.body.phone) {
        updatedFields.phone = req.body.phone;
      }
      if (req.body.country) {
        updatedFields.country = req.body.country;
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
      );

      const { email } = student;

      const updatedAuth = await Auth.findOneAndUpdate(
        { email },
        { $set: updatedFields },
        { new: true }
      );

      if (updatedStudent && updatedAuth) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully updated the student data", updatedStudent)
          );
      }
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Failed to update the student data"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

module.exports = new StudentController();
