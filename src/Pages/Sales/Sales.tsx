import { FC, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Sale from "./Sale";
import {
  TbCaretDown,
  TbSearch,
  TbSortDescending,
  TbTrash,
  TbDownload,
} from "react-icons/tb";
import no_sales from "../../Assets/no_sales.png";
import { Link } from "react-router-dom";
import { parkSales } from "../../Redux/Slices/SalesSlice";
import ActionPanel from "../../Components/Misc/ActionPanel";
import SaleActions from "./SaleActions";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {};

const Sales: FC<Props> = () => {
  const fetched_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const parked_sales = useSelector(
    (state: RootState) => state.Sales.parked_sales
  );
  const initialView = window.localStorage.getItem("salesView");
  const initialSort = window.localStorage.getItem("salesSort");
  const [currentView, setView] = useState<any>(
    initialView ? JSON.parse(initialView) : "all sales"
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const [sortBy, setSort] = useState<string>(
    initialSort ? JSON.parse(initialSort) : "date"
  );
  const [searchValue, setSearch] = useState<any>("");
  const sales = useMemo(() => {
    let data = currentView === "all sales" ? fetched_sales : parked_sales;
    return [
      ...data?.filter(
        (data: any) =>
          !data?.isDeleted &&
          (data?.customers_details?.name
            ?.toString()
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(
              searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
            ) ||
            data?.customers_details?.email
              ?.toString()
              ?.toLowerCase()
              ?.replace(/\s/gim, "")
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.sale_channel
              ?.toString()
              ?.toLowerCase()
              ?.replace(/\s/gim, "")
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.status
              ?.toString()
              ?.toLowerCase()
              ?.replace(/\s/gim, "")
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.service
              ?.toString()
              ?.toLowerCase()
              ?.replace(/\s/gim, "")
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "") ||
                  data?.status
                    ?.toString()
                    ?.toLowerCase()
                    ?.replace(/\s/gim, "")
                    ?.includes(
                      searchValue
                        ?.toString()
                        ?.toLowerCase()
                        ?.replace(/\s/gim, "")
                    )
              ) ||
            data?.transact_id
              ?.toString()
              ?.toLowerCase()
              ?.replace(/\s/gim, "")
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.products
              ?.map((prod: any) =>
                prod?.prod_obj?.name
                  ?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
              )
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.products
              ?.map((prod: any) =>
                prod?.prod_obj?.category
                  ?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
              )
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ) ||
            data?.products
              ?.map((prod: any) =>
                prod?.prod_obj?.payment_method
                  ?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
              )
              ?.includes(
                searchValue?.toString()?.toLowerCase()?.replace(/\s/gim, "")
              ))
      ),
    ]?.sort((a: any, b: any) => (a[sortBy] > b[sortBy] ? -1 : 1));
  }, [fetched_sales, parked_sales, searchValue, currentView, sortBy]);
  const [markedArray, markItem] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [openPanel, setActionPanel] = useState<boolean>(false);
  const [showActions, setActions] = useState<boolean>(false);
  const [currentSale, setCurrentSale] = useState<any>();
  const [statsData, setStats] = useState<any>(null);

  //Send Data to A service worker for filtering ====
  const worker = useMemo(
    (): any =>
      new Worker(new URL("../../Workers/SalesWorker", import.meta.url)),
    []
  );

  useEffect(() => {
    worker.postMessage({
      sales: sales,
    });
  }, [worker, sales]);

  //Receive data from Worker
  useEffect((): any => {
    return (worker.onmessage = (msg: any) => {
      setStats(msg?.data?.stats_data);
    });
  }, [worker]);

  //Delete parked cart
  const deleteParked = () => {
    markedArray.forEach((sale: any) => {
      if (currentView === "parked sales") {
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
        markItem([]);
      }
    });
  };

  //Component ==========
  return (
    <>
      <div className="w-full h-full overflow-hidden px-[2.5%] py-4 bg-slate-100 flex flex-col space-y-4">
        {/**Top Nav ============ */}
        <div className="h-10 w-full grid grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-2 h-full flex items-center space-x-4">
            {markedArray?.length >= 1 && currentView === "parked sales" && (
              <button
                onClick={() => {
                  setActionPanel(true);
                }}
                className="h-10 w-12 flex items-center justify-center 
          space-x-2 rounded border border-slate-200 hover:border-red-750 bg-white font-semibold uppercase 
          text-xs text-slate-600 hover:text-red-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-red-50 transition-all"
              >
                <TbTrash className="text-xl" />
              </button>
            )}
            {markedArray?.length >= 1 && currentView === "all sales" && (
              <button
                onClick={() => {}}
                className="h-10 w-12 flex items-center justify-center 
          space-x-2 rounded border border-slate-200 hover:border-red-750 bg-white font-semibold uppercase 
          text-xs text-slate-600 hover:text-red-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-red-50 transition-all"
              >
                <TbDownload className="text-xl" />
              </button>
            )}
            <label
              htmlFor="sale_search"
              className={`${
                markedArray?.length >= 1 && currentView === "parked sales"
                  ? "w-[calc(100%-7rem)]"
                  : "w-full"
              } relative h-fit overflow-hidden`}
            >
              <input
                onChange={(e) => {
                  setSearch(e.target.value?.toString());
                }}
                value={searchValue}
                type="search"
                autoComplete="off"
                name="sale_search"
                id="sale_search"
                placeholder="Quick Search ..."
                className="h-10 w-full bg-white rounded border border-slate-200
               px-3 pr-8 focus:ring-0 focus:border-cyan-750 text-xs text-slate-500 placeholder:text-slate-400"
              />
              <TbSearch className="absolute right-3 top-3 text-lg text-slate-500" />
            </label>
          </div>

          <div
            className="rounded h-full col-span-1 bg-white relative 
           border border-slate-200 hover:border-cyan-750 transition-all
            flex items-center justify-between px-3 text-xs text-slate-500 font-medium cursor-pointer group"
          >
            <span className="uppercase text-[0.65rem]">{currentView}</span>
            <TbCaretDown className="text-lg group-hover:-rotate-180 transition-all" />
            <div
              className="absolute bg-slate-50 border border-slate-300
          left-0 right-0 top-[2.45rem] rounded shadow-xl w-full h-fit p-2 z-[99] hidden group-hover:flex flex-col"
            >
              <button
                onClick={() => {
                  setView("all sales");
                  window.localStorage.setItem(
                    "salesView",
                    JSON.stringify("all sales")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white border-b border-slate-300 text-left"
              >
                All Sales
              </button>
              <button
                onClick={() => {
                  setView("parked sales");
                  window.localStorage.setItem(
                    "salesView",
                    JSON.stringify("parked sales")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white text-left"
              >
                Parked Sales
              </button>
            </div>
          </div>

          <div
            className="rounded h-full col-span-1 bg-white relative 
           border border-slate-200 hover:border-cyan-750 transition-all
            hidden lg:flex items-center justify-between px-3 text-[0.65rem] text-slate-500 font-medium cursor-pointer group"
          >
            <span className="uppercase text-[0.65rem]">User</span>
            <TbCaretDown className="text-lg group-hover:-rotate-180 transition-all" />
            <div
              className="absolute bg-slate-50 border border-slate-300
          left-0 right-0 top-[2.45rem] rounded shadow-xl w-full h-fit p-2 z-[99] hidden group-hover:flex flex-col"
            >
              <button
                onClick={() => {}}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                test user
              </button>
            </div>
          </div>

          <div
            className="rounded h-full col-span-1 bg-white relative 
           border border-slate-200 hover:border-cyan-750 transition-all
            hidden lg:flex items-center justify-between px-3 text-[0.65rem] text-slate-500 font-medium cursor-pointer group"
          >
            <span className="uppercase text-[0.65rem]">one day</span>
            <TbCaretDown className="text-lg group-hover:-rotate-180 transition-all" />
            <div
              className="absolute bg-slate-50 border border-slate-300
          left-0 right-0 top-[2.45rem] rounded shadow-xl w-full h-fit p-2 z-[99] hidden group-hover:flex flex-col"
            >
              <button
                onClick={() => {}}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                one week
              </button>
              <button
                onClick={() => {}}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                one month
              </button>
              <button
                onClick={() => {}}
                className="w-full h-8 outline-none focus:outline-none px-1 text-[0.65rem] text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                Custom Date
              </button>
            </div>
          </div>

          <div
            className="rounded h-full col-span-1 bg-white relative 
           border border-slate-200 hover:border-cyan-750 transition-all
            hidden lg:flex items-center justify-between px-3 text-[0.65rem] text-slate-500 font-medium cursor-pointer group"
          >
            <span className="uppercase [0.65rem]">
              {sortBy === "date" && "Sort by"} {sortBy}
            </span>
            <TbSortDescending className="text-lg group-hover:-rotate-180 transition-all" />
            <div
              className="absolute bg-slate-50 border border-slate-300
          left-0 right-0 top-[2.45rem] rounded shadow-xl w-full h-fit p-2 z-[99] hidden group-hover:flex flex-col"
            >
              <button
                onClick={() => {
                  setSort("date");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("date")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                date
              </button>
              <button
                onClick={() => {
                  setSort("total");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("total")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                amount
              </button>
              <button
                onClick={() => {
                  setSort("profit");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("profit")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                profit
              </button>
              <button
                onClick={() => {
                  setSort("status");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("status")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                status
              </button>
              <button
                onClick={() => {
                  setSort("sale_channel");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("sale_channel")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                sales channel
              </button>
              <button
                onClick={() => {
                  setSort("payment method");
                  window.localStorage.setItem(
                    "salesSort",
                    JSON.stringify("payment method")
                  );
                }}
                className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
            hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
              >
                Payment Method
              </button>
            </div>
          </div>
        </div>
        {/**Top Nav ============ */}

        {/**Stats ============ */}
        <div className="w-full h-fit overflow-hidded grid grid-cols-3 lg:grid-cols-6 gap-4">
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {selectedCurrency?.symbol}&nbsp;
              {statsData?.sales_turnover
                ? numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(statsData?.sales_turnover)
                    ).toFixed(2)
                  )
                : "0.00"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Sales Turnover
            </span>
          </div>
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {statsData?.sales_count < 10 ? "0" : ""}
              {statsData?.sales_count ?? "0"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Sales Count
            </span>
          </div>
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {selectedCurrency?.symbol}&nbsp;
              {statsData?.net_profit
                ? numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(statsData?.net_profit)
                    ).toFixed(2)
                  )
                : "0.00"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Net Profit
            </span>
          </div>
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {selectedCurrency?.symbol}&nbsp;
              {statsData?.tips_amount
                ? numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(statsData?.tips_amount)
                    ).toFixed(2)
                  )
                : "0.00"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Tips Amount
            </span>
          </div>
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {selectedCurrency?.symbol}&nbsp;
              {statsData?.refunds_amount
                ? numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(statsData?.refunds_amount)
                    ).toFixed(2)
                  )
                : "0.00"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Refunds Amount
            </span>
          </div>
          <div
            className="col-span-1 h-20 px-6 bg-white rounded border
           border-slate-200 p-4 flex flex-col justify-center space-y-0 overflow-hidden"
          >
            <span className="text-base font-bold text-slate-700">
              {statsData?.refunds_count < 10 ? "0" : ""}
              {statsData?.refunds_count ?? "0"}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-500">
              Refunds Count
            </span>
          </div>
        </div>

        {/**Sales Table */}
        <div className="w-full h-[calc(100%-19rem)] md:h-[calc(100%-8.5rem)] bg-white border border-slate-200 rounded overflow-hidden">
          <div className="h-12 w-full bg-slate-50 border-b border-slate-200 grid grid-cols-5 md:grid-cols-12 gap-1 text-slate-500">
            <div className="h-full col-span-1 overflow-hidden px-1 flex items-center justify-center text-ellipsis whitespace-nowrap">
              <input
                type="checkbox"
                name="select_all"
                id="select_all"
                className="rounded h-4 w-4 border-slate-400"
                checked={
                  markedArray?.length === sales.length &&
                  markedArray?.length >= 1
                    ? true
                    : false
                }
                onChange={(e: any) => {
                  if (e.target.checked === true) {
                    markItem(sales);
                  } else {
                    markItem([]);
                  }
                }}
              />
            </div>
            <div
              className="h-full col-span-2 overflow-hidden px-1 flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              customer's Name
            </div>
            <div
              className="h-full col-span-3 overflow-hidden px-1 hidden md:flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              payment date
            </div>
            <div
              className="h-full col-span-2 overflow-hidden hidden md:flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              Payment Method
            </div>
            <div
              className="h-full col-span-2 overflow-hidden hidden md:flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              Status
            </div>
            <div
              className="h-full col-span-1 overflow-hidden flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              Amount
            </div>
            <div
              className="h-full col-span-1 overflow-hidden flex items-center 
          text-xs font-bold text-ellipsis whitespace-nowrap uppercase"
            >
              Profit
            </div>
          </div>
          <div className="w-full h-[calc(100%-3rem)] overflow-hidden p-1 pl-0">
            <div className="w-full h-full overflow-hidden overflow-y-scroll">
              <Sale
                sales={sales}
                currentView={currentView}
                markItem={markItem}
                markedArray={markedArray}
                setActions={setActions}
                setCurrentSale={setCurrentSale}
                currentSale={currentSale}
              />
              {sales?.length <= 0 && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
                  <img
                    src={no_sales}
                    alt="no_sales"
                    className="h-16 w-16 overflow-hidden opacity-60"
                  />
                  <span className="text-sm text-slate-400 font-medium text-center">
                    You currently have no sales recorded, <br />
                    Visit the POS or campaigns page to increase your sales
                  </span>
                  <Link to="/app">
                    <div
                      className="h-9 w-36 whitespace-nowrap bg-cyan-750 hover:bg-cyan-800 transition-all 
              text-white text-xs text-center font-medium
               capitalize flex items-center justify-center rounded-sm"
                    >
                      Point of sale
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/**Sales Actions Overlay */}
      {showActions && currentSale && (
        <SaleActions
          showActions={showActions}
          setActions={setActions}
          setCurrentSale={setCurrentSale}
          currentSale={currentSale}
        />
      )}
      {/**Delete Action Prompt */}
      <ActionPanel
        openPanel={openPanel}
        setActionPanel={setActionPanel}
        deleteSelected={deleteParked}
        option="Praked Sale"
      />
    </>
  );
};

export default Sales;
