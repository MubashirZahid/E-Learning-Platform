// const { validationResult } = require("express-validator");
const { success, failure } = require("../utils/common");
const TeacherModel = require("../model/Teacher");
const AuthModel = require("../model/Auth");
const HTTP_STATUS = require("../constants/statusCodes");

class TeacherController {
  async getAll(req, res) {
    try {
      const { page, limit, search } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      if (page && isNaN(pageNum)) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page must be a valid number"));
      }
      if (limit && isNaN(limitNum)) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Limit must be a valid number"));
      }

      if (pageNum < 1 || pageNum > 100) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Page must be between 1 and 100"));
      }

      if (limitNum < 1 || limitNum > 20) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Limit must be between 1 and 20"));
      }

      const pageNum_default = pageNum || 1;
      const limitNum_default = limitNum || 5;
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search } },
          { country: { $regex: search, $options: "i" } },
        ];
      }
      const allTeachers = await TeacherModel.find({});

      if (allTeachers.length <= 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(success("No teacher was found"));
      }
      const teachers = await TeacherModel.find(query, {})
        .skip((pageNum_default - 1) * limitNum_default)
        .limit(limitNum_default);
      if (teachers.length > 0) {
        return res.status(HTTP_STATUS.OK).send(
          success("Successfully received all teachers data", {
            Page: pageNum_default,
            Limit: limitNum_default,
            result: teachers,
            total: teachers.length,
          })
        );
      }
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("No teacher was found"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async getOneByID(req, res) {
    try {
      const { id } = req.params;
      const teacher = await TeacherModel.findById(id);

      if (teacher) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully received teacher data", { result: teacher })
          );
      }
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .send(failure("No teacher was found"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async updateByID(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
          .send(failure("Failed to update the teacher data", validation));
      }

      const { id } = req.params;
      const teacher = await TeacherModel.findById({ _id: id });
      if (!teacher) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Teacher not found for the given ID"));
      }

      const { name, phone, country } = req.body;

      const updatedTeacher = await TeacherModel.findByIdAndUpdate(
        id,
        { name, phone, country },
        { new: true }
      );

      if (updatedTeacher) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully updated the teacher data", updatedTeacher)
          );
      }
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to update the teacher data"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async partialUpdateByID(req, res) {
    try {
      //   const validation = validationResult(req).array();
      //   if (validation.length > 0) {
      //     return res
      //       .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      //       .send(failure("Failed to update the teacher data", validation));
      //   }

      const { id } = req.params;
      const teacher = await TeacherModel.findById({ _id: id });
      if (!teacher) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Teacher not found for the given ID"));
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

      const updatedTeacher = await TeacherModel.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
      );

      const { email } = teacher;

      const updatedAuth = await AuthModel.findOneAndUpdate(
        { email },
        { $set: updatedFields },
        { new: true }
      );

      if (updatedTeacher && updatedAuth) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully updated the teacher data", updatedTeacher)
          );
      }

      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to update the teacher data"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async deleteOneById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await TeacherModel.findById({ _id: id });
      const authTeacher = await AuthModel.findOne({ teacherId: id });

      if (!teacher) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Teacher does not exist with the given ID"));
      }
      if (!authTeacher) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Teacher does not exist with the given ID"));
      }

      const deletedTeacher = await TeacherModel.findByIdAndDelete({ _id: id });
      const deletedAuthTeacher = await AuthModel.findOneAndDelete({
        teacherId: id,
      });
      if (deletedTeacher && deletedAuthTeacher) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully deleted the teacher data"));
      }
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(failure("Failed to delete the teacher data"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

module.exports = new TeacherController();
