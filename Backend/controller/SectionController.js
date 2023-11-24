const Section = require("../model/Section");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");

class SectionController {
  async createSection(req, res) {
    try {
      const {
        teacherID,
        courseID,
        title,
        lectures,
        quizzes,
        assignments,
        reviews,
        // other fields here
      } = req.body;

      // Create a new section using the Section model
      const newSection = new Section({
        teacherID,
        courseID,
        title,
        lectures,
        quizzes,
        assignments,
        reviews,
        // other fields here
      });

      // Save the new section to the database
      const savedSection = await newSection.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json(success("Section created successfully", savedSection));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to create section"));
    }
  }

  async updateSection(req, res) {
    try {
      const sectionId = req.params.sectionId;

      // Find the section by ID in the database
      let section = await Section.findById(sectionId);

      if (!section) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Section not found"));
      }

      // Update the section fields based on request body
      section = await Section.findByIdAndUpdate(
        sectionId,
        { $set: req.body },
        { new: true }
      );

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Section updated successfully", section));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to update section"));
    }
  }
}

module.exports = new SectionController();
