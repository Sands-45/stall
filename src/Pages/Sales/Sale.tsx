import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { parkSales } from "../../Redux/Slices/SalesSlice";
import { updateAlert } from "../../Redux/Slices/NotificationsSlice";

type Props = {
  sales: any;
  currentView: string;
  markedArray: any;
  markItem: any;
  setActions: any;
  setCurrentSale: any;
  currentSale: any;
};

const Sale: FC<Props> = ({
  sales,
  currentView,
  markedArray,
  markItem,
  setActions,
  setCurrentSale,
  currentSale,
}) => {
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

  const saleClickFunc = (sale: any) => {
    if (currentView === "parked sales") {
      window.localStorage.setItem("cart", JSON.stringify(sale));
      //Update State
      dispatch(
        parkSales([
          ...(parked_sales?.length >= 1
            ? parked_sales?.filter(
                (record: any) => record?.transact_id !== sale?.transact_id
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
                (record: any) => record?.transact_id !== sale?.transact_id
              )
            : []),
        ])
      );
      navigate("/app");
    } else {
      setActions(true);
      setCurrentSale(sale);
    }
  };

  //component
  return (
    <>
      {sales?.length >= 1 &&
        sales?.map((sale: any) => {
          return (
            <div
              key={sale?.transact_id}
              className={`h-14 w-[99.5%] m-auto border-b border-slate-200 grid grid-cols-5 md:grid-cols-12 gap-1 
    cursor-pointer hover:bg-slate-50 ${
      currentSale?.transact_id === sale?.transact_id && "bg-slate-100"
    } transition-all`}
            >
              <div className="h-full col-span-1 pr-2 overflow-hidden flex items-center justify-center text-ellipsis whitespace-nowrap">
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
                  saleClickFunc(sale);
                }}
                className="h-full col-span-2 overflow-hidden px-2 flex items-center 
          text-xs text-slate-400 font-semibold text-ellipsis whitespace-nowrap"
              >
                <div
                  className="h-9 w-9 rounded bg-cyan-900 text-white flex items-center justify-center text-lg uppercase
        "
                >
                  {sale?.customers_details?.name
                    ? sale?.customers_details?.name?.charAt(0)
                    : "U"}
                </div>
                <div className="w-[calc(100%-2.5rem)] h-full flex flex-col px-2 justify-center space-y-0">
                  <span className="text-slate-600 font-medium text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {sale?.customers_details?.name
                      ? sale?.customers_details?.name
                      : "Unkown Customer"}
                  </span>
                  <span className="font-normal text-[0.7rem] lowercase text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {sale?.customers_details?.email
                      ? sale?.customers_details?.email
                      : "no email"}
                  </span>
                </div>
              </div>
              <div
                onClick={() => {
                  saleClickFunc(sale);
                }}
                className="h-full col-span-3 overflow-hidden hidden md:flex flex-col px-2 justify-center space-y-0 
          text-xs text-slate-600 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <span className="font-normal text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {new Date(sale?.date)?.toString()?.split("(")[0]}
                </span>
                <span className="font-normal text-[0.7rem] upperrcase text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {sale?.transact_id}
                </span>
              </div>
              <div
                onClick={() => {
                  saleClickFunc(sale);
                }}
                className="h-full col-span-2 overflow-hidden hidden md:flex flex-col px-2 justify-center space-y-0 
          text-xs text-slate-600 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <span className="font-normal text-xs capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {sale?.payment_method
                    ? sale?.payment_method + " payment"
                    : "no payment"}
                </span>
                <span className="font-normal text-[0.7rem] capitalize text-slate-400 w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {sale?.service} - {sale?.sale_channel}
                </span>
              </div>
              <div
                onClick={() => {
                  saleClickFunc(sale);
                }}
                className="h-full col-span-2 overflow-hidden px-2 hidden md:flex items-center 
          text-xs text-slate-600 font-semibold text-ellipsis whitespace-nowrap uppercase"
              >
                <div
                  onClick={() => {
                    saleClickFunc(sale);
                  }}
                  className={`h-6 w-24 pt-0.5 rounded-full 
        border flex items-center justify-center capitalize
         text-[0.6rem] font-normal  ${
           sale?.status === "paid"
             ? "text-green-600 bg-green-50 border-green-200"
             : sale?.status === "exchange"
             ? "text-blue-600 bg-blue-50 border-blue-200"
             : sale?.status === "refund"
             ? "text-red-600 bg-red-50 border-red-200"
             : sale?.status === "pending"
             ? "text-yellow-600 bg-yellow-50 border-yellow-200"
             : ""
         }`}
                >
                  {sale?.status}
                </div>
              </div>
              <div
                className="h-full col-span-2 overflow-hidden px-2 flex items-center 
          text-xs text-slate-600 font-medium text-ellipsis whitespace-nowrap uppercase"
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
