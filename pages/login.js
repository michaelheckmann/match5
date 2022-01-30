import { useState } from "react";

import Head from "next/head";
import Router from "next/router";
import useTranslation from "next-translate/useTranslation";

import Cookies from "universal-cookie";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast, CloseButton } from "../utilities/toast";

import Loading from "../components/Loading";

import makeRequest from "../utilities/request";

const Login = () => {
  const { t } = useTranslation("login");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle passwort submit event
  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    const json = await makeRequest("auth/auth", { password: password }, true);
    if (json.authenticated) {
      const cookies = new Cookies();
      cookies.set("password", password, {
        path: "/",
      });
      Router.push("/").finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      showToast(t`common:not.error.wrong-password`, "error");
    }
  }

  return (
    <>
      <Head>
        <title>{t`title`}</title>
        <meta name="description" content={t`description`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0">
        <div className="flex items-center justify-center w-screen overflow-x-hidden text-gray-700 bg-gray-100 h-screen-custom px-7">
          <div className="bg-white rounded-lg shadow-lg p-9">
            {isLoading && (
              <div>
                {" "}
                <Loading isLoading={isLoading} />
              </div>
            )}
            {!isLoading && (
              <form onSubmit={handleSubmit}>
                <label className="block">
                  <span className="block mb-4 text-lg font-bold">{t`password`}</span>
                  <input
                    type="text"
                    className="block w-full h-10 pr-12 font-mono text-center border border-gray-300 rounded-md focus:ring-fuchsia-400 focus:border-fuchsia-300 focus:ring-2 focus:ring-offset-2 focus:outline-none pl-7 sm:text-sm sm:placeholder:text-base placeholder:text-sm"
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
                  className="float-right px-5 py-2 mt-6 font-bold text-white rounded bg-fuchsia-400 hover:bg-fuchsia-600"
                >
                  {t`login`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ToastContainer
        toastClassName={() =>
          "relative flex justify-between p-1 rounded-lg overflow-hidden text-red-400 bg-red-100 border border-red-500 shadow-lg mt-3 sm:mb-0 mb-4 sm:mx-0 mx-4"
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
