const Wishlist = require("../model/Wishlist");
const Course = require("../model/Course");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");

class WishlistController {
  async addToWishlist(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("StudentId and courseId are required"));
      }

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Course not found"));
      }

      // Check if the wishlist exists for the student
      let wishlist = await Wishlist.findOne({ studentId: studentId });

      if (!wishlist) {
        // If the wishlist doesn't exist for the student, create a new wishlist
        wishlist = new Wishlist({
          studentId: studentId,
          courses: [courseId],
        });
        await wishlist.save();
      } else {
        // If the wishlist already exists for the student, add the course to the wishlist
        if (!wishlist.courses.includes(courseId)) {
          wishlist.courses.push(courseId);
          await wishlist.save();
        }
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Course added to wishlist successfully"));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to add course to wishlist"));
    }
  }

  async removeFromWishlist(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("StudentId and courseId are required"));
      }

      // Check if the wishlist exists for the student
      const wishlist = await Wishlist.findOne({ studentId: studentId });

      if (!wishlist) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Wishlist not found for this student"));
      }

      // Remove the course from the wishlist
      const index = wishlist.courses.indexOf(courseId);
      if (index !== -1) {
        wishlist.courses.splice(index, 1);
        await wishlist.save();
        return res
          .status(HTTP_STATUS.OK)
          .json(success("Course removed from wishlist successfully"));
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Course not found in the wishlist"));
      }
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to remove course from wishlist"));
    }
  }
}

module.exports = new WishlistController();
