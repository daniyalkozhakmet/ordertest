import React, { useState, useEffect } from "react";
import { Formik, useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { useNotificationContext } from "../context/NotificationContext";
import * as Yup from "yup";
import { Alert } from "../components/Alert";
import { userProfileUpdate, getProfile } from "../features/user/userSlice";
import { ProfileImage } from "../components/ProfileImage";
import "react-datepicker/dist/react-datepicker.css";
type initialValuesType = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
};
type alertHandlerArg = {
  message: string | string[];
  type: string;
};
type valueType = {
  alertHandler: (args: alertHandlerArg) => void;
  showAlert: boolean;
  message: string | undefined;
  type: string | undefined;
};
export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  const alert = useNotificationContext() as valueType;
  const { alertHandler } = alert;
  const [birth, setBirth] = useState(new Date());
  const formik = useFormik<initialValuesType>({
    initialValues: user
      ? {
          email: user.email,
          password: "",
          first_name: user.first_name,
          last_name: user.last_name,
          confirm_password: "",
        }
      : {
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          confirm_password: "",
        },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter email"),
      first_name: Yup.string().required("Please enter first name"),
      last_name: Yup.string().required("Please enter last name"),
      password: Yup.string()
        .min(5, "must be at least 5 characters long")
        .required("Please enter password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm password"),
    }),
    onSubmit: (values) => {
      const userData = {
        ...values,
        access: user ? user.access : "",
      };
      dispatch(userProfileUpdate(userData));
      // setIsLoggedIn(true);
    },
  });
  useEffect(() => {
    if (typeof error == "string") {
      return alertHandler({ message: error as string, type: "danger" });
    }
    if (typeof error === "object" && error !== null && Array.isArray(error)) {
      return alertHandler({ message: error, type: "danger" });
    }
  }, [error]);
  useEffect(() => {
    if (user) dispatch(getProfile({ access: user.access }));
  }, [user?.image]);
  return (
    <div>
      <h1 className="px-8 text-3xl font-bold text-center">Profile</h1>
      <div className="container w-screen h-screen flex flex-col md:flex md:flex-row md:justify-center md:items-start pt-10">
        <div className="md:w-2/5 w-full">
          <form
            className="bg-white rounded px-8 md:px-0 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="first_name"
              >
                First name
              </label>
              <input
                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="first_name"
                name="first_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.first_name}
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                  {formik.errors.first_name}
                </span>
              ) : null}
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="last_name"
              >
                Last name
              </label>
              <input
                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="last_name"
                name="last_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                  {formik.errors.last_name}
                </span>
              ) : null}
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="username"
              >
                Email{" "}
                <span className="font-normal text-red-500">
                  * can not be changed
                </span>
              </label>
              <input
                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                disabled
              />
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                  {formik.errors.email}
                </span>
              ) : null}
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                  {formik.errors.password}
                </span>
              ) : null}
            </div>
            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                htmlFor="password"
              >
                Confirm password
              </label>
              <input
                className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirm_password"
                name="confirm_password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm_password}
              />
              {formik.touched.confirm_password &&
              formik.errors.confirm_password ? (
                <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                  {formik.errors.confirm_password}
                </span>
              ) : null}
            </div>
            <Alert />
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
        <div className="md:w-1/5 w-1/2  mx-8 p-1 flex justify-start items-start">
          <ProfileImage />
        </div>
      </div>
    </div>
  );
};
