import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import Error from "../components/Error";
import {
  fetchUser,
  enteredName,
  enteredEmail,
  enteredPassword,
  enteredPasswordConfirm,
  enteredCurrentPassword,
  accountChange,
  clearError,
  passwordChange,
} from "../store";

const Profile = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => {
    return state.usersCombinedReducer;
  });

  const { name, email, password, passwordConfirm, currentPassword } =
    useSelector((state) => {
      return state.formCombinedReducer;
    });

  const { error } = useSelector((state) => {
    return state.usersCombinedReducer;
  });

  const handleNameChange = (value) => {
    dispatch(enteredName(value));
  };

  const handleEmailChange = (value) => {
    dispatch(enteredEmail(value));
  };

  const handleCurrentPasswordChange = (value) => {
    dispatch(enteredCurrentPassword(value));
  };

  const handlePasswordChange = (value) => {
    dispatch(enteredPassword(value));
  };

  const handlePasswordConfirmChange = (value) => {
    dispatch(enteredPasswordConfirm(value));
  };

  const handleUserInfoSubmission = (e, obj) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", obj.name);
    form.append("email", obj.email);
    form.append("photo", document.querySelector(".photo-input").files[0]);
    dispatch(accountChange(form));
    document.querySelector(".photo-input").value = "";
  };

  const handleUserPasswordChangeSubmission = (e, obj) => {
    e.preventDefault();
    dispatch(passwordChange(obj));
  };

  useEffect(() => {
    console.log("Herer");
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (error.message) {
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [error.message, dispatch]);

  return (
    <Row className="row-container">
      {error.message && <Error message={error.message} />}
      <Col
        md={12}
        style={{ border: "1px solid red" }}
        className="column-container"
      >
        <Form
          className="account-form"
          onSubmit={(e) => {
            return handleUserInfoSubmission(e, {
              name,
              email,
            });
          }}
        >
          <h1>Your Account</h1>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder={user.name}
              value={name}
              onChange={(e) => {
                return handleNameChange(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              name="email"
              type="email"
              placeholder={user.email}
              value={email}
              onChange={(e) => {
                return handleEmailChange(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="photo" className="my-3">
            <Form.Label>Profile Image</Form.Label>
            <div className="profile-user-img">
              <img
                id="profile-img"
                src={`/img/users/${user.photo}`}
                alt={user.name}
              />
              <Form.Control
                className="photo-input"
                name="photo"
                type="file"
                accept="image/*"
              ></Form.Control>
            </div>
          </Form.Group>
          <Button type="submit" className="my-0" id="btn-profile">
            Update Profile
          </Button>
        </Form>
        <hr />
        <Form
          className="password-account-form"
          onSubmit={(e) => {
            return handleUserPasswordChangeSubmission(e, {
              currentPassword,
              newPassword: password,
              newPasswordConfirm: passwordConfirm,
            });
          }}
        >
          <h1>User Password</h1>
          <Form.Group controlId="password-current" className="my-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              name="password-current"
              type="password"
              placeholder={password || "Enter Current Password"}
              // value={currentPassword}
              onChange={(e) => {
                return handleCurrentPasswordChange(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => {
                return handlePasswordChange(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password-confirm" className="my-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              name="password-confirm"
              type="password"
              placeholder="Confirm New Password"
              value={passwordConfirm}
              onChange={(e) => {
                return handlePasswordConfirmChange(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" id="btn-password" className="my-0">
            Update Password
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default Profile;
