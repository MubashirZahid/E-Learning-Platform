import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
// import "./ResetPassword.css";

const VerifyEmail = () => {
  const { token, userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token, userId);
    axiosInstance
      .post("/auth/api/verify-user", { token, userId })
      .then((res) => {
        console.log(res.data.data);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  }, []);

  return <div></div>;
};

export default VerifyEmail;
