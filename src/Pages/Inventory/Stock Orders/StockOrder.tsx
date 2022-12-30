import { FC, useMemo, useState } from "react";
import Authorize from "../../../Components/Authorize/Authorize";
import CrudOrders from "./CrudOrders";
import { TbSearch } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { numberWithSpaces } from "../../../Reusable Functions/Functions";
import DatePicker from "../../../Components/Date Picker/DatePicker";
import { changeStockOrder } from "../../../Redux/Slices/InventorySlice";

type Props = {};

const StockOrder: FC<Props> = () => {
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const [crudOpen, openCrud] = useState<boolean>(false);
  const [selectedOrder, selectOrder] = useState(null);
  const [crudOption, setOption] = useState("view");
  const initialDraft = window.localStorage.getItem("stock_order_draft");
  const [orderObject, setOrderObj] = useState<any>(
    initialDraft
      ? JSON.parse(initialDraft)
      : {
          user: user,
          vendor: [],
          expected_date: "",
          notes: "",
          items: [],
          date: "",
          order_id: "",
          status: "pending",
        }
  );
  const [openDatePicker, setDateOpen] = useState<boolean>(false);
  const stock_orders_date = useSelector(
    (state: RootState) => state.Inventory.stock_orders_date
  );
  const [showAuthorize, setAuthorize] = useState<boolean>(false);
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const [search, setSearchValue] = useState<any>("");
  const fetched_stock_orders = useSelector(
    (state: RootState) => state.Inventory.stock_orders
  );
  const stock_orders = useMemo(() => {
    return fetched_stock_orders?.length >= 1
      ? fetched_stock_orders
          ?.filter(
            (data: any) =>
              !data?.isDeleted &&
              (data?.name?.toString()
                ?.toLowerCase()
                ?.replace(/\s/gim, "")
                ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.order_id?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.vendor[0]?.name?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.notes?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.user?.name?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.status?.toString()
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")))
          )
          ?.sort((a: any, b: any) => b.date - a.date)
      : [];
  }, [fetched_stock_orders, search]);

  const crudAction = (verify: any) => {
    if (verify) {
      if (crudOption === "new") {
        openCrud(true);
        setAuthorize(false);
      } else if (crudOption === "view") {
        openCrud(true);
        setAuthorize(false);
        setOrderObj(selectedOrder);
      }
    }
  };

  //Component
  return (
    <>
      <div className="w-full h-full bg-white p-4 border border-slate-200 rounded overflow-hidden">
        <div className="h-9 w-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <label htmlFor="filterOrders" className="relative w-fit h-fit">
              <TbSearch className="absolute right-2 top-2.5 text-base text-slate-500" />
              <input
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                value={search}
                type="search"
                name="filterOrders"
                id="filterOrders"
                placeholder="Filter orders ..."
                className="w-[15rem] h-9 rounded-sm border-slate-300 bg-inherit
               text-xs text-slate-500 placeholder:text-slate-500 px-2 pr-8 focus:ring-0 focus:border-cyan-750"
              />
            </label>
            <DatePicker
            
            openDatePicker={openDatePicker}
            setDateOpen={setDateOpen}
            dates={stock_orders_date}
            additionalStyles={`h-9 w-[14rem] bg-white rounded-sm border ${
              openDatePicker ? "border-cyan-750" : "border-slate-300"
            } text-xs text-slate-600`}
            localName="stock_orders_date"
            changeDate={changeStockOrder}
            parentWidth="w-fit"/>
            <button
              onClick={() => {
                setOption("new");
                setAuthorize(true);
              }}
              className="h-9 w-32 flex items-center justify-center rounded-sm
          space-x-2 font-medium uppercase text-xs text-white bg-cyan-750 outline-none 
          focus:outline-none hover:bg-cyan-800 transition-all"
            >
              <span>Create order</span>
            </button>
          </div>
        </div>

        {/**Table */}
        <div className="mt-6 w-full h-[calc(100%-3.75rem)] bg-inherit rounded relative">
          <div
            className="w-full h-12 bg-slate-50 border-y border-slate-200 grid grid-cols-12 overflow-hidden text-xs uppercase px-1
           text-slate-500"
          >
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                Order date
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                user
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                Supplier
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                Status
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                total units
              </div>
            </div>
            <div className="col-span-2 h-full overflow-hidden">
              <div className="h-full w-full flex items-center p-2 font-semibold">
                total cost
              </div>
            </div>
          </div>
          <div className="w-full h-[calc(100%-3rem)] overflow-hidden">
            {stock_orders?.length >= 1 &&
              stock_orders?.map((order: any) => {
                return (
                  <div
                    onClick={() => {
                      selectOrder(order);
                      setOption("view");
                      setAuthorize(true);
                    }}
                    key={order?.order_id}
                    className="w-full h-14 bg-white hover:bg-slate-50 cursor-pointer select-none transition-all relative
                     border-b border-slate-200 grid grid-cols-12 overflow-hidden text-xs px-1 text-slate-600 font-normal"
                  >
                    <div className="col-span-2 h-full overflow-hidden px-2 flex flex-col justify-center uppercase font-medium text-[0.65rem]">
                      <span className="text-xs">
                        {new Date(order?.date).toDateString()}
                      </span>
                    </div>
                    <div className="col-span-2 h-full overflow-hidden px-2 flex items-center capitalize font-normal">
                      {order?.user?.name}
                    </div>
                    <div className="col-span-2 h-full overflow-hidden px-2 flex items-center capitalize font-normal">
                      {order?.vendor[0]?.name}
                    </div>
                    <div className="col-span-2 h-full overflow-hidden px-2 flex items-center capitalize font-medium">
                      <div
                        className={`h-6 w-24 flex items-center justify-center rounded-full border text-[0.65rem] ${
                          order?.status === "pending"
                            ? "border-yellow-300 bg-yellow-50 text-yellow-600"
                            : "border-green-300 bg-green-50 text-green-600"
                        }`}
                      >
                        {order?.status}
                      </div>
                    </div>
                    <div className="col-span-2 h-full overflow-hidden px-2 flex items-center uppercase">
                      {order?.items
                        ?.map((data: any) => data.quantity)
                        ?.reduce((a: any, v: any) => a + v, 0)}
                    </div>
                    <div className="col-span-2 h-full overflow-hidden px-2 flex items-center uppercase font-medium">
                      {selectedCurrency?.symbol}&nbsp;
                      {numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(order?.total_cost)
                        ).toFixed(2)
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/**Auth */}
      <CrudOrders
        crudOpen={crudOpen}
        openCrud={openCrud}
        crudOption={crudOption}
        setOption={setOption}
        orderObject={orderObject}
        setOrderObj={setOrderObj}
      />

      {/**Auth */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={crudAction}
        showReason={false}
      />
    </>
  );
};

export default StockOrder;
