import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FilteredUsersList } from "../components/FilteredUsersList";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getProfileFilter } from "../features/filter/filterSlice";
type initialValuesType = {
  search: string;
};
export const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [search, setSearch] = useState<string>("");
  const formik = useFormik<initialValuesType>({
    initialValues: {
      search: "",
    },
    validationSchema: Yup.object().shape({
      search: Yup.string().required("Please type something"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (user) {
        dispatch(
          getProfileFilter({ search: values.search, access: user.access })
        );
      }
      resetForm();
      //   dispatch(userLogin(values));
      // setIsLoggedIn(true);
    },
  });
  return (
    <div className="container mt-4 justify-between flex-column items-start space-y-4 md:items-start md:space-x-3 md:space-y-0 md:justify-between md:flex md:flex-row">
      <form className="w-full md:w-2/5" onSubmit={formik.handleSubmit}>
        <div className="flex items-center border-b border-secondary py-2 relative">
          <input
            className={`appearance-none placeholder-gray-500 ${
              formik.touched.search &&
              formik.errors.search &&
              "placeholder-red-500 "
            }  bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none`}
            type="text"
            id="search"
            name="search"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.search}
            placeholder={
              formik.touched.search && formik.errors.search
                ? formik.errors.search
                : `Filter by first name or last name`
            }
            aria-label="Full name"
          />

          <button
            className="flex-shrink-0 bg-secondary hover:bg-primary border-secondary hover:border-primary text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
      <div className="w-full md:w-3/5">
        <FilteredUsersList />
      </div>
    </div>
  );
};
