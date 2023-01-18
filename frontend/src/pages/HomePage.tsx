import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getArticles } from "../features/news/newsSlice";
import { News } from "../components/News";
import { Spinner } from "../components/Spinner";
import { Alert } from "../components/Alert";
import { useNotificationContext } from "../context/NotificationContext";
import { AlertStatic } from "../components/AlertStatic";
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
export const HomePage = () => {
  const dispatch = useAppDispatch();
  const { alertHandler } = useNotificationContext() as valueType;
  const { news, loading, error } = useAppSelector((state) => state.news);
  useEffect(() => {
    dispatch(getArticles());
  }, []);
  useEffect(() => {
    if (typeof error == "string") {
      return alertHandler({ message: error as string, type: "danger" });
    }
    if (typeof error === "object" && error !== null && Array.isArray(error)) {
      return alertHandler({ message: error[0].msg, type: "danger" });
    }
  }, [error]);
  return (
    <div className="container">
      <h1 className="text-3xl uppercase font-semibold mb-4">News</h1>
      <Alert />
      {loading ? (
        <Spinner />
      ) : news == null ? (
        <AlertStatic message="Server Error" type="red" />
      ) : (
        <div>
          {news.length == 0 && <AlertStatic message="Currently, No news " type="yellow" />}
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 auto-rows-min">
            {news.map((news, index) => (
              <News key={index} news={news} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
