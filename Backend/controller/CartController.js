const Cart = require("../model/Cart");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");
const StudentModel = require("../model/Student");
const Course = require("../model/Course");

class CartController {
  async addToCart(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if both studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("Both studentId and courseId are required"));
      }

      // Check if the student exists
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Student not found"));
      }

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Course not found"));
      }

      // Create or update the cart for the student
      let cart = await Cart.findOne({ studentId: studentId });

      if (!cart) {
        // If the cart doesn't exist for the student, create a new cart
        cart = new Cart({
          studentId: studentId,
          courses: [courseId],
        });
        await cart.save();
      } else {
        // If the cart already exists for the student, add the course to the cart
        if (!cart.courses.includes(courseId)) {
          cart.courses.push(courseId);
          await cart.save();
        }
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Course added to cart successfully", cart));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to add course to cart"));
    }
  }

  async removeFromCart(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if both studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("Both studentId and courseId are required"));
      }

      // Check if the student exists
      const student = await StudentModel.findById(studentId);
      if (!student) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Student not found"));
      }

      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Course not found"));
      }

      // Find the cart for the student
      let cart = await Cart.findOne({ studentId: studentId });

      if (!cart) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Cart not found for the student"));
      }

      // Check if the course is in the cart and remove it
      if (cart.courses.includes(courseId)) {
        cart.courses = cart.courses.filter((c) => c.toString() !== courseId); // Remove the course from the courses array
        await cart.save();
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send(failure("Course not found in the cart"));
      }

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Course removed from cart successfully", cart));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to remove course from cart"));
    }
  }
}

module.exports = new CartController();
