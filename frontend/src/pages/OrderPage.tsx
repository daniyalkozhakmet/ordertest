import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { orderCreate } from "../features/order/orderSlice";
import { useNotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Alert } from "../components/Alert";
type initialValuesType = {
  title: string;
  description: string;
  access?: string;
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
export const OrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    order,
    loading: loadingOrder,
    error: errorOrder,
    success,
  } = useAppSelector((state) => state.order);
  const { user, loading, error } = useAppSelector((state) => state.user);
  const alert = useNotificationContext() as valueType;
  const { alertHandler } = alert;
  const formik = useFormik<initialValuesType>({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Please enter title"),
      description: Yup.string()
        .min(5, "must be at least 5 characters long")
        .required("Please type description"),
    }),
    onSubmit: (values, { resetForm }) => {
      let orderData = values;
      if (user) {
        orderData = { ...values, access: user.access };
      }
      resetForm();
      dispatch(orderCreate(orderData));
      // setIsLoggedIn(true);
    },
  });
  useEffect(() => {
    if (typeof errorOrder == "string") {
      return alertHandler({ message: error as string, type: "danger" });
    }
    if (
      typeof errorOrder === "object" &&
      errorOrder !== null &&
      Array.isArray(errorOrder)
    ) {
      return alertHandler({ message: errorOrder[0], type: "danger" });
    }
  }, [errorOrder]);
  useEffect(() => {
    if (success) {
      navigate("/orders");
    }
  }, [success]);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full md:max-w-lg max-w-md">
        <div className="px-8">
          <Alert />
        </div>

        <h1 className="px-8 text-3xl font-bold">Place Order</h1>
        <form
          className="bg-white rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-9 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Brief title
            </label>
            <input
              className="shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.touched.title && formik.errors.title ? (
              <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                {formik.errors.title}
              </span>
            ) : null}
          </div>
          <div className="mb-9 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Detailed description
            </label>
            <textarea
              className="shadow appearance-none resize-none h-20  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <span className="text-red-400 text-sm absolute bottom-0 left-0 w-full translate-y-full">
                {formik.errors.description}
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
