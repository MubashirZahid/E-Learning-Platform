const { body } = require("express-validator");

const authValidator = {
  logIn: [
    body("email")
      .exists()
      .withMessage("Please provide your Email ID.")
      .bail()
      .notEmpty()
      .withMessage("Email must not be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Please provide a valid Email ID"),

    body("password")
      .exists()
      .withMessage("Please provide your password")
      .bail()
      .notEmpty()
      .withMessage("Password must not be empty")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail(),
  ],

  signUp: [
    body("name")
      .exists()
      .withMessage("Please provide your name")
      .bail()
      .notEmpty()
      .withMessage("Name must not be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .bail(),
    body("email")
      .exists()
      .withMessage("Please provide your Email ID.")
      .bail()
      .notEmpty()
      .withMessage("Email must not be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Please provide a valid Email ID"),

    body("password")
      .exists()
      .withMessage("Please provide your password")
      .bail()
      .notEmpty()
      .withMessage("Password must not be empty")
      .bail()
      .isString()
      .withMessage("Password must be a string")
      .bail()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 symbol and minimum length should be 8"
      ),

    body("phone")
      .exists()
      .withMessage("Please provide phone number.")
      .bail()
      .notEmpty()
      .withMessage("Phone number must not be empty")
      .bail()
      .isString()
      .withMessage("Phone number must be a string.")
      .bail()
      .matches(/^01\d{9}$/) // Checks wheater the number stars with 01 and has 9 digits after this
      .withMessage("Please provide a valid phone number."),

    body("country").isString().withMessage("Country must be a string").bail(),

    body("role")
      .optional()
      .isNumeric()
      .withMessage("Role must be a numeric value"),
  ],
};

module.exports = { authValidator };
