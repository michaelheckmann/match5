import { useState } from "react";
import Head from "next/head";
import Cookies from "universal-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../utilities/toast";

const CloseButton = ({ closeToast }) => (
  <div onClick={closeToast} className="text-red-500 pr-1">
    ✕
  </div>
);

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("api/auth", {
      body: JSON.stringify({ password: password }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const json = await res.json();
    if (json.authenticated) {
      const cookies = new Cookies();
      cookies.set("password", password, {
        path: "/",
      });
      window.location.href = "/";
    } else {
      showToast("Ungültiges Passwort", "error");
    }
  }

  return (
    <>
      <Head>
        <title>Match5: Login</title>
        <meta name="description" content="Login für Match5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-screen h-screen flex justify-center items-center bg-gray-100 text-gray-700">
        <div className="shadow-lg rounded-lg p-9 bg-white">
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="font-bold block mb-4 text-lg">Passwort</span>
              <input
                type="text"
                className="focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 block w-full focus:outline-none pl-7 pr-12 h-10 text-center font-mono sm:text-sm border-gray-300 border rounded-md"
                placeholder="Passwort eingeben"
                value={password}
                autoComplete="off"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!error) setError("");
                }}
              ></input>
            </label>
            <button
              type="submit"
              className="bg-fuchsia-400 text-white py-2 px-5 mt-6 font-bold rounded hover:bg-fuchsia-600 float-right"
            >
              Einloggen
            </button>
          </form>
        </div>
      </div>

      <ToastContainer
        toastClassName={() =>
          "relative flex justify-between p-1 rounded-lg overflow-hidden text-red-400 bg-red-100 border border-red-500 shadow-lg mt-3"
        }
        bodyClassName={() => "flex text-sm font-semibold block p-3 w-full"}
        position="bottom-center"
        autoClose={10000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={CloseButton}
      />
    </>
  );
};

export default Login;
