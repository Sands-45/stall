import { FC, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addStock_Orders,
  addStock_OrdersLocal,
} from "../../../Redux/Slices/InventorySlice";
import { updateAlert } from "../../../Redux/Slices/NotificationsSlice";
import { AppDispatch, RootState } from "../../../Redux/store";
import { numberWithSpaces } from "../../../Reusable Functions/Functions";

type Props = {
  crudOpen: any;
  openCrud: any;
};

const CrudOrders: FC<Props> = ({ crudOpen, openCrud }) => {
  const dispatch: AppDispatch = useDispatch();
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const currencies = useSelector(
    (state: RootState) => state.SettingsData.currencies
  );
  const [amountCurrency, setAmountCurrency] = useState<any>(
    selectedCurrency ?? {
      name: "usd",
      symbol: "$",
      rate_multiplier: 1,
    }
  );
  const stock_orders = useSelector(
    (state: RootState) => state.Inventory.stock_orders
  );
  const stock_orders_changes = useSelector(
    (state: RootState) => state.Inventory.stock_orders_changes
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const fetched_inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
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
        }
  );
  const [itemObj, setItem] = useState<any>({
    product_obj: null,
    quantity: "",
    price: "",
  });
  const [searchProduct, setSearchValue] = useState<any>("");
  const inventory_data = useMemo(() => {
    return [...fetched_inventory_data]
      .filter(
        (data: any) =>
          data?.name
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(searchProduct?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.product_id
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(searchProduct?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.category
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(searchProduct?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.description
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(searchProduct?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.price_in_usd
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(searchProduct?.toLowerCase()?.replace(/\s/gim, ""))
      )
      ?.slice(0, 3);
  }, [searchProduct, fetched_inventory_data]);

  //Place Oders
  const createOrder = () => {
    //Generate Unique ID
    let uniqueID = () => {
      let name = user?.name?.replace(/[^a-zA-Z]|\s/gi, "");
      let combined = `#${
        name?.split("")?.slice(0, 4)?.join("")?.toUpperCase() +
        new Date().getFullYear().toString().slice(2, 4) +
        new Date().toISOString().slice(5, 7) +
        new Date().toISOString().slice(8, 10) +
        "-" +
        new Date().getMilliseconds()?.toString()?.charAt(0) +
        new Date().toISOString().slice(11, 13) +
        new Date().toISOString().slice(14, 16) +
        new Date().toISOString().slice(17, 19)
      }`;
      return combined?.replace(/\s/g, "");
    };

    if (orderObject?.vendor?.length <= 0 || orderObject?.items?.length <= 0) {
      dispatch(
        updateAlert([
          ...alerts,
          {
            message: "Please make sure all fields are filled",
            id: new Date()?.getTime(),
            color: "bg-red-200",
          },
        ])
      );
    } else {
      dispatch(
        addStock_Orders([
          ...stock_orders,
          {
            ...orderObject,
            user: user,
            order_id: uniqueID(),
            date: new Date()?.getTime(),
            total_cost: Number(
              orderObject?.items
                ?.map((data: any) => data?.amount)
                ?.reduce((a: any, v: any) => a + v, 0)
            ),
          },
        ])
      );

      //Save Changes
      dispatch(
        addStock_OrdersLocal([
          ...stock_orders_changes,
          {
            ...orderObject,
            user: user,
            order_id: uniqueID(),
            date: new Date()?.getTime(),
            total_cost: Number(
              orderObject?.items
                ?.map((data: any) => data?.amount)
                ?.reduce((a: any, v: any) => a + v, 0)
            ),
          },
        ])
      );

      //Save Local
      window.localStorage.setItem(
        "stock_orders",
        JSON.stringify([
          ...stock_orders,
          {
            ...orderObject,
            user: user,
            order_id: uniqueID(),
            date: new Date()?.getTime(),
            total_cost: Number(
              orderObject?.items
                ?.map((data: any) => data?.amount)
                ?.reduce((a: any, v: any) => a + v, 0)
            ),
          },
        ])
      );

      window.localStorage.setItem(
        "stock_orders_changes",
        JSON.stringify([
          ...stock_orders_changes,
          {
            ...orderObject,
            user: user,
            order_id: uniqueID(),
            date: new Date()?.getTime(),
            total_cost: Number(
              orderObject?.items
                ?.map((data: any) => data?.amount)
                ?.reduce((a: any, v: any) => a + v, 0)
            ),
          },
        ])
      );

      setOrderObj({
        user: user,
        vendor: [],
        expected_date: "",
        notes: "",
        items: [],
        date: "",
        order_id: "",
      });

      window.localStorage.setItem(
        "stock_order_draft",
        JSON.stringify({
            user: user,
            vendor: [],
            expected_date: "",
            notes: "",
            items: [],
            date: "",
            order_id: "",
          })
      )
      openCrud(false);
    }
  };

  //Component ========
  return (
    <div
      className={`fixed left-0 right-0 transition-all bg-white z-[9999] ${
        crudOpen ? "top-0 bottom-0" : "-top-[200%]"
      } p-4 items-end overflow-hidden`}
    >
      <div className="w-full h-14 pb-4 flex justify-between items-center border-b border-slate-200">
        <button
          onClick={() => {
            openCrud(false);
          }}
          className="h-10 w-10 bg-slate-50 text-xl text-slate-600 focus:outline-none
        font-medium border border-slate-200 hover:bg-slate-100 transition-all rounded"
        >
          &times;
        </button>
        <div className="w-fit h-fit flex space-x-3">
          <button
            onClick={() => {
              window.localStorage.setItem(
                "stock_order_draft",
                JSON.stringify(orderObject)
              );
              openCrud(false);
            }}
            className="h-10 px-4 bg-slate-50 text-slate-600
            text-xs font-medium focus:outline-none border border-slate-200 hover:bg-slate-100 transition-all rounded-sm"
          >
            Save Draft
          </button>
          <button
            onClick={() => {
              createOrder();
            }}
            className="px-4 h-10 bg-cyan-750 text-xs text-white font-medium
         rounded-sm outline-none focus:outline-none"
          >
            Place Order
          </button>
        </div>
      </div>

      <div
        className="w-full flex flex-col items-center space-y-6 p-4 pt-10 overflow-hidden
       overflow-y-sroll no-scrollbar no-scrollbar::-webkit-scrollbar"
      >
        {/**Order Details */}
        <div className="w-[45rem] h-fit">
          <span className="text-sm uppercase text-slate-700 font-semibold">
            Order Details
          </span>
          <div className="mt-2 w-full h-36 border border-slate-300 overflow-hidden">
            <div className="w-full h-12 border-b last:border-0 border-slate-200 grid grid-cols-10">
              <div
                className="col-span-3 h-full border-r border-slate-200 overflow-hidden bg-slate-50
                 px-2 flex items-center text-xs text-slate-600 capitalize font-medium"
              >
                vendor
              </div>
              <div className="h-full col-span-7 px-2 flex items-center text-xs text-slate-600 capitalize relative group">
                {orderObject?.vendor?.length <= 0 && (
                  <>
                    <input
                      type="search"
                      name="vendor search"
                      id="vendor search"
                      placeholder="Search for a vender ..."
                      className="h-full w-full text-xs text-slate-600 bg-inherit
                 placeholder:text-slate-400 px-2 border-0 focus:ring-0 focus:outline-none"
                    />
                    <ul
                      className="absolute top-[2.95rem] left-1 right-1 min-h-[3rem]
                 bg-slate-50 border border-slate-300 shadow-lg p-2 hidden group-hover:flex flex-col"
                    >
                      <li
                        onClick={() => {
                          setOrderObj((prev: any) => ({
                            ...prev,
                            vendor: [{ name: "test vendor" }],
                          }));
                        }}
                        className="w-full h-8 text-xs font-medium
                   text-slate-600 capitalize border-b last:border-0
                    border-slate-200 flex items-center cursor-pointer select-none"
                      >
                        Test vendor
                      </li>
                    </ul>
                  </>
                )}
                {orderObject?.vendor?.length >= 1 && (
                  <div
                    className="capitalize text-xs text-slate-600 relative 
                  w-full h-full flex justify-between items-center px-2"
                  >
                    <span>{orderObject?.vendor[0]?.name}</span>
                    <div
                      onClick={() => {
                        setOrderObj((prev: any) => ({
                          ...prev,
                          vendor: [],
                        }));
                      }}
                      className="text-red-600 text-xl font-semibold
                     select-none cursor-pointer"
                    >
                      &times;
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full h-12 border-b last:border-0 border-slate-200 grid grid-cols-10">
              <div
                className="col-span-3 h-full border-r border-slate-200 overflow-hidden bg-slate-50
                 px-2 flex items-center text-xs text-slate-600 capitalize font-medium"
              >
                Expected Arrival Date
              </div>
              <div className="h-full col-span-7 flex items-center text-slate-600 lowercase overflow-hidden">
                <input
                  onChange={(e) => {
                    setOrderObj((prev: any) => ({
                      ...prev,
                      expected_date: new Date(e.target.value)?.getTime(),
                    }));
                  }}
                  type="date"
                  name="expected_date"
                  id="expected_date"
                  className="w-full h-full px-2 border-0 focus:ring-0 text-xs"
                />
              </div>
            </div>
            <div className="w-full h-12 border-b last:border-0 border-slate-200 grid grid-cols-10">
              <div
                className="col-span-3 h-full border-r border-slate-200 overflow-hidden bg-slate-50
                 px-2 flex items-center text-xs text-slate-600 capitalize font-medium"
              >
                Notes
              </div>
              <div className="h-full col-span-7 flex items-center text-slate-600 lowercase overflow-hidden">
                <textarea
                  onChange={(e) => {
                    setOrderObj((prev: any) => ({
                      ...prev,
                      notes: e.target.value,
                    }));
                  }}
                  value={orderObject?.notes}
                  name="expected_date"
                  id="expected_date"
                  className="w-full h-full px-2 pt-3 border-0 focus:ring-0 text-xs
                   resize-none placeholder:text-slate-400 overflow-hidden"
                  placeholder="Enter notes ..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/**Products Information */}
        <div className="w-[45rem] h-fit">
          <span className="text-sm uppercase text-slate-700 font-semibold">
            Products Information
          </span>
          <div className="mt-2 w-full h-fit print:hidden flex items-center justify-between space-x-4">
            <div
              className="w-[40%] h-10 bg-slate-50 border-b border-slate-300
             hover:border-cyan-750 transition-all group relative"
            >
              {!itemObj?.product_obj && (
                <>
                  <input
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    value={searchProduct}
                    type="search"
                    name="item-searchz"
                    id="item-searchz"
                    autoComplete="off"
                    placeholder="Search for a product ..."
                    className="h-full w-full text-xs text-slate-600 bg-inherit
                 placeholder:text-slate-400 px-2 border-0 focus:ring-0 focus:outline-none"
                  />
                  <ul
                    className="absolute top-[2.5rem] left-1 right-1 min-h-[3rem] z-[99]
                 bg-slate-50 border border-slate-300 shadow-lg p-2 hidden group-hover:flex flex-col"
                  >
                    {inventory_data?.length >= 1 ? (
                      inventory_data?.map((item: any) => {
                        return (
                          <li
                            onClick={() => {
                              setItem((prev: any) => ({
                                ...prev,
                                product_obj: item,
                              }));
                            }}
                            key={item?.id_two}
                            className="w-full h-8 text-xs font-medium
                   text-slate-600 capitalize border-b last:border-0
                    border-slate-200 flex items-center cursor-pointer select-none"
                          >
                            {item?.name}
                          </li>
                        );
                      })
                    ) : (
                      <li
                        className="w-full h-8 text-xs font-medium
             text-slate-600 capitalize border-b last:border-0
              border-slate-200 flex items-center cursor-pointer select-none"
                      >
                        no results
                      </li>
                    )}
                  </ul>
                </>
              )}
              {itemObj?.product_obj && (
                <div
                  className="capitalize text-xs text-slate-600 relative 
                  w-full h-full flex justify-between items-center px-2"
                >
                  <span>{itemObj?.product_obj?.name}</span>
                  <div
                    onClick={() => {
                      setItem((prev: any) => ({
                        ...prev,
                        product_obj: null,
                      }));
                    }}
                    className="text-red-600 text-xl font-semibold
                     select-none cursor-pointer"
                  >
                    &times;
                  </div>
                </div>
              )}
            </div>
            <div className="w-[15%] h-10 bg-slate-50 border-b border-slate-300 hover:border-cyan-750 transition-all">
              <input
                onChange={(e) => {
                  setItem((prev: any) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }));
                }}
                value={itemObj?.quantity}
                type="number"
                name="orderr_item_quantity"
                id="orderr_item_quantity"
                placeholder="Quantity ..."
                className="h-full w-full text-xs text-slate-600 bg-inherit
                 placeholder:text-slate-400 px-2 border-0 focus:ring-0 focus:outline-none"
              />
            </div>
            <div
              className="w-[25%] h-10 flex bg-slate-50 border-b border-slate-300
             hover:border-cyan-750 transition-all overflow-hidden"
            >
              <input
                onChange={(e) => {
                  setItem((prev: any) => ({
                    ...prev,
                    price: e.target.value,
                  }));
                }}
                value={itemObj?.price}
                type="text"
                autoComplete="off"
                name="item_buying_price"
                id="item_buying_price"
                placeholder="Unit Price ..."
                className="h-full w-[50%] text-xs text-slate-600 bg-inherit
                 placeholder:text-slate-400 px-2 border-0 focus:ring-0 focus:outline-none"
              />
              <div className="h-full w-[50%] px-1 bg-inherit">
                <select
                  onChange={(e) => {
                    setAmountCurrency(JSON.parse(e.target.value));
                  }}
                  required
                  name="payment_currency"
                  id="payment_currency"
                  className="w-full h-full flex items-center justify-center pt-1 text-xs bg-inherit 
                  border-0 focus:border-0 focus:ring-0 focus:outline-none uppercase text-slate-700"
                >
                  {currencies?.map((currence: any) => {
                    return (
                      <option
                        key={currence.name}
                        value={JSON.stringify(currence)}
                      >
                        {currence.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="w-[15%] h-10 bg-slate-50 border-b border-slate-300 hover:border-cyan-750 transition-all">
              <button
                onClick={() => {
                  if (itemObj?.product_obj) {
                    setOrderObj((prev: any) => ({
                      ...prev,
                      items: [
                        ...prev?.items?.filter(
                          (data: any) =>
                            data?.product_obj?.id_two !==
                            itemObj?.product_obj?.id_two
                        ),
                        {
                          ...itemObj,
                          quantity: itemObj?.quantity ?? 1,
                          price:
                            (Number(itemObj?.price) ??
                              itemObj?.product_obj?.price_in_usd) /
                              amountCurrency?.rate_multiplier ?? 1,
                          amount:
                            ((Number(itemObj?.price) ??
                              itemObj?.product_obj?.price_in_usd) /
                              amountCurrency?.rate_multiplier) *
                            (itemObj?.quantity ?? 1),
                        },
                      ],
                    }));
                    setItem({
                      product_obj: null,
                      quantity: "",
                      price: "",
                    });
                  }
                }}
                className="h-full w-full text-white text-xs capitalize font-medium bg-cyan-750 rounded-sm"
              >
                Add item
              </button>
            </div>
          </div>

          <div className="mt-4 w-full h-fit">
            <div className="w-full h-12 bg-slate-50 border-y border-slate-200 grid grid-cols-10">
              <div className="col-span-4 h-full px-2 flex items-center text-xs uppercase font-semibold text-slate-500">
                Product name
              </div>
              <div className="col-span-2 h-full px-2 flex items-center text-xs uppercase font-semibold text-slate-500">
                Quantity
              </div>
              <div className="col-span-2 h-full px-2 flex items-center text-xs uppercase font-semibold text-slate-500">
                Unit Price
              </div>
              <div className="col-span-2 h-full px-2 flex items-center text-xs uppercase font-semibold text-slate-500">
                Sum
              </div>
            </div>
            <div className="w-full min-h-[3rem] border-b border-slate-200">
              {orderObject?.items?.length >= 1 &&
                orderObject?.items?.map((item: any) => {
                  return (
                    <div
                      key={item?.product_obj?.id_two}
                      className="w-full h-12 bg-white border-b last:border-0 border-slate-200 grid grid-cols-10 relative"
                    >
                      <div
                        className="col-span-4 h-full px-2 flex items-center text-xs capitalite font-normal
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item?.product_obj?.name}
                      </div>
                      <div
                        className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-normal
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item?.quantity}
                      </div>
                      <div
                        className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-normal
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {selectedCurrency?.symbol}&nbsp;
                        {numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            Number(item?.price)
                          ).toFixed(2)
                        )}
                      </div>
                      <div
                        className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-normal
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {selectedCurrency?.symbol}&nbsp;
                        {numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            Number(item?.amount)
                          ).toFixed(2)
                        )}
                      </div>
                      <div
                        onClick={() => {
                          setOrderObj((prev: any) => ({
                            ...prev,
                            items: [
                              ...prev?.items?.filter(
                                (data: any) =>
                                  data?.product_obj?.id_two !==
                                  item?.product_obj?.id_two
                              ),
                            ],
                          }));
                        }}
                        className="absolute -right-4 top-2.5 text-red-600 text-xl font-semibold select-none cursor-pointer"
                      >
                        &times;
                      </div>
                    </div>
                  );
                })}
              {/**Total */}
              <div className="w-full h-12 bg-white border-b last:border-0 border-slate-200 grid grid-cols-10">
                <div
                  className="col-span-4 h-full px-2 flex items-center text-xs capitalite font-semibold uppercase
               text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  TOTAL cost
                </div>
                <div
                  className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-medium
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                ></div>
                <div
                  className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-normal
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                ></div>
                <div
                  className="col-span-2 h-full px-2 flex items-center text-xs capitalite font-medium
               text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {orderObject?.items?.length >= 1
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(
                            orderObject?.items
                              ?.map((data: any) => data?.amount)
                              ?.reduce((a: any, v: any) => a + v, 0)
                          )
                        ).toFixed(2)
                      )
                    : "0:00"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudOrders;
