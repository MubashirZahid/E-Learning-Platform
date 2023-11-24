const Assignment = require("../model/Assignment");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");

class AssignmentController {
  async createAssignment(req, res) {
    try {
      const { title, description, dueDate, totalMark, teacherID } = req.body;

      // Create a new assignment using the Assignment model
      const newAssignment = new Assignment({
        title,
        description,
        dueDate,
        totalMark,
        teacherID,
      });

      // Save the new assignment to the database
      const savedAssignment = await newAssignment.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json(success("Assignment created successfully", savedAssignment));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to create assignment"));
    }
  }

  async deleteAssignment(req, res) {
    try {
      const assignmentId = req.params.assignmentId;

      // Check if assignmentId is provided
      if (!assignmentId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("AssignmentId is required"));
      }

      // Find the assignment by ID and remove it
      const deletedAssignment = await Assignment.findByIdAndDelete(
        assignmentId
      );

      if (!deletedAssignment) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Assignment not found"));
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Assignment deleted successfully", deletedAssignment));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to delete assignment"));
    }
  }
}

module.exports = new AssignmentController();
