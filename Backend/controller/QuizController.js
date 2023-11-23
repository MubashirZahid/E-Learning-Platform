const Quiz = require("../model/Quiz"); // Adjust the path based on your file structure
const HTTP_STATUS = require("../constants/statusCodes"); // Adjust the path based on your file structure
const { success, failure } = require("../utils/common"); // Adjust the path based on your file structure

class QuizController {
  async addQuiz(req, res) {
    try {
      const { title, startTime, endTime, totalMark, teacherID, questions } =
        req.body;

      // Create a new quiz instance
      const newQuiz = await Quiz.create({
        title,
        startTime,
        endTime,
        totalMark,
        teacherID,
        questions,
      });

      // Save the quiz to the database
      await newQuiz.save();

      res
        .status(HTTP_STATUS.CREATED)
        .json(success("Quiz added successfully", newQuiz));
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Internal Server Error", error.message));
    }
  }
  async deleteQuiz(req, res) {
    try {
      const quizId = req.params.quizId;

      // Check if the quiz exists
      const existingQuiz = await Quiz.findById(quizId);

      if (!existingQuiz) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Quiz not found"));
      }

      // Delete the quiz

      const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Quiz deleted successfully", deletedQuiz));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Internal Server Error", error.message));
    }
  }
  async updateQuestion(req, res) {
    try {
      const { quizId } = req.params;
      const quiz = await Quiz.findById({ _id: quizId });
      if (!quiz) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("There is no quiz exist with the given ID"));
      }

      const updatedFields = {};

      if (req.body.title) {
        updatedFields.title = req.body.title;
      }
      if (req.body.startTime) {
        updatedFields.startTime = req.body.startTime;
      }
      if (req.body.endTime) {
        updatedFields.endTime = req.body.endTime;
      }
      if (req.body.totalMark) {
        updatedFields.totalMark = req.body.totalMark;
      }
      if (req.body.questions) {
        updatedFields.questions = req.body.questions;
      }

      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { $set: updatedFields },
        { new: true }
      );

      if (updatedQuiz) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully updated the question data", updatedQuiz));
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

module.exports = new QuizController();
