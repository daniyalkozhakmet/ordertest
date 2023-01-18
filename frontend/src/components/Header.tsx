import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { FaUserCircle, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { logout } from "../features/user/userSlice";
import { IconType } from "react-icons/lib";
export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userProfileElement = useRef<HTMLLIElement>(null);
  const orderElement = useRef<HTMLLIElement>(null);
  const logOutElement = useRef<HTMLLIElement>(null);
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const { loggedIn, user } = useAppSelector((state) => state.user);
  return (
    <nav className="navbar h-16 navbar-expand-lg shadow-md py-2 bg-white fixed top-0 flex items-center w-full justify-between z-10">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1
            className="font-bold text-3xl uppercase text-secondary cursor-pointer tracking-wide"
            onClick={() => navigate("/")}
          >
            <span className="text-primary">Dev</span>ops
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <h1
            className="uppercase border border-secondary text-secondary relative px-2 rounded-sm hover:text-primary hover:border-primary duration-200 cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            Orders
          </h1>
          {loggedIn && (
            <h1
              className="uppercase border border-secondary text-secondary relative px-2 rounded-sm hover:text-primary hover:border-primary duration-200 cursor-pointer"
              onClick={() => navigate("/users")}
            >
              Users
            </h1>
          )}
        </div>
        {loggedIn && (
          <>
            {" "}
            <button
              className="text-secondary cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <AiOutlineMenu size={35} />
            </button>
          </>
        )}
        {loggedIn ? (
          <div
            className={
              "flex flex-grow items-start text-secondary bg-blue-100 fixed top-16 right-0 duration-300 h-screen w-52 md:w-96" +
              (navbarOpen ? " flex translate-x-0" : " translate-x-96")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col list-none w-full pt-4">
              <li
                onClick={() => {
                  navigate("/order");
                  setNavbarOpen(false);
                }}
                ref={orderElement}
                onMouseEnter={() => {
                  if (orderElement.current) {
                    orderElement.current.children[0].classList.remove(
                      "bg-secondary"
                    );
                    orderElement.current.children[0].classList.add(
                      "bg-primary"
                    );
                  }
                }}
                onMouseLeave={() => {
                  if (orderElement.current) {
                    orderElement.current.children[0].classList.add(
                      "bg-secondary"
                    );
                    orderElement.current.children[0].classList.remove(
                      "bg-primary"
                    );
                  }
                }}
                className="nav-item py-3 cursor-pointer flex justify-start items-center space-x-2 hover:bg-blue-200 hover:text-primary p-2 px-4"
              >
                <FaPlus
                  size={35}
                  className={`bg-secondary rounded-full p-2 text-white hover:bg-primary duration-200 cursor-pointer`}
                />
                <h1>Add order </h1>
              </li>
              <li
                ref={userProfileElement}
                onMouseEnter={() => {
                  if (userProfileElement.current) {
                    userProfileElement.current.children[0].classList.remove(
                      "bg-secondary"
                    );
                    userProfileElement.current.children[0].classList.add(
                      "bg-primary"
                    );
                  }
                }}
                onMouseLeave={() => {
                  if (userProfileElement.current) {
                    userProfileElement.current.children[0].classList.add(
                      "bg-secondary"
                    );
                    userProfileElement.current.children[0].classList.remove(
                      "bg-primary"
                    );
                  }
                }}
                onClick={() => {
                  navigate("/profile");
                  setNavbarOpen(false);
                }}
                className="nav-item cursor-pointer py-3 flex justify-start items-center space-x-2 hover:bg-blue-200 hover:text-primary p-2 px-4"
              >
                <FaUserCircle
                  size={35}
                  className={`bg-secondary rounded-full text-white hover:bg-primary duration-200 cursor-pointer`}
                />
                <h1>Profile </h1>
              </li>
              <li
                ref={logOutElement}
                onMouseEnter={() => {
                  if (logOutElement.current) {
                    logOutElement.current.children[0].classList.remove(
                      "bg-secondary"
                    );
                    logOutElement.current.children[0].classList.add(
                      "bg-primary"
                    );
                  }
                }}
                onMouseLeave={() => {
                  if (logOutElement.current) {
                    logOutElement.current.children[0].classList.add(
                      "bg-secondary"
                    );
                    logOutElement.current.children[0].classList.remove(
                      "bg-primary"
                    );
                  }
                }}
                onClick={() => {
                  dispatch(logout());
                  setNavbarOpen(false);
                }}
                className="nav-item cursor-pointer py-3 flex justify-start items-center space-x-2 hover:bg-blue-200 hover:text-primary p-2 px-4"
              >
                <FaSignOutAlt
                  size={35}
                  className={`bg-secondary rounded-full p-2 text-white hover:bg-primary duration-200 cursor-pointer`}
                />
                <h1>Sign Out </h1>
              </li>
            </ul>
          </div>
        ) : (
          <span className=" flex space-x-2 items-center">
            <div>
              <FaPlus
                onClick={() => navigate("/order")}
                size={35}
                className="bg-secondary rounded-full p-2 text-white hover:bg-primary duration-100 cursor-pointer"
              />
            </div>
            <Link
              to="/login"
              className="p-1 px-3 text-primary uppercase ease-in duration-100 border border-transparent hover:border-primary hover:border rounded-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="p-1 px-3 text-primary uppercase ease-in duration-100 border border-transparent hover:border-primary hover:border rounded-sm"
            >
              Register
            </Link>
          </span>
        )}
      </div>
    </nav>
  );
};
