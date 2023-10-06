import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { enteredEmail, enteredPassword, loginUser } from "../store";
import { enteredEmail, enteredPassword, loginUser, clearError } from "../store";
import Error from "../components/Error";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { email, password } = useSelector((state) => {
    return state.formCombinedReducer;
  });

  const user = useSelector((state) => {
    return state.usersCombinedReducer.user;
  });

  let { error } = useSelector((state) => {
    return state.usersCombinedReducer;
  });

  const handleEmail = (e) => {
    return dispatch(enteredEmail(e.target.value));
  };

  const handlePassword = (e) => {
    return dispatch(enteredPassword(e.target.value));
  };

  const handleFormSubmission = (e) => {
    e.preventDefault();
    return dispatch(loginUser({ email, password }));
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
        className="login-form"
        onSubmit={(e) => {
          return handleFormSubmission(e);
        }}
      >
        <h1>Log In</h1>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              return handleEmail(e);
            }}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            className="input-box"
            onChange={(e) => {
              return handlePassword(e);
            }}
          />
        </Form.Group>

        <Button className="card-btn" type="submit">
          Log In
        </Button>
      </Form>
    </>
  );
};

export default Login;
