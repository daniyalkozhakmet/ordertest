import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { makeUnsuccessful } from "../features/order/orderSlice";
import { getOrders } from "../features/order/orderSlice";
import { Spinner } from "../components/Spinner";
import { orderType } from "../features/order/orderSlice";
import { initialStateType } from "../features/order/orderSlice";
import { OrderPagination } from "../components/OrderPagination";
import { AlertStatic } from "../components/AlertStatic";
import { useNavigate } from "react-router-dom";
export const OrdersPage = () => {
  const { success, orders, loading } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(makeUnsuccessful());
    if (user) {
      dispatch(getOrders({ current: 1, qty: 5, access: user.access }));
    } else {
      dispatch(getOrders({ current: 1, qty: 5 }));
    }
  }, []);
  return (
    <div className="container">
      {orders?.orders.length == 0 ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-center p-4 text-2xl text-red-400">
            No order to show! <br />{" "}
            <span
              onClick={() => navigate("/order")}
              className="text-lg border border-secondary cursor-pointer text-secondary p-1 duration-200 hover:border-primary hover:text-primary"
            >
              Create Order
            </span>
          </h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <h1 className="text-2xl uppercase my-3">List of Orders</h1>
                  <table className="w-full ">
                    <thead className="bg-white border-b">
                      <tr>
                        <th
                          scope="col"
                          className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="text-sm font-bold text-gray-900 px-6 py-4 text-left"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    {loading ? (
                      <tbody>
                        <tr>
                          <td className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <>
                              <Spinner />
                            </>
                          </td>
                        </tr>
                      </tbody>
                    ) : !orders ? (
                      <tbody>
                        <tr>
                          <td className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <>
                              <AlertStatic
                                message="No orders to show"
                                type="yellow"
                              />
                            </>
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {orders ? (
                          <>
                            {orders.orders.map((order, index) => (
                              <OrderListSingle
                                order={order}
                                index={
                                  (Number(orders.current_page) - 1) *
                                    Number(orders.per_page) +
                                  index
                                }
                                key={index}
                              />
                            ))}
                          </>
                        ) : null}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
          {orders?.total_page && orders?.total_page > 1 && (
            <div className="my-2 flex justify-center">
              <OrderPagination />
            </div>
          )}
        </>
      )}
    </div>
  );
};
type OrderListSingleType = {
  order: orderType;
  index: number;
};
const OrderListSingle: React.FC<OrderListSingleType> = ({ order, index }) => {
  return (
    <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {index + 1}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {order.title.length > 15
          ? order.title.slice(0, 15) + "..."
          : order.title}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {order.description.length > 15
          ? order.description.slice(0, 15) + "..."
          : order.description}
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {order.status && <StatusOrder status={order.status} />}
      </td>
    </tr>
  );
};
type statusOrderType = {
  status: string;
};
const StatusOrder: React.FC<statusOrderType> = ({ status }) => {
  const [statusState, setStatusState] = React.useState<{
    message: string;
    type: string;
  }>(() => {
    if (status == "REJECT") {
      return { message: "Sorry rejected", type: "red" };
    } else if (status == "LATER") {
      return { message: "Will be contact", type: "yellow" };
    } else if (status == "SUCCESS") {
      return { message: "Your order is accepted", type: "green" };
    } else {
      return { message: "Send", type: "blue" };
    }
  });
  return (
    <h1 className={`text-${statusState.type}-500`}>{statusState.message}</h1>
  );
};
