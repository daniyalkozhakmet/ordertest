import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { useFormik } from "formik";
import { useRef } from "react";
import { userProfileImageUpload } from "../features/user/userSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholderImage from "../utility/place.png";
import 'react-lazy-load-image-component/src/effects/blur.css';
export const ProfileImage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      photo: "",
    },
    onSubmit: (values) => {
      if (user)
        dispatch(
          userProfileImageUpload({ image: values.photo, access: user.access })
        );
    },
  });

  if (user) {
    return (
      <div className="max-w-sm flex flex-col justify-center items-start bg-white  ">
        <LazyLoadImage
        className="w-full h-full object-cover"
          src={user.image}
          width={200}
          height={160}
          placeholderSrc={placeholderImage}
          effect='blur'
          alt='placeholderImage'
        />
        <form
          className="w-42"
          onChange={formik.handleSubmit}
          encType="multipart/form-data"
        >
          <label
            htmlFor="dropzone-file"
            className="flex items-center justify-center w-full rounded-lg cursor-pointer  dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500 font-semibold dark:text-gray-400">
                Click to upload
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              name="photo"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  return formik.setFieldValue("photo", e.target.files[0]);
                }
              }}
            />
          </label>
        </form>
      </div>
    );
  }
  return null;
};
