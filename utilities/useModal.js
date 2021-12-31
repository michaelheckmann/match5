import React, { useState } from "react";

import Modal from "../components/Modal";

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  const RenderModal = ({ children, title, buttonText, buttonFunction }) => (
    <React.Fragment>
      {isVisible && (
        <Modal
          closeModal={hideModal}
          title={title}
          buttonText={buttonText}
          buttonFunction={buttonFunction}
        >
          {children}
        </Modal>
      )}
    </React.Fragment>
  );

  return {
    showModal,
    hideModal,
    RenderModal,
  };
};
