import { useState } from "react";
import Cookies from "universal-cookie";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="w-1/3 max-w-sm mx-auto">
      <form>
        <label className="block">
          <span className="text-gray-700">Password</span>
          <input
            type="text"
            className="form-input mt-1 block w-full bg-gray-50"
            placeholder="Your site password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!error) setError("");
            }}
          ></input>
        </label>
        <button
          type="submit"
          className="mt-3 bg-green-400 text-white p-2 font-bold rounded hover:bg-green-600"
          onClick={async (e) => {
            e.preventDefault();

            const res = await fetch("api/auth", {
              body: JSON.stringify({ password: password }),
            });

            const json = await res.json();
            if (json.authenticated) {
              const cookies = new Cookies();
              cookies.set("password", password, {
                path: "/",
              });
              window.location.href = "/";
            } else {
              setError("Invalid Password");
            }
          }}
        >
          Login
        </button>
        <div>{error}</div>
      </form>
    </div>
  );
};

export default Login;

const registerUser = async (event) => {
  setLoading(true);
  event.preventDefault();

  if (res.status == 201) {
    const json = await res.json();
    setState((prev) => ({ ...prev, users: [json, ...users] }));
  } else {
    const error = await res.text();
    setRegisterError(error);
  }
  setLoading(false);
};
