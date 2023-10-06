import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Error from "../components/Error";
import {
  signupUser,
  enteredName,
  enteredEmail,
  enteredPassword,
  enteredPasswordConfirm,
  clearError,
} from "../store";

const Signup = () => {
  const dispatch = useDispatch();
  const { name, email, password, passwordConfirm } = useSelector((state) => {
    return state.formCombinedReducer;
  });

  const user = useSelector((state) => {
    return state.usersCombinedReducer.user;
  });

  const { error } = useSelector((state) => {
    return state.usersCombinedReducer;
  });

  const navigate = useNavigate();

  // Create a function to handle form submission
  const handleFormSubmission = (e) => {
    e.preventDefault();
    dispatch(signupUser({ name, email, password, passwordConfirm }));
  };

  useEffect(() => {
    if (Object.keys(user) && Object.keys(user).length) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error.message, dispatch]);

  return (
    <>
      {error.message && <Error message={error.message} />}
      <Form
        className="signup-form"
        onSubmit={(e) => {
          return handleFormSubmission(e);
        }}
      >
        <h1>Sign Up</h1>
        <p>Knowledge is free and now it has a community!</p>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => {
              return dispatch(enteredName(e.target.value));
            }}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              return dispatch(enteredEmail(e.target.value));
            }}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            className="input-box"
            value={password}
            onChange={(e) => {
              return dispatch(enteredPassword(e.target.value));
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            className="input-box"
            value={passwordConfirm}
            onChange={(e) => {
              return dispatch(enteredPasswordConfirm(e.target.value));
            }}
          />
        </Form.Group>

        <Button className="card-btn" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Signup;
