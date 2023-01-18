import React from "react";
type AlertStaticType = {
  message: string;
  type: string;
};
export const AlertStatic: React.FC<AlertStaticType> = ({ message, type }) => {
  return (
    <div
      className={` border-2 rounded-sm border-${type}-500 text-${type}-500 py-3 text-lg text-center px-2`}
    >
      {message}
    </div>
  );
};
