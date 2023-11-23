const Cart = require("../model/Cart");
const Subscription = require("../model/Subscription");
const HTTP_STATUS = require("../constants/statusCodes");
const { success, failure } = require("../utils/common");
const AuthModel = require("../model/Auth");
const { default: mongoose } = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const transporter = require("../config/mail");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);

class SubscriptionController {
  async requestToSubscribe(req, res) {
    try {
      let result = await AuthModel.find({ role: 1 });
      console.log(result);

      const subscribeCourse = path.join(
        process.env.FRONTEND_URL,
        "subscribe-course"

        // result._id.toString()
      );
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "course-subscription.ejs"),
        {
          name: result[0].name,
          subscribeCourse: subscribeCourse,
        }
      );

      let name = result[0].name;
      let email = result[0].email;

      const result2 = await transporter.sendMail({
        from: "zahid-app.com",
        to: `${name} ${email}`,
        subject: "Request To Subscribe Course",
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
        .send(failure("Something went wrong during the subscription request"));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async addToSubscription(req, res) {
    try {
      const { studentId } = req.body;

      // Check if studentId is provided
      if (!studentId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("StudentId is required"));
      }

      // Find the cart for the student
      const cart = await Cart.findOne({ studentId: studentId });

      if (!cart || cart.courses.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Cart not found or empty for the student"));
      }

      // Create or update the subscription for the student
      let subscription = await Subscription.findOne({ studentId: studentId });

      if (!subscription) {
        // If the subscription doesn't exist for the student, create a new subscription
        subscription = new Subscription({
          studentId: studentId,
          courses: cart.courses,
        });
        await subscription.save();
      } else {
        // If the subscription already exists for the student, merge courses from cart
        subscription.courses = [
          ...new Set([...subscription.courses, ...cart.courses]),
        ]; // Merge courses and remove duplicates
        await subscription.save();
      }

      // Remove the cart from the Cart collection after adding it to the Subscription collection
      await Cart.findOneAndDelete({ studentId: studentId });

      return res
        .status(HTTP_STATUS.OK)
        .json(success("Cart added to subscription successfully", subscription));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to add cart to subscription"));
    }
  }

  async removeFromSubscription(req, res) {
    try {
      const { studentId, courseId } = req.body;

      // Check if both studentId and courseId are provided
      if (!studentId || !courseId) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json(failure("Both studentId and courseId are required"));
      }

      // Check if the subscription exists for the student
      const subscription = await Subscription.findOne({ studentId: studentId });

      if (!subscription || subscription.courses.length === 0) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Subscription not found or empty for the student"));
      }

      // Check if the courseId exists in the subscription's courses
      const courseIndex = subscription.courses.findIndex(
        (course) => course.toString() === courseId
      );

      if (courseIndex === -1) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(failure("Course not found in the subscription"));
      }

      // Remove the specified courseId from the subscription's courses
      subscription.courses = subscription.courses.filter(
        (course) => course.toString() !== courseId
      );
      await subscription.save();

      return res
        .status(HTTP_STATUS.OK)
        .json(
          success("Course removed from subscription successfully", subscription)
        );
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(failure("Failed to remove course from subscription"));
    }
  }
}

module.exports = new SubscriptionController();
