import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { addSales } from "../../Redux/Slices/SalesSlice";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../Redux/Slices/InventorySlice";
import { updateFloat } from "../../Redux/Slices/SalesSlice";
import Authorize from "../../Components/Authorize/Authorize";

type Props = {
  showRefund: boolean;
  openRefund: any;
  currentSale: any;
  setActions: any;
};

const Refund: FC<Props> = ({
  showRefund,
  openRefund,
  currentSale,
  setActions,
}) => {
  const dispatch = useDispatch();
  const [currentType, setType] = useState<string>("amount");
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const completed_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const [markedItems, markItem] = useState<any>([]);
  const [reason, setReason] = useState<string>("");
  const [refundAmount, setAmount] = useState<any>("");
  const [showAuthorize, setAuthorize] = useState<boolean>(false);

  const processRefund = (verify: any) => {
    if (verify) {
      if (currentType === "item") {
        if (
          currentSale?.payment_method === "cash" &&
          currentSale?.status === "paid"
        ) {
          //Remove Selected Items From Sale Product List
          let tempProduct_Array: any[] = [];
          let letRefunded_Array: any[] = [];
          markedItems?.forEach((prod: any) => {
            tempProduct_Array =
              [...currentSale?.products]?.filter(
                (data: any) =>
                  data?.prod_cart_uid === prod?.prod_cart_uid &&
                  Number(data.quantity) !== Number(prod?.quantity)
              )?.length >= 1
                ? [
                    ...tempProduct_Array,
                    {
                      ...[...currentSale?.products]?.filter(
                        (data: any) =>
                          data?.prod_cart_uid === prod?.prod_cart_uid &&
                          Number(data.quantity) !== Number(prod?.quantity)
                      )[0],
                      quantity: Number(prod?.quantity),
                    },
                  ]
                : [...tempProduct_Array];

            //Add Selected Items To thr Returned Product List
            letRefunded_Array =
              [...currentSale?.products]?.filter(
                (data: any) =>
                  data?.prod_cart_uid === prod?.prod_cart_uid &&
                  (Number(data.quantity) === Number(prod?.quantity) ||
                    Number(data.quantity) > Number(prod?.quantity))
              )?.length >= 1
                ? [
                    ...letRefunded_Array,
                    {
                      ...[...currentSale?.products]?.filter(
                        (data: any) =>
                          data?.prod_cart_uid === prod?.prod_cart_uid &&
                          (Number(data.quantity) === Number(prod?.quantity) ||
                            Number(data.quantity) > Number(prod?.quantity))
                      )[0],
                      quantity: Number(prod?.quantity),
                    },
                  ]
                : [...letRefunded_Array];
          });

          //Calculate cost of refund
          let total =
            tempProduct_Array.length <= 0
              ? [...markedItems]
                  ?.map(
                    (prod: any) => prod?.prod_obj?.price_in_usd * prod?.quantity
                  )
                  ?.reduce(
                    (acc: any, value: any) => Number(acc) + Number(value),
                    0
                  )
              : tempProduct_Array.length >= 1
              ? currentSale?.total -
                [...tempProduct_Array]
                  ?.map(
                    (prod: any) => prod?.prod_obj?.price_in_usd * prod?.quantity
                  )
                  ?.reduce(
                    (acc: any, value: any) => Number(acc) + Number(value),
                    0
                  )
              : 0.0;

          //New Sale Object with updated values
          let newCart = {
            ...currentSale,
            total: currentSale?.total - total,
            refund_amount: total,
            refund_date: new Date()?.getTime(),
            not_eligable_for_refund: true,
            refund_reason: reason,
            products: tempProduct_Array,
            refunded_products: letRefunded_Array,
            status: "refund",
          };

          //Update State
          dispatch(
            addSales([
              ...(completed_sales?.length >= 1
                ? completed_sales?.filter(
                    (record: any) =>
                      record?.transact_id !== newCart?.transact_id
                  )
                : []),
              {
                ...newCart,
              },
            ])
          );

          //Save Data Locally
          window.localStorage.setItem(
            "completed_sales",
            JSON.stringify([
              ...(completed_sales?.length >= 1
                ? completed_sales?.filter(
                    (record: any) =>
                      record?.transact_id !== newCart?.transact_id
                  )
                : []),
              {
                ...newCart,
              },
            ])
          );

          //Restore Stock to Inventory
          tempProduct_Array.length >= 1 &&
            tempProduct_Array?.forEach((prod: any) => {
              window.localStorage.setItem(
                "inventory_data",
                JSON.stringify([
                  ...inventory_data?.filter(
                    (data: any) => data?.id_two !== prod?.prod_obj?.id_two
                  ),
                  {
                    ...prod?.prod_obj,
                    in_stock:
                      Number(
                        [...inventory_data]?.filter(
                          (data: any) => data?.id_two === prod?.prod_obj?.id_two
                        )[0]?.in_stock
                      ) + Number(prod?.quantity),
                    last_editedAt: new Date().getTime(),
                  },
                ])
              );

              window.localStorage.setItem(
                "inventory_changes_data",
                JSON.stringify([
                  ...inventory_data_queue?.filter(
                    (data: any) => data?.id_two !== prod?.prod_obj?.id_two
                  ),
                  {
                    ...prod?.prod_obj,
                    in_stock:
                      Number(
                        [...inventory_data]?.filter(
                          (data: any) => data?.id_two === prod?.prod_obj?.id_two
                        )[0]?.in_stock
                      ) + Number(prod?.quantity),
                    last_editedAt: new Date().getTime(),
                    edit: true,
                  },
                ])
              );

              dispatch(
                loadInventoryData([
                  ...inventory_data?.filter(
                    (data: any) => data?.id_two !== prod?.prod_obj?.id_two
                  ),
                  {
                    ...prod?.prod_obj,
                    in_stock:
                      Number(
                        [...inventory_data]?.filter(
                          (data: any) => data?.id_two === prod?.prod_obj?.id_two
                        )[0]?.in_stock
                      ) + Number(prod?.quantity),
                    last_editedAt: new Date().getTime(),
                  },
                ])
              );

              dispatch(
                updateLocalInventory_Changes([
                  ...inventory_data_queue?.filter(
                    (data: any) => data?.id_two !== prod?.prod_obj?.id_two
                  ),
                  {
                    ...prod?.prod_obj,
                    in_stock:
                      Number(
                        [...inventory_data]?.filter(
                          (data: any) => data?.id_two === prod?.prod_obj?.id_two
                        )[0]?.in_stock
                      ) + Number(prod?.quantity),
                    last_editedAt: new Date().getTime(),
                    edit: true,
                  },
                ])
              );
            });

          //Update Cash Float
          let openFloat =
            cash_float?.filter((data: any) => data.status === "open")[0] ??
            null;
          if (openFloat && currentSale?.payment_method === "cash") {
            dispatch(
              updateFloat([
                ...cash_float.filter(
                  (data: any) => data.id_two !== openFloat?.id_two
                ),
                {
                  ...openFloat,
                  total: Number(openFloat?.total) - total,
                  refunds: Number(openFloat?.refunds) + total,
                  activities: [
                    ...openFloat?.activities,
                    {
                      note: "Cash Sale Refund",
                      amount: "-" + total,
                      time: new Date()?.getTime(),
                      currency: selectedCurrency?.name,
                    },
                  ],
                  edited: true,
                },
              ])
            );

            //Save Cash Float Local local
            window.localStorage.setItem(
              "cash_float",
              JSON.stringify([
                ...cash_float.filter(
                  (data: any) => data.id_two !== openFloat?.id_two
                ),
                {
                  ...openFloat,
                  total: Number(openFloat?.total) - total,
                  gross: Number(openFloat?.gross) - total,
                  activities: [
                    ...openFloat?.activities,
                    {
                      note: "Cash Sale Refund",
                      amount: "-" + total,
                      time: new Date()?.getTime(),
                    },
                  ],
                  edited: true,
                },
              ])
            );
          }
          setReason("");
          setType("amount");
          openRefund(false);
          markItem([]);
          setAuthorize(false);
          setActions(false);
        }
      } else if (currentType === "amount") {
        if (
          currentSale?.payment_method === "cash" &&
          currentSale?.status === "paid"
        ) {
          //New Sale Object with updated values
          let newCart = {
            ...currentSale,
            total:
              currentSale?.total -
              refundAmount / selectedCurrency?.rate_multiplier,
            refund_amount: refundAmount / selectedCurrency?.rate_multiplier,
            refund_date: new Date()?.getTime(),
            not_eligable_for_refund: true,
            refund_reason: reason,
            status: "refund",
          };

          //Update State
          dispatch(
            addSales([
              ...(completed_sales?.length >= 1
                ? completed_sales?.filter(
                    (record: any) =>
                      record?.transact_id !== newCart?.transact_id
                  )
                : []),
              {
                ...newCart,
              },
            ])
          );

          //Save Data Locally
          window.localStorage.setItem(
            "completed_sales",
            JSON.stringify([
              ...(completed_sales?.length >= 1
                ? completed_sales?.filter(
                    (record: any) =>
                      record?.transact_id !== newCart?.transact_id
                  )
                : []),
              {
                ...newCart,
              },
            ])
          );

          //Update Cash Float
          let openFloat =
            cash_float?.filter((data: any) => data.status === "open")[0] ??
            null;
          if (openFloat && currentSale?.payment_method === "cash") {
            dispatch(
              updateFloat([
                ...cash_float.filter(
                  (data: any) => data.id_two !== openFloat?.id_two
                ),
                {
                  ...openFloat,
                  total:
                    Number(openFloat?.total) -
                    refundAmount / selectedCurrency?.rate_multiplier,
                  refunds:
                    Number(openFloat?.refunds) +
                    refundAmount / selectedCurrency?.rate_multiplier,
                  activities: [
                    ...openFloat?.activities,
                    {
                      note: "Cash Sale Refund",
                      amount:
                        "-" + refundAmount / selectedCurrency?.rate_multiplier,
                      time: new Date()?.getTime(),
                      currency: selectedCurrency?.name,
                    },
                  ],
                  edited: true,
                },
              ])
            );

            //Save Cash Float Local local
            window.localStorage.setItem(
              "cash_float",
              JSON.stringify([
                ...cash_float.filter(
                  (data: any) => data.id_two !== openFloat?.id_two
                ),
                {
                  ...openFloat,
                  total:
                    Number(openFloat?.total) -
                    refundAmount / selectedCurrency?.rate_multiplier,
                  gross:
                    Number(openFloat?.gross) -
                    refundAmount / selectedCurrency?.rate_multiplier,
                  activities: [
                    ...openFloat?.activities,
                    {
                      note: "Cash Sale Refund",
                      amount:
                        "-" + refundAmount / selectedCurrency?.rate_multiplier,
                      time: new Date()?.getTime(),
                    },
                  ],
                  edited: true,
                },
              ])
            );
          }
          setReason("");
          setType("amount");
          setAmount("");
          openRefund(false);
          markItem([]);
          setAuthorize(false);
          setActions(false);
        }
      }
    }
  };

  //Componentns
  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0  bg-cyan-750/50 z-[999] ${
          showRefund ? "flex" : "hidden"
        } justify-center pt-20 backdrop-blur-sm`}
      >
        <div className="w-[30rem] h-[35rem] bg-white rounded p-6 flex flex-col justify-between items-center">
          <div className="w-full h-10 border border-cyan-750 rounded-sm overflow-hidden flex">
            <button
              onClick={() => {
                setType("amount");
              }}
              className={`h-full w-[50%] ${
                currentType === "amount"
                  ? "bg-cyan-750 text-white"
                  : "text-cyan-750 bg-white"
              } text-sm font-medium
            flex items-center justify-center hover:opacity-80 transition-all focus:outline-none`}
            >
              Amount
            </button>
            <button
              onClick={() => {
                setType("item");
              }}
              className={`h-full w-[50%] ${
                currentType === "item"
                  ? "bg-cyan-750 text-white"
                  : "text-cyan-750 bg-white"
              } text-sm font-medium
              flex items-center justify-center hover:opacity-80 transition-all focus:outline-none`}
            >
              Items
            </button>
          </div>

          {/**Items center */}
          {currentType === "item" && (
            <>
              <label htmlFor="item_reason" className="w-full mt-3">
                <span className="text-xs uppercase font-medium text-slate-500">
                  Reason
                </span>
                <textarea
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                  value={reason}
                  name="item_reason"
                  id="item_reason"
                  required
                  placeholder="Refund reason ..."
                  className="resize-none w-full h-16 rounded-sm text-xs text-slate-600 placeholder:text-slate-400
             border-2 border-slate-300 focus:border-cyan-750 focus:ring-0 border-dashed"
                ></textarea>
              </label>
              <ul
                className="w-full mt-1 mb-4 h-[17.5rem] overflow-hidden overflow-y-scroll
        no-scrollbar no-scrollbar::webkit-scrollbar p-3  pt-0"
              >
                <label
                  htmlFor="select_all_items"
                  className="w-full h-10 border-b border-slate-300
             flex items-center justify-between text-sm text-slate-500 font-medium cursor-pointer select-none"
                >
                  <input
                    checked={
                      markedItems?.length === currentSale?.products?.length &&
                      markedItems?.length >= 1
                        ? true
                        : false
                    }
                    onChange={(e: any) => {
                      if (e.target.checked === true) {
                        markItem(currentSale?.products);
                      } else {
                        markItem([]);
                      }
                    }}
                    type="checkbox"
                    name="select_all_items"
                    id="select_all_items"
                    className="rounded-sm h-3 w-3 border-slate-400"
                  />
                  <span>Mark All</span>
                </label>
                {currentSale?.products?.length >= 1 &&
                  currentSale?.products.map((item: any) => {
                    return (
                      <li
                        key={item?.prod_obj?.prod_cart_uid}
                        className="w-full h-12 border-b border-slate-300
             flex items-center justify-between text-xs text-slate-500 font-medium"
                      >
                        <div className="flex items-center space-x-4">
                          <input
                            checked={
                              markedItems?.some(
                                (data: any) =>
                                  data?.prod_cart_uid === item?.prod_cart_uid
                              )
                                ? true
                                : false
                            }
                            onChange={(e: any) => {
                              if (e.target.checked === true) {
                                if (
                                  markedItems?.some(
                                    (data: any) =>
                                      data?.prod_cart_uid ===
                                      item?.prod_cart_uid
                                  )
                                ) {
                                  console.log("Items is on the list already");
                                } else {
                                  markItem((prev: any) => [...prev, item]);
                                }
                              } else {
                                markItem((prev: any) => [
                                  ...prev?.filter(
                                    (data: any) =>
                                      data?.prod_cart_uid !==
                                      item?.prod_cart_uid
                                  ),
                                ]);
                              }
                            }}
                            type="checkbox"
                            name="select_item"
                            id="select_item"
                            className="rounded-sm h-3 w-3 border-slate-400"
                          />
                          <div className="flex space-x-2 items-center justify-start">
                            <span> QTY</span>{" "}
                            <input
                              onChange={(e) => {
                                if (
                                  markedItems?.some(
                                    (data: any) =>
                                      data?.prod_cart_uid ===
                                      item?.prod_cart_uid
                                  )
                                ) {
                                  markItem((prev: any) => [
                                    ...prev?.filter(
                                      (data: any) =>
                                        data?.prod_cart_uid !==
                                        item?.prod_cart_uid
                                    ),
                                    {
                                      ...item,
                                      quantity:
                                        Number(e.target.value) > item?.quantity
                                          ? item?.quantity
                                          : Number(e.target.value) <= 0
                                          ? 1
                                          : Number(e.target.value),
                                    },
                                  ]);
                                } else {
                                  markItem((prev: any) => [
                                    ...prev,
                                    {
                                      ...item,
                                      quantity:
                                        Number(e.target.value) > item?.quantity
                                          ? item?.quantity
                                          : Number(e.target.value) <= 0
                                          ? 1
                                          : Number(e.target.value),
                                    },
                                  ]);
                                }
                              }}
                              value={
                                markedItems?.filter(
                                  (data: any) =>
                                    data?.prod_cart_uid === item?.prod_cart_uid
                                )[0]?.quantity ?? item?.quantity
                              }
                              type="text"
                              className="number text-inherit w-10 h-6 
                          text-xs rrounded-sm border-slate-200 focus:ring-0 focus:border-cyan-750 bg-slate-50 text-center"
                            />
                            <span>{item?.prod_obj?.name}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {selectedCurrency?.symbol}&nbsp;
                          {numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              Number(
                                Number(item?.prod_obj?.price_in_usd) *
                                  item?.quantity
                              )
                            ).toFixed(2)
                          )}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}

          {/**Amount Refund */}
          {currentType === "amount" && (
            <form className="w-full h-[23rem] overflow-hidden p-2 space-y-4 flex flex-col justify-center">
              <div className="text-base font-semibold text-slate-600 flex items-center justify-between">
                <span> Max Amount :</span>
                <span className="text-slate-500">
                  {selectedCurrency?.symbol} &nbsp;
                  {numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(currentSale?.total)
                    ).toFixed(2)
                  )}
                </span>
              </div>
              <label htmlFor="amount">
                <span className="text-xs uppercase font-medium text-slate-500">
                  refund amount
                </span>
                <input
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                  max={
                    selectedCurrency?.rate_multiplier *
                    Number(currentSale?.total)
                  }
                  min={0.01}
                  value={refundAmount}
                  step={0.01}
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  placeholder="Refund amount ..."
                  className="resize-none w-full h-10 rounded-sm text-xs text-slate-600 placeholder:text-slate-400
           border border-slate-300 focus:border-cyan-750 focus:ring-0"
                />
              </label>
              <label htmlFor="reason">
                <span className="text-xs uppercase font-medium text-slate-500">
                  Reason
                </span>
                <textarea
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                  value={reason}
                  name="reason"
                  id="reason"
                  required
                  placeholder="Refund reason ..."
                  className="resize-none w-full h-20 rounded-sm text-xs text-slate-600 placeholder:text-slate-400
             border-2 border-slate-300 focus:border-cyan-750 focus:ring-0 border-dashed"
                ></textarea>
              </label>
              <p className="text-sm text-slate-500">
                Make sure you enter refund amount less than or equal to the sale
                amount. Refund processing might take between 24hr to 72hr
                depending on the payment method.
              </p>
            </form>
          )}

          <div className="w-full h-10 overflow-hidden flex justify-between">
            <button
              onClick={() => {
                openRefund(false);
                setAmount("");
                setReason("");
              }}
              className="h-full w-[35%] bg-inherit text-sm font-medium rounded-sm  border border-cyan-750 capitalize
            text-cyan-750 flex items-center justify-center hover:opacity-75 transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={() => setAuthorize(true)}
              className="h-full w-[35%] bg-inherit text-sm font-medium rounded-sm  border border-cyan-750 capitalize
           text-cyan-750 flex items-center justify-center hover:opacity-75 transition-all focus:outline-none"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      {/**Auth */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={processRefund}
        showReason={false}
      />
    </>
  );
};

export default Refund;
