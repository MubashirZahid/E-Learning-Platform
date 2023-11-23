import React from "react";
import { useForm, Controller } from "react-hook-form";
import "./SignUp.css";
import axiosInstance from "../../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm({ mode: "onChange" });
  // const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const userData = {
        name: getValues("name"),
        email: getValues("email"),
        phone: getValues("phone"),
        country: getValues("country"),
        role: getValues("role"),
        password: getValues("password"),
      };

      // Convert role value to 2 for Student and 3 for Teacher
      if (userData.role === "Student") {
        userData.role = 2;
      } else if (userData.role === "Teacher") {
        userData.role = 3;
      }

      // Make a POST request to your backend API
      await axiosInstance.post("auth/api/signUp", userData);
      // navigate("/login");

      console.log("User data submitted successfully");
    } catch (error) {
      console.error("Error submitting user data:", error);
    }
  };

  return (
    <div className="container">
      <h1>User SignUp</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-field">
          <h4>Name</h4>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                placeholder="Enter name"
                {...field}
                style={{ border: errors.name ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="input-field">
          <h4>Email</h4>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <input
                placeholder="Enter email"
                {...field}
                style={{ border: errors.email ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="input-field">
          <h4>Phone</h4>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                placeholder="Enter phone number"
                {...field}
                style={{ border: errors.phone ? "1px solid red" : "" }}
              />
            )}
          />
        </div>

        <div className="input-field">
          <h4>Country</h4>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <input
                placeholder="Enter country"
                {...field}
                style={{ border: errors.address ? "1px solid red" : "" }}
              />
            )}
          />
        </div>

        <div className="input-field">
          <h4>Role</h4>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="role-cls"
                style={{ border: errors.role ? "1px solid red" : "" }}
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            )}
          />
          {errors.role && <span className="error">Please select a role</span>}
        </div>

        <div className="input-field">
          <h4>Password</h4>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum length must be 6 characters",
              },
            }}
            render={({ field }) => (
              <input
                placeholder="Enter password"
                type="password"
                {...field}
                style={{ border: errors.password ? "1px solid red" : "" }}
              />
            )}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
