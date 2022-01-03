import React from "react";
import ReactDOM from "react-dom";

const Modal = React.memo(
  ({ children, closeModal, title, buttonText, buttonFunction }) => {
    const domEl = document.getElementById("modal-root");

    if (!domEl) return null;

    return ReactDOM.createPortal(
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            {/*content*/}
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-3xl font-semibold">{title}</h3>
                <button
                  className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none focus:outline-none">
                    ✕
                  </span>
                </button>
              </div>
              {/*body*/}
              {children}
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                <button
                  className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                  type="button"
                  onClick={buttonFunction}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
      </>,
      domEl
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
