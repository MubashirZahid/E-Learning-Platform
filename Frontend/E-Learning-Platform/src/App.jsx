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

function App() {
  return (
    <Provider store={store}>
      <>
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
    </Provider>
  );
}

export default App;
