const bcrypt = require("bcrypt");
const AuthModel = require("../model/Auth");
const AdminModel = require("../model/Admin");
const StudentModel = require("../model/Student");
const TeacherModel = require("../model/Teacher");
const { validationResult } = require("express-validator");
const { success, failure } = require("../utils/common");
const HTTP_STATUS = require("../constants/statusCodes");
const jasonwebtoken = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const transporter = require("../config/mail");
const { promisify } = require("util");
const ejsRenderFile = promisify(ejs.renderFile);
const crypto = require("crypto");
// const { sendResponse } = require("../util/common");

class AuthController {
  async signUp(req, res) {
    try {
      // Check for validation errors
      const validation = validationResult(req).array();
      console.log(validation);
      if (validation.length > 0) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Failed to add user", validation));
      }

      // Extract email and password from request body
      const { name, email, password, phone, country, role } = req.body;

      // Check if the email is already registered
      const existingUser = await AuthModel.findOne({ email });
      if (existingUser) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .send(failure("Email already registered"));
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create and save a new Auth document with email and hashed password
      let result;

      if (role == 1) {
        // Create a new User document and save it in the users collection
        const newAdmin = await AdminModel.create({
          name: name,
          email: email,
          phone: phone,
          country: country,
        });

        result = await AuthModel.create({
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
          country: country,
          role: role,
          adminId: newAdmin._id,
        });
      }
      if (role == 2) {
        // Create a new User document and save it in the users collection
        const newStudent = await StudentModel.create({
          name: name,
          email: email,
          phone: phone,
          country: country,
        });

        result = await AuthModel.create({
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
          country: country,
          role: role,
          studentId: newStudent._id,
        });
      }
      if (role == 3) {
        // Create a new User document and save it in the users collection
        const newTeacher = await TeacherModel.create({
          name: name,
          email: email,
          phone: phone,
          country: country,
        });

        result = await AuthModel.create({
          name: name,
          email: email,
          password: hashedPassword,
          phone: phone,
          country: country,
          role: role,
          teacherId: newTeacher._id,
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      result.emailToken = resetToken;
      result.emailTokenExpire = Date.now() + 60 * 60 * 1000;

      await result.save();

      const verifyEmail = path.join(
        process.env.FRONTEND_URL,
        "verify-email",
        resetToken,
        result._id.toString()
      );
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "email-verification.ejs"),
        {
          name: result.name,
          verifyEmail: verifyEmail,
        }
      );

      const result2 = await transporter.sendMail({
        from: "zahid-app.com",
        to: `${name} ${email}`,
        subject: "Email Verification",
        html: htmlBody,
      });

      if (result2.messageId) {
        return res
          .status(HTTP_STATUS.OK)
          .send(
            success("Successfully requesting for email verification", result)
          );
      }

      return res
        .status(HTTP_STATUS.CREATED)
        .send(success("User registered successfully", result));
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Internal server error"));
    }
  }

  async verifyUser(req, res) {
    try {
      const { token, userId } = req.body;

      const auth = await AuthModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(HTTP_STATUS.OK).send(failure("No User Found"));
      }

      if (auth.emailTokenExpire < Date.now()) {
        return res.status(HTTP_STATUS.GONE).send(failure("Expire time"));
      }

      if (auth.emailToken !== token) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("Invalid Token"));
      }

      const result = await AuthModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          verified: true,
          emailToken: null,
          emailTokenExpire: null,
        }
      );

      const result2 = await StudentModel.findOneAndUpdate(
        { email: result.email },
        {
          verified: true,
        }
      );
      const result3 = await TeacherModel.findOneAndUpdate(
        { email: result.email },
        {
          verified: true,
        }
      );

      if (result.isModified) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully verified the user"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Something went wrong"));
    }
    // return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
  }

  async logIn(req, res) {
    const validation = validationResult(req).array();
    if (validation.length > 0) {
      return res
        .status(HTTP_STATUS.OK)
        .send(failure("Failed to log in", validation));
    }
    const { email, password } = req.body;
    console.log(email, password);

    const auth = await AuthModel.findOne({ email: email });

    if (!auth) {
      return res.status(HTTP_STATUS.OK).send(failure("User is not registerd"));
    }
    console.log("email   =====   ");
    const checkPassword = await bcrypt.compare(password, auth.password);

    if (!checkPassword) {
      return res.status(HTTP_STATUS.OK).send(failure("Invalid Credentials"));
    }

    if (auth.verified) {
      const responseAuth = auth.toObject();
      delete responseAuth.password;
      delete responseAuth._id;

      responseAuth.id = auth._id;

      const jwt = jasonwebtoken.sign(responseAuth, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      responseAuth.token = jwt;

      console.log("email  ----  ");

      return res
        .status(HTTP_STATUS.OK)
        .send(success("Successfully Logged in", responseAuth));
    }

    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send(success("Failed to Logged in"));
  }

  async sendForgotPasswordEmail(req, res) {
    try {
      const { recipient } = req.body;
      if (!recipient || recipient === "") {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Recipient email is not provided"));
      }

      const auth = await AuthModel.findOne({ email: recipient });

      if (!auth) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("User is not registerd"));
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      auth.resetPasswordToken = resetToken;
      auth.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
      auth.resetPassword = true;

      await auth.save();

      const resetURL = path.join(
        process.env.FRONTEND_URL,
        "reset-password",
        resetToken,
        auth._id.toString()
      );
      const htmlBody = await ejsRenderFile(
        path.join(__dirname, "..", "views", "forgot-password.ejs"),
        {
          name: auth.name,
          resetURL: resetURL,
        }
      );

      const result = await transporter.sendMail({
        from: "zahid-app.com",
        to: `${auth.name} ${recipient}`,
        subject: "Forgot Password?",
        html: htmlBody,
      });

      if (result.messageId) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully requesting for resetting password"));
      }
      return res.status(HTTP_STATUS.OK).send(failure("Something went wrong"));
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Something went wrong"));
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, userId, newPassword, confirmPassword } = req.body;

      const auth = await AuthModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!auth) {
        return res.status(HTTP_STATUS.OK).send(failure("No User Found"));
      }

      if (auth.resetPasswordExpire < Date.now()) {
        return res.status(HTTP_STATUS.GONE).send(failure("Expire time"));
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send(failure("Invalid Token"));
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(HTTP_STATUS.OK)
          .send(failure("Password do not match"));
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
        return hash;
      });

      const result = await AuthModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          password: hashedPassword,
          resetPassword: false,
          resetPasswordExpire: null,
          resetPasswordToken: null,
        }
      );

      if (result.isModified) {
        return res
          .status(HTTP_STATUS.OK)
          .send(success("Successfully updated the password"));
      }
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(failure("Something went wrong"));
    }
    // return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
  }

  // async sendEmailVerification(req, res) {
  //   try {
  //     const { recipient } = req.body;
  //     if (!recipient || recipient === "") {
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(failure("Recipient email is not provided"));
  //     }

  //     const auth = await AuthModel.findOne({ email: recipient });

  //     if (!auth) {
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(failure("User is not registerd"));
  //     }

  //     const resetToken = crypto.randomBytes(32).toString("hex");
  //     auth.emailToken = resetToken;
  //     auth.emailTokenExpire = Date.now() + 60 * 60 * 1000;

  //     await auth.save();

  //     const resetURL = path.join(
  //       process.env.FRONTEND_URL,
  //       "reset-password",
  //       emailToken,
  //       auth._id.toString()
  //     );
  //     const htmlBody = await ejsRenderFile(
  //       path.join(__dirname, "..", "views", "forgot-password.ejs"),
  //       {
  //         name: auth.name,
  //         resetURL: resetURL,
  //       }
  //     );

  //     const result = await transporter.sendMail({
  //       from: "zahid-app.com",
  //       to: `${auth.name} ${recipient}`,
  //       subject: "Forgot Password?",
  //       html: htmlBody,
  //     });

  //     if (result.messageId) {
  //       return res
  //         .status(HTTP_STATUS.OK)
  //         .send(success("Successfully requesting for resetting password"));
  //     }
  //     return res.status(HTTP_STATUS.OK).send(failure("Something went wrong"));
  //   } catch (error) {
  //     console.log(error);
  //     return res
  //       .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
  //       .send(failure("Something went wrong"));
  //   }
  // }
}

module.exports = new AuthController();
