import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import LandingPage from "./components/LandingPage/LandingPage";
import LoginForm from "./components/LogIn/LoginForm";
import { Provider } from "react-redux";
import store from "./utils/store";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPasswordForm from "./components/ForgotPassword/ResetPassword";
import VerifyEmail from "./components/SignUp/verifyEmail";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";

import { FC, useState } from 'react';
import Landing from './components/pages/landing';
import Pop from './components/layout/pop/Pop.jsx';
import Cart from './components/features/Cart/Cart'
import LocalStorageContext from './hooks/LocalStorageContext';
import { getItems, saveItems } from "./utils/storageFunctions";

function App() {
  const [popStatus, setPopStatus] = useState(JSON.parse(getItems("popperStatus")));
  const sharedValue = {popStatus, setPopStatus}
  return (
    <Provider store={store}>
      <LocalStorageContext.Provider value={sharedValue}>

      <>
      <Pop children={<Cart />} />
        <Router>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:token/:userId"
              element={<ResetPasswordForm />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/verify-email/:token/:userId"
              element={<VerifyEmail />}
            />
            {/* {/* <Route path="/products/:productId" element={<ProductDetails />/> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </>
      </LocalStorageContext.Provider>
    </Provider>
  );
}

export default App;
