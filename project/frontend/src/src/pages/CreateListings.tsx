import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { useState, ChangeEvent } from "react";
import { app } from "../firebase";

interface FormData {
  imageUrls: string[];
}

const CreateListing = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState<FormData>({
    imageUrls: [],
  });
  const [imageLoadError, setImageLoadError] = useState<string | boolean>(false);

  const handleImageUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      files &&
      files.length > 0 &&
      files.length + formData.imageUrls.length < 7
    ) {
      const promises: Promise<string>[] = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storageImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageLoadError(false);
        })
        .catch(() => {
          setImageLoadError("Image upload failed (3 mb max per image)");
        });
    } else {
      setImageLoadError("You can only upload 6 images per listing");
    }
  };

  const storageImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Name"
            id="name"
            maxLength={62}
            minLength={10}
            required
          />
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Description"
            id="description"
            required
          />
          <input
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Address"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className=" flex gap-5">
              <input className="w-5" type="checkbox" id="sale" />
              <span>Sell</span>
            </div>
            <div className=" flex gap-5">
              <input className="w-5" type="checkbox" id="rent" />
              <span>Rent</span>
            </div>
            <div className=" flex gap-5">
              <input className="w-5" type="checkbox" id="Parking" />
              <span>Parking spot</span>
            </div>
            <div className=" flex gap-5">
              <input className="w-5" type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className=" flex gap-5">
              <input className="w-5" type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              {/*when max,min also helps reduce width */}
              <input
                id="bedroom"
                type="number"
                min="1"
                max="10"
                className="border border-gray-300 rounded-lg p-3"
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              {/*when max,min also helps reduce width */}
              <input
                id="bedroom"
                type="number"
                min="1"
                max="10"
                className="border border-gray-300 rounded-lg p-3"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              {/*when max,min also helps reduce width */}
              <input
                id="regularPrice"
                type="number"
                min="1"
                max="10"
                className="border border-gray-300 rounded-lg p-3"
              />
              <div className="flex gap-2 items-center">
                <p>Regular price</p>
                <span className="text-sm">($/ month)</span>{" "}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              {/*when max,min also helps reduce width */}
              <input
                id="discountedPrice"
                type="number"
                min="1"
                max="10"
                className="border border-gray-300 rounded-lg p-3"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-sm">($/ month)</span>{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will cover be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              id="images"
              type="file"
              accept="images/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 uppercase rounded hover:shadow-2xl disabled:opacity-80"
              onClick={handleImageUpload}
            >
              Upload
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageLoadError && imageLoadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, id) => (
              <div
                className="flex justify-between p-3 boder items-center"
                key={url}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(id)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
