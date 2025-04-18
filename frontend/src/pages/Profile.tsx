import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { RootState } from "../redux/storeSetup";
import { UserFormData } from "../types";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signUserOutFailure,
  signUserOutStart,
  signUserOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

{
  /*  FIREBASE FILE STORAGE RULES
  service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write:if
      request.resource.size < 2 * 1024 * 1024  &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
  */
}

const Profile = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileRate, setFileRate] = useState<number>(0);
  const [fileUploadError, setFileUploadError] = useState<boolean>(false);
  const [userFormData, setUserFormData] = useState<UserFormData>({});
  const [updated, setUpdated] = useState(false);
  const dispatch = useDispatch();

  // Ref for file input
  const fileRef = useRef<HTMLInputElement>(null);

  // Redux state and dispatch
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  // Handle file upload
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileRate(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserFormData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    );
  };

  //function to handle form submit
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(userFormData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdated(true);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(updateUserFailure(error.message));
      } else {
        dispatch(
          updateUserFailure("An error occurred while updating user data")
        );
      }
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFormData({ ...userFormData, [e.target.id]: e.target.value });
  };

  //delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(error.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(deleteUserFailure(error.message));
      } else {
        dispatch(deleteUserFailure("An error occurred while deleting user"));
      }
    }
  };

  //SignOut user
  const handleSignOut = async () => {
    try {
      dispatch(signUserOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signUserOutFailure(error.message));
        return;
      }
      dispatch(signUserOutSuccess(data));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(signUserOutFailure(error.message));
      } else {
        dispatch(
          signUserOutFailure("An error occurred while signing out user")
        );
      }
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      {/* File input for image upload */}
      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <form className="flex flex-col space-y-4" onSubmit={handleSubmitForm}>
        <img
          src={userFormData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center my-2"
          onClick={() => fileRef.current?.click()}
        />
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 MB)
            </span>
          ) : fileRate > 0 && fileRate < 100 ? (
            <span className="text-green-700">{`Uploading ${fileRate}%`}</span>
          ) : fileRate === 100 ? (
            <span className="text-green-950">Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="border p-3 rounded-lg"
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 rounded-lg uppercase text-center hover:opacity-95 text-white p-3"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex items-center justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-4">{error ? error : ""}</p>
      <p className="text-green-700 mt-4">{updated ? "User is updated" : ""}</p>
    </div>
  );
};

export default Profile;
