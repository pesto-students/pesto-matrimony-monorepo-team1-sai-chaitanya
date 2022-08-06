import React, { useState } from "react";
import "./formlogin.css";
import img from "./images/loginpage.jpg";

const AboutUs = ({ onLogin }) => {
  const [formValues, setFormValues] = useState({
    emailValue: "",
    passwordValue: "",
  });

  function submitForm(e) {
    e.preventDefault();

    if (formValues) {
      onLogin(formValues.passwordValue, formValues.emailValue);
    } else {
      console.log("email or password can not be empty");
    }
  }

  function getFormValues(e) {
    const value = e.target.value;
    const name = e.target.name;

    setFormValues((oldVlaues) => {
      return { ...oldVlaues, [name]: value };
    });
  }

  return (
    <>
      <div className="super_container">
        <div className="left_container">
          <img src={img} alt="couple" />
        </div>
        <div className="right_container">
          <div className="login_box">
            <div className="login_logo">Pesto Matrimony</div>
            <div className="signin_text">Sign in</div>
            <form onSubmit={submitForm}>
              <input
                className="email_input"
                type="email"
                placeholder="Email Address"
                onChange={getFormValues}
                name="emailValue"
                value={formValues.emailValue}
              />{" "}
              <br />
              <input
                className="password_input"
                type="password"
                placeholder="password"
                onChange={getFormValues}
                name="passwordValue"
                value={formValues.passwordValue}
              />
              <br />
              <input
                className="checkbox_input"
                type="checkbox"
                name="login_remember"
              />
              <label htmlFor="login_remember"> Remember Me </label> <br />
              <button className="signin_btn">Log in</button>
            </form>
            <p>Forgot Password</p>
            <p>
              Don't haveaccount? <span className="signup_link">SignUp</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
