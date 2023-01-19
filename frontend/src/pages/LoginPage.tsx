import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { userLogin } from "../features/user/userSlice";
import { useNotificationContext } from "../context/NotificationContext";
import { Alert } from "../components/Alert";
type initialValuesType = {
  email: string;
  password: string;
};
type alertHandlerArg = {
  message: string;
  type: string;
};
type valueType = {
  alertHandler: (args: alertHandlerArg) => void;
  showAlert: boolean;
  message: string | undefined;
  type: string | undefined;
};
export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  const alert = useNotificationContext() as valueType;
  const { alertHandler } = alert;
  const formik = useFormik<initialValuesType>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter email"),
      password: Yup.string()
        .min(5, "must be at least 5 characters long")
        .required("Please enter password"),
    }),
    onSubmit: (values) => {
      dispatch(userLogin(values));
      // setIsLoggedIn(true);
    },
  });
  useEffect(() => {
    if (typeof error == "string") {
      return alertHandler({ message: error as string, type: "danger" });
    }
    if (typeof error === "object" && error !== null && Array.isArray(error)) {
      return alertHandler({ message: error[0].msg, type: "danger" });
    }
  }, [error]);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full md:max-w-lg max-w-md">
        <div className="px-8">
          <Alert />
        </div>

        <h1 className="px-8 text-3xl font-bold">Sign In</h1>
        <form
          className="bg-white rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-9 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                {formik.errors.email}
              </span>
            ) : null}
          </div>
          <div className="mb-9 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
