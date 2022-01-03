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
