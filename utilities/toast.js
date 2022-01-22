import { toast } from "react-toastify";

export const showToast = (s, type, duration = 7000) => {
  switch (type) {
    case "error":
      toast.error(s, {
        position: "bottom-center",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      break;
    case "success":
      toast.success(s, {
        position: "bottom-center",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      break;

    // Had to repurpose this class
    case "gif":
      toast.warning(s, {
        position: "bottom-left",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        icon: false,
        closeButton: false,
      });
      break;

    default:
      toast(s, {
        position: "bottom-center",
        autoClose: duration,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      break;
  }
};

export const CloseButton = ({ closeToast }) => (
  <div onClick={closeToast} className="pr-1 cursor-pointer">
    ✕
  </div>
);
