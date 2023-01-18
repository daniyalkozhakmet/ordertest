import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import { Spinner } from "./Spinner";
import { AlertStatic } from "./AlertStatic";
type usersType = {
  first_name: string;
  age: number;
};
export const FilteredUsersList: React.FC = () => {
  const { users, loading, error } = useAppSelector((state) => state.filterUser);
  console.log(error);
  if (users == null) {
    return (
      <AlertStatic
        message="Type something to filter user by name"
        type="yellow"
      />
    );
  }
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <AlertStatic message={String(error)} type="red" />
      ) : (
        <div>
          <h1 className="uppercase text-2xl pb-3  text-center font-bold">
            Users
          </h1>
          <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, index) => (
              <li className="pb-3 sm:pb-4" key={index}>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-9 h-9 rounded-full object-cover border border-secondary"
                      src={user.image}
                      alt={`${user.first_name} 'image'`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.first_name}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base text-gray-900 dark:text-white">
                    {user.age} years old
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
