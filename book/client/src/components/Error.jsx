import React from "react";
import { Alert } from "react-bootstrap";

const Error = ({ message }) => {
  return (
    <Alert className="error-container" variant="danger">
      {message}
    </Alert>
  );
};

export default Error;
