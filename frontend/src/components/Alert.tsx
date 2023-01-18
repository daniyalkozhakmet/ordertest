import React, { useEffect } from "react";
import { useNotificationContext } from "../context/NotificationContext";
type alertHandlerArg = {
  message: string;
  type: string;
};
type valueType = {
  alertHandler: (args: alertHandlerArg) => void;
  showAlert: boolean;
  message: string | string[];
  type: string | undefined;
};
export const Alert = () => {
  const { showAlert, message, type } = useNotificationContext() as valueType;
  return (
    <div>
      {showAlert &&
        (typeof message == "string" ? (
          <h1
            className={` py-3 font-bold text-lg uppercase rounded border-2 text-center my-2 ${
              type == "success"
                ? "border-green-400 text-green-400"
                : type == "danger"
                ? "border-red-600 text-red-600"
                : "border-yellow-300 text-yellow-300"
            }
          `}
          >
            {message}
          </h1>
        ) : (
          message && (
            <div>
              {message.map((msg,index) => (
                <h1
                key={index}
                  className={` py-3 font-bold text-lg uppercase rounded border-2 text-center my-2 ${
                    type == "success"
                      ? "border-green-400 text-green-400"
                      : type == "danger"
                      ? "border-red-600 text-red-600"
                      : "border-yellow-300 text-yellow-300"
                  }
            `}
                >
                  {msg}
                </h1>
              ))}
            </div>
          )
        ))}
    </div>
  );
};
