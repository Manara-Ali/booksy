import React, { useContext } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "../context/ModalContext";

const ModalWindow = ({ children }) => {
  const { setModalOpen } = useContext(ModalContext);

  const handleModalClose = (e) => {
    if (
      e.target === document.querySelector(".modal-container") ||
      e.target === document.querySelector(".modal-message")
    ) {
      document.querySelector("#main-container").classList.remove("blur");
      // Scroll to the top of the page
      document.body.scrollTop = document.documentElement.scrollTop =
        document.body.scrollHeight;
      setModalOpen(false);
    }
  };
  return createPortal(
    <div
      className="modal-container"
      onClick={(e) => {
        return handleModalClose(e);
      }}
    >
      <div className="modal-content">{children}</div>
    </div>,
    document.querySelector("#portal")
  );
};

export default ModalWindow;
