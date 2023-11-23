const Question = require("../model/Question");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");

class QuestionController {
  async addQuestion(req, res) {
    try {
      const { questionText, options, correctOption, teacherID, quizID, marks } =
        req.body;

      // Creating a new question instance
      const newQuestion = await Question.create({
        questionText,
        options,
        correctOption,
        teacherID,
        quizID,
        marks,
      });

      // Save the question to the database
      await newQuestion.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json(success("Question added successfully", newQuestion));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Internal Server Error", error.message));
    }
  }

  async deleteQuestion(req, res) {
    try {
      const questionId = req.params.questionId;

      // Check if the question exists and Delete it and return it
      const deletedQuestion = await Question.findByIdAndDelete(questionId);

      if (!deletedQuestion) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Question not found"));
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Question deleted successfully", deletedQuestion));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Internal Server Error", error.message));
    }
  }

  async updateQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const question = await Question.findById({ _id: questionId });
      if (!question) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("There is no qiustion exist with the given ID"));
      }

      const updatedFields = {};

      if (req.body.questionText) {
        updatedFields.questionText = req.body.questionText;
      }
      if (req.body.options) {
        updatedFields.options = req.body.options;
      }
      if (req.body.correctOption) {
        updatedFields.correctOption = req.body.correctOption;
      }
      if (req.body.marks) {
        updatedFields.marks = req.body.marks;
      }

      const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { $set: updatedFields },
        { new: true }
      );

      if (updatedQuestion) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully updated the question data", updatedQuestion)
          );
      }
      return res
        .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
        .send(failure("Failed to update the question data"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }
}

module.exports = new QuestionController();
