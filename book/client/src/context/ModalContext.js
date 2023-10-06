import React, { useState } from "react";

export const ModalContext = React.createContext();

export const CustomEditProvider = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const [element, setElement] = useState(null);

    // 1. Create a shareable object
    const obj = {
        modalOpen,
        setModalOpen,
        element,
        setElement,
    };

    const firstName = "Manara";

    // 2. Return custom context
    return (
        <ModalContext.Provider value={obj}>{children}</ModalContext.Provider>
    );
};
