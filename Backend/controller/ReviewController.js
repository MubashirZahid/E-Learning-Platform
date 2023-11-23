const Review = require("../model/Review");
const Subscription = require("../model/Subscription");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");

class ReviewController {
  async addToReview(req, res) {
    try {
      const { studentId, courseId, rating, review } = req.body;

      // Check if all required fields are provided
      if (!studentId || !courseId || !rating || !review) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            failure("StudentId, courseId, rating, and review are required")
          );
      }

      // Check if the subscription exists for the student
      const subscription = await Subscription.findOne({
        studentId: studentId,
        courses: courseId,
      });

      if (!subscription) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Student is not subscribed to this course"));
      }

      // Create a new review
      const newReview = new Review({
        studentId: studentId,
        course: courseId,
        rating: rating,
        review: review,
      });

      // Save the new review
      const savedReview = await newReview.save();

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Review added successfully", savedReview));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to add review"));
    }
  }

  async updateReview(req, res) {
    try {
      const { studentId, courseId, rating, review } = req.body;

      // Check if studentId, courseId, rating, and review are provided
      if (!studentId || !courseId || !rating || !review) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(
            failure("StudentId, courseId, rating, and review are required")
          );
      }

      // Check if the subscription exists for the student
      const subscription = await Subscription.findOne({
        studentId: studentId,
        courses: courseId,
      });

      if (!subscription) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Student is not subscribed to this course"));
      }

      // Find the existing review for the specified course by the student
      let existingReview = await Review.findOne({
        studentId: studentId,
        course: courseId,
      });

      if (!existingReview) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Review not found for this course by the student"));
      }

      // Update only the rating and review fields of the existing review
      existingReview.rating = rating;
      existingReview.review = review;
      await existingReview.save();

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Review updated successfully", existingReview));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to update review"));
    }
  }

  async removeReview(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("StudentId and courseId are required"));
      }

      // Check if the subscription exists for the student
      const subscription = await Subscription.findOne({
        studentId: studentId,
        courses: courseId,
      });

      if (!subscription) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Student is not subscribed to this course"));
      }

      // Remove the review for the specified course by the student
      const deletedReview = await Review.findOneAndDelete({
        studentId: studentId,
        course: courseId,
      });

      if (!deletedReview) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Review not found for this course by the student"));
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Review removed successfully", deletedReview));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to remove review"));
    }
  }
}

module.exports = new ReviewController();
