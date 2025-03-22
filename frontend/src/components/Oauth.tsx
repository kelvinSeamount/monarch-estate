import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { sigInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Exact data we want to send
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(sigInSuccess(data));
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log("Could not sign in with Google", error.message);
      } else {
        console.log("Could not sign in with Google", error);
      }
    }
  };
  return (
    <button
      className="bg-red-700 text-white p-3 rounded-lg uppercase"
      type="button"
      onClick={handleGoogleSignUp}
    >
      Oauth
    </button>
  );
};

export default Oauth;
