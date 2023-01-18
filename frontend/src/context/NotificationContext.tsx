import React, { createContext, useEffect, useState, useContext } from "react";
import { clearError } from "../features/user/userSlice";
import { useAppDispatch } from "../hooks/hooks";
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
type Props = {
  children: JSX.Element | JSX.Element[];
};
export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
const NotificationContext = createContext<valueType | null>(null);
export const AlertProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [type, setType] = useState<string>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    const time = setTimeout(() => {
      setShowAlert(false);
      dispatch(clearError());
    }, 3000);
    return () => clearTimeout(time);
  }, [showAlert]);
  const alertHandler = (args: alertHandlerArg) => {
    setMessage(args.message);
    setType(args.type);
    setShowAlert(true);
  };

  return (
    <NotificationContext.Provider
      value={{ alertHandler, message, type, showAlert }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
