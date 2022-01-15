import "../styles/globals.css";
import { useEffect } from "react";
import useWindowDimensions from "../utilities/useWindowDimensions";

function MyApp({ Component, pageProps }) {
  // Calculate custom vh property to fix Safari issue
  const { height, _ } = useWindowDimensions();
  useEffect(() => {
    let vh = height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, [height]);

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Component {...pageProps} />
      <div id="modal-root" />
    </div>
  );
}

export default MyApp;
