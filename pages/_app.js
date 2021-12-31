import "../styles/globals.css";
import App from "next/app";
import Cookies from "universal-cookie";
import { validatePassword } from "./api/auth";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <div id="modal-root" />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  if (!appContext.ctx.req || !appContext.ctx.req.headers) {
    appProps.pageProps.isAuthenticated = false;
    return { ...appProps };
  }

  const cookies = new Cookies(appContext.ctx.req.headers.cookie);
  const password = cookies.get("password");

  if (!password) {
    appProps.pageProps.isAuthenticated = false;
    return { ...appProps };
  }

  appProps.pageProps.isAuthenticated = await validatePassword(password);
  return { ...appProps };
};

export default MyApp;
