import { ChangeEvent, FormEvent, useState } from "react";
import { SignInFormProps } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  sigInStart,
  sigInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { RootState } from "../redux/storeSetup";
import Oauth from "../components/Oauth";

const SignIn = () => {
  const [formData, setFormData] = useState<SignInFormProps>({});
  const { loading, error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //spread operator to keep previous inputs
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(sigInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(sigInSuccess(data));
      //navigate to sign in page
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signInFailure(error.message));
      } else {
        dispatch(signInFailure("An error occurred"));
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1
        className="text-3xl text-center
      font-semibold my-7"
      >
        Sign In
      </h1>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          id="password"
          className="border rounded-lg p-3"
          onChange={handleChange}
        />

        <button className="text-white bg-slate-700 p-3 hover:opacity-95 uppercase disabled:opacity-80 rounded-lg">
          {loading ? "Loading" : "Sign in"}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
};

export default SignIn;
