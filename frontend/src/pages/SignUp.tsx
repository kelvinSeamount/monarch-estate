import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface FormProps {
  username?: string;
  password?: string;
  email?: string;
}
const SignUp = () => {
  const [formData, setFormData] = useState<FormProps>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      //navigate to sign in page
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //spread operator to keep previous inputs
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-muted-foreground">
        Sign Up
      </h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="rounded-lg p-3 border"
          id="username"
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="rounded-lg p-3 border"
          id="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="rounded-lg p-3 border"
          id="password"
          onChange={handleChange}
        />

        <button className="text-white bg-slate-700 p-3 hover:opacity-95 uppercase disabled:opacity-80 rounded-lg">
          {loading ? "Loading" : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
