import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { parkSales } from "../../Redux/Slices/SalesSlice";
import { updateAlert } from "../../Redux/Slices/NotificationsSlice";

type Props = {
  sales: any;
  currentView: string;
  markedArray: any;
  markItem: any;
};

const Sale: FC<Props> = ({ sales, currentView, markedArray, markItem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const parked_sales = useSelector(
    (state: RootState) => state.Sales.parked_sales
  );
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );

  //component
  return (
    <>
      {sales?.length >= 1 &&
        sales?.map((sale: any) => {
          return (
            <div
              key={sale?.transact_id}
              className="h-14 w-full border-b border-slate-200 grid grid-cols-12 gap-1 
    cursor-pointer hover:bg-slate-50 transition-all"
            >
              <div className="h-full col-span-1 overflow-hidden flex items-center justify-center text-ellipsis whitespace-nowrap">
                <input
                  type="checkbox"
                  name="select_all"
                  id="select_all"
                  className="rounded-sm h-3 w-3 border-slate-400"
                  checked={
                    markedArray?.some(
                      (data: any) => data?.transact_id === sale?.transact_id
                    )
                      ? true
                      : false
                  }
                  onChange={(e: any) => {
                    if (e.target.checked === true) {
                      if (
                        markedArray?.some(
                          (data: any) => data?.transact_id === sale?.transact_id
                        )
                      ) {
                        dispatch(
                          updateAlert([
                            ...alerts,
                            {
                              message: "Item is already selected",
                              color: "bg-green-200",
                              id: new Date().getTime(),
                            },
                          ])
                        );
                      } else {
                        markItem((prev: any) => [...prev, sale]);
                      }
                    } else {
                      markItem((prev: any) => [
                        ...prev?.filter(
                          (data: any) => data?.transact_id !== sale?.transact_id
                        ),
                      ]);
                    }
                  }}
                />
              </div>
              <div
              onClick={() => {
                if (currentView === "parked sales") {
                  window.localStorage.setItem("cart", JSON.stringify(sale));
                  //Update State
                  dispatch(
                    parkSales([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  //Save Data Locally
                  window.localStorage.setItem(
                    "parked_sales",
                    JSON.stringify([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  navigate("/app");
                }
              }}
                className="h-full col-span-3 overflow-hidden px-2 flex items-center 
          text-xs text-slate-500 font-semibold text-ellipsis whitespace-nowrap"
              >
                <div
                  className="h-9 w-9 rounded bg-slate-200 flex items-center justify-center text-base uppercase
        border border-slate-300"
                >
                  {sale?.customers_details?.name
                    ? sale?.customers_details?.name?.charAt(0)
                    : "U"}
                </div>
                <div className="w-[calc(100%-2.5rem)] h-full flex flex-col px-2 justify-center space-y-0">
                  <span className="font-medium text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {sale?.customers_details?.name
                      ? sale?.customers_details?.name
                      : "Unkown Customer"}
                  </span>
                  <span className="font-medium text-[0.65rem] lowercase text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {sale?.customers_details?.email
                      ? sale?.customers_details?.email
                      : "no email"}
                  </span>
                </div>
              </div>
              <div
              onClick={() => {
                if (currentView === "parked sales") {
                  window.localStorage.setItem("cart", JSON.stringify(sale));
                  //Update State
                  dispatch(
                    parkSales([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  //Save Data Locally
                  window.localStorage.setItem(
                    "parked_sales",
                    JSON.stringify([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  navigate("/app");
                }
              }}
                className="h-full col-span-3 overflow-hidden flex flex-col px-2 justify-center space-y-0 
          text-xs text-slate-500 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <span className="font-medium text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {new Date(sale?.date)?.toString()?.split("(")[0]}
                </span>
                <span className="font-medium text-[0.65rem] upperrcase text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  ID - {sale?.transact_id}
                </span>
              </div>
              <div
              onClick={() => {
                if (currentView === "parked sales") {
                  window.localStorage.setItem("cart", JSON.stringify(sale));
                  //Update State
                  dispatch(
                    parkSales([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  //Save Data Locally
                  window.localStorage.setItem(
                    "parked_sales",
                    JSON.stringify([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  navigate("/app");
                }
              }}
                className="h-full col-span-2 overflow-hidden flex flex-col px-2 justify-center space-y-0 
          text-xs text-slate-500 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <span className="font-medium text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {sale?.sale_channel}
                </span>
                <span className="font-medium text-[0.65rem] capitalize text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {sale?.service}
                </span>
              </div>
              <div
              onClick={() => {
                if (currentView === "parked sales") {
                  window.localStorage.setItem("cart", JSON.stringify(sale));
                  //Update State
                  dispatch(
                    parkSales([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  //Save Data Locally
                  window.localStorage.setItem(
                    "parked_sales",
                    JSON.stringify([
                      ...(parked_sales?.length >= 1
                        ? parked_sales?.filter(
                            (record: any) =>
                              record?.transact_id !== sale?.transact_id
                          )
                        : []),
                    ])
                  );
                  navigate("/app");
                }
              }}
                className="h-full col-span-2 overflow-hidden px-2 flex items-center 
          text-xs text-slate-500 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <div
                  className={`h-6 w-fit px-4 rounded-full 
        border flex items-center justify-center capitalize
         text-[0.6rem] font-medium  ${
           sale?.status === "completed"
             ? "text-green-600 bg-green-100 border-green-300"
             : sale?.status === "exchange"
             ? "text-blue-600 bg-blue-100 border-blue-300"
             : sale?.status === "refund"
             ? "text-red-600 bg-red-100 border-red-300"
             : sale?.status === "pending"
             ? "text-yellow-600 bg-yellow-100 border-yellow-300"
             : ""
         }`}
                >
                  {sale?.status}
                </div>
              </div>
              <div
                className="h-full col-span-1 overflow-hidden px-2 flex items-center 
          text-xs text-slate-500 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                {selectedCurrency?.symbol}&nbsp;
                {numberWithSpaces(
                  (
                    selectedCurrency?.rate_multiplier * Number(sale?.total)
                  ).toFixed(2)
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Sale;
