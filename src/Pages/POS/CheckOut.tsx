import { FC, useRef, useState } from "react";
import paypal_logo from "../../Assets/paypal.png";
import visa_logo from "../../Assets/visa.png";
import account_logo from "../../Assets/account.png";
import cash_logo from "../../Assets/cash.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { addSales, parkSales } from "../../Redux/Slices/SalesSlice";
import { HiCheckCircle } from "react-icons/hi";
import { TbChecks, TbWifi } from "react-icons/tb";
import { Link } from "react-router-dom";
import master_card_logo from "../../Assets/mastercard.png";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../Redux/Slices/InventorySlice";
import { updateFloat } from "../../Redux/Slices/SalesSlice";
import Authorize from "../../Components/Authorize/Authorize";

type Props = {
  cart: any;
  setCart: any;
  isCheckout: any;
  openCheckout: any;
};

const CheckOut: FC<Props> = ({ cart, setCart, isCheckout, openCheckout }) => {
  const dispatch: AppDispatch = useDispatch();
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const completed_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const parked_sales = useSelector(
    (state: RootState) => state.Sales.parked_sales
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const [paymentMethods, setMethod] = useState<any>([
    { method: "card", selected: true },
    { method: "cash", selected: false },
    { method: "paypal", selected: false },
    { method: "account", selected: false },
  ]);
  const [additional_details, setDetails] = useState<any>({
    customers_details: {
      name: cart?.customers_details?.name,
      email: cart?.customers_details?.email,
      address: cart?.customers_details?.address,
    },
    note: cart?.note??"",
  });
  const [invoiceOptions, setInvoiceOptions] = useState<any[]>([
    "print",
    "email",
  ]);
  const [change, calcChange] = useState<number>(0);
  const [transactProcess, startTransact] = useState<boolean>(false);
  const [showProcessDone, setProcessDone] = useState<boolean>(false);
  const [discountObj, setDiscount] = useState<any>({
    type: "amount",
    value: "",
  });
  const discountFormRef = useRef<HTMLFormElement>(null);
  const [tipObj, setTip] = useState<any>({
    type: "amount",
    value: "",
  });
  const [showAuthorize, setAuthorize] = useState<boolean>(false);

  //Transact Func
  const createTransaction = () => {
    //Start process and show loader
    startTransact(true);

    setTimeout(() => {
      //Update State
      dispatch(
        addSales([
          ...(completed_sales?.length >= 1
            ? completed_sales?.filter(
                (record: any) => record?.transact_id !== cart?.transact_id
              )
            : []),
          {
            ...cart,
            user: user,
            service: "collection",
            status: "paid",
            date: new Date().getTime(),
            customers_details: additional_details?.customers_details,
            note: additional_details?.note,
            payment_method: paymentMethods?.filter(
              (methods: any) => methods?.selected
            )[0]?.method,
            isNew: true,
            isDeleted: false,
            edited: false,
          },
        ])
      );
      //Save Data Locally
      window.localStorage.setItem(
        "completed_sales",
        JSON.stringify([
          ...(completed_sales?.length >= 1
            ? completed_sales?.filter(
                (record: any) => record?.transact_id !== cart?.transact_id
              )
            : []),
          {
            ...cart,
            user: user,
            service: "collection",
            status: "paid",
            date: new Date().getTime(),
            customers_details: additional_details?.customers_details,
            note: additional_details?.note,
            payment_method: paymentMethods?.filter(
              (methods: any) => methods?.selected
            )[0]?.method,
            isNew: true,
            isDeleted: false,
            edited: false,
          },
        ])
      );

      //Deduct Stock From Inventory
      cart?.products?.forEach((prod: any) => {
        if (prod?.prod_obj?.has_stock_count) {
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
                  ) - Number(prod?.quantity) ?? 0,
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
                  ) - Number(prod?.quantity) ?? 0,
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
                  ) - Number(prod?.quantity) ?? 0,
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
                  ) - Number(prod?.quantity) ?? 0,
                last_editedAt: new Date().getTime(),
                edit: true,
              },
            ])
          );
        }
      });

      //Update Cash Float
      let openFloat =
        cash_float?.filter((data: any) => data.status === "open"  && data?.user?.email === user?.email)[0] ?? null;
      if (openFloat) {
        dispatch(
          updateFloat([
            ...cash_float.filter(
              (data: any) => data.id_two !== openFloat?.id_two
            ),
            {
              ...openFloat,
              total: cart?.total + Number(openFloat?.total),
              sales: Number(openFloat?.sales) + Number(cart?.total),
              activities: [
                ...openFloat?.activities,
                {
                  note: "Cash payment",
                  amount: cart?.total,
                  time: new Date()?.getTime(),
                  currency: selectedCurrency?.name,
                },
              ],
              isDeleted: false,
              edited: true,
              isNew: false,
            },
          ])
        );

        //Save local
        window.localStorage.setItem(
          "cash_float",
          JSON.stringify([
            ...cash_float.filter(
              (data: any) => data.id_two !== openFloat?.id_two
            ),
            {
              ...openFloat,
              total: cart?.total + Number(openFloat?.total),
              sales: Number(openFloat?.sales) + Number(cart?.total),
              activities: [
                ...openFloat?.activities,
                {
                  note: "Cash payment",
                  amount: cart?.total,
                  time: new Date()?.getTime(),
                  currency: selectedCurrency?.name,
                },
              ],
              isDeleted: false,
              edited: true,
              isNew: false,
            },
          ])
        );
      }

      //Clear Cart
      setCart({});
      window.localStorage.setItem("cart", "");
      setDetails({
        customers_details: { name: "", email: "", address: "" },
        note: "",
      });
      startTransact(false);
      setProcessDone(true);
    }, 1000);
  };

  //Apply Discount Function
  const applyDiscount = (verify: any) => {
    if (verify) {
      if (discountObj?.type === "amount") {
        let value =
          Number(discountObj?.value) / selectedCurrency?.rate_multiplier;
        setCart((prev: any) => ({
          ...prev,
          profit: prev?.profit - value,
          total: prev?.total - value,
          discount_type: discountObj?.type,
          discount_amount: value,
          discount_percent: ((value / prev?.total) * 100)?.toFixed(0),
          discount_code: "none",
        }));
        discountFormRef &&
          discountFormRef.current &&
          discountFormRef.current.reset();
        setDiscount({
          type: "amount",
          value: "",
        });
      } else if (discountObj?.type === "percent") {
        let value = (Number(discountObj?.value) / 100) * cart?.total;
        setCart((prev: any) => ({
          ...prev,
          profit: prev?.profit - value,
          total: prev?.total - value,
          discount_type: discountObj?.type,
          discount_amount: value,
          discount_percent: discountObj?.value,
          discount_code: "none",
        }));
        discountFormRef &&
          discountFormRef.current &&
          discountFormRef.current.reset();
        setDiscount({
          type: "amount",
          value: "",
        });
      }
    }
    setAuthorize(false);
    setDiscount({
      type: "amount",
      value: "",
    });
  };

  //Component ========
  return (
    <>
      <div
        className={`fixed right-0 left-0
       h-screen min-w-screen bg-cyan-750/40 z-[9999] ${
         isCheckout ? "top-0 bottom-0" : "top-[200%]"
       }  print:hidden lg:flex lg:justify-center
      space-y-4 lg:space-y-0 lg:space-x-4 pt-24 p-4 overflow-hidden overflow-y-scroll transition-all`}
      >
        {/**Close Button */}
        <button
          onClick={() => openCheckout(false)}
          className="h-8 w-fit px-4 rounded-sm bg-white  font-medium uppercase
         border-2 border-white absolute right-6 top-6 text-xs text-slate-600 hover:bg-red-100 transition-all"
        >
          close
        </button>
        {/**Close Button */}

        {/**First Half */}
        <div
          className={`w-[25rem] h-[30rem] bg-white
       rounded-md m-auto lg:m-0 p-6 overflow-hidden ${
         showProcessDone ? "hidden" : "flex"
       } flex-col space-y-4`}
        >
          {/**Payment Methods */}
          <div className="w-full h-[4.5rem] flex justify-between items-center select-none">
            {paymentMethods?.map((method: any) => {
              return (
                <div
                  onClick={() => {
                    setMethod((prev: any) => [
                      ...prev?.map((data: any) => ({
                        ...data,
                        selected:
                          data?.method !== method?.method ? false : true,
                      })),
                    ]);
                  }}
                  key={method?.method}
                  className={`h-full w-[23%] rounded-lg bg-slate-100
                flex flex-col items-center justify-center space-y-1
                 hover:text-cyan-750 hover:border-cyan-750 transition-all border ${
                   method.selected
                     ? "text-cyan-750 border-cyan-750"
                     : " border-slate-200 text-slate-500"
                 } cursor-pointer`}
                >
                  <img
                    src={
                      method?.method === "paypal"
                        ? paypal_logo
                        : method?.method === "card"
                        ? visa_logo
                        : method?.method === "account"
                        ? account_logo
                        : method?.method === "cash"
                        ? cash_logo
                        : ""
                    }
                    alt="logo"
                    className="h-6 w-6 object-fit object-center overflow-hidden"
                  />
                  <span className="text-[0.65rem] text-center font-semibold capitalize">
                    {method?.method}
                  </span>
                </div>
              );
            })}
          </div>

          {/**Customer Details */}
          <div className="w-full h-fit space-y-3 p-3 rounded bg-slate-50 border border-slate-100">
            <input
              onChange={(e) => {
                setDetails((prev: any) => ({
                  ...prev,
                  customers_details: {
                    ...prev?.customers_details,
                    name: e.target.value,
                  },
                }));
              }}
              value={additional_details?.customers_details?.name}
              autoComplete="off"
              type="text"
              name="ename"
              id="ename"
              placeholder="Customer's name ..."
              className="w-full h-9 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all"
            />
            <input
              onChange={(e) => {
                setDetails((prev: any) => ({
                  ...prev,
                  customers_details: {
                    ...prev?.customers_details,
                    email: e.target.value,
                  },
                }));
              }}
              value={additional_details?.customers_details?.email}
              autoComplete="off"
              type="email"
              name="email"
              id="email"
              placeholder="Customer's email ..."
              className="w-full h-9 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all"
            />
            <input
              onChange={(e) => {
                setDetails((prev: any) => ({
                  ...prev,
                  customers_details: {
                    ...prev?.customers_details,
                    address: e.target.value,
                  },
                }));
              }}
              value={additional_details?.customers_details?.address}
              autoComplete="off"
              type="text"
              name="address"
              id="address"
              placeholder="Customer's address ..."
              className="w-full h-9 rounded bg-slate-100 border border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all"
            />
            <textarea
              onChange={(e) => {
                setDetails((prev: any) => ({
                  ...prev,
                  note: e.target.value,
                }));
              }}
              value={additional_details?.note}
              autoComplete="off"
              name="note"
              id="note"
              placeholder="Add a note ..."
              className="w-full h-14 rounded bg-slate-100 border-2 border-dashed border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all resize-none"
            ></textarea>
          </div>

          {/**Discount */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAuthorize(true);
            }}
            ref={discountFormRef}
            className="flex items-center justify-between"
          >
            <input
              disabled={cart?.discount_amount > 0}
              onChange={(e) => {
                setDiscount((prev: any) => ({
                  ...prev,
                  value: Number(e.target.value?.replace(/%/gim, "")),
                }));
              }}
              value={discountObj?.value}
              autoComplete="off"
              type="text"
              name="discount"
              id="discount"
              placeholder="Discount ..."
              className="w-[calc(100%-12rem)] h-10 rounded rounded-r-none bg-slate-50 border border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all disabled:cursor-not-allowed"
            />
            <select
              disabled={cart?.discount_amount > 0}
              onChange={(e) => {
                setDiscount((prev: any) => ({
                  ...prev,
                  type: e.target.value,
                }));
              }}
              className="h-10 w-28 border border-l-0 focus:border-l border-slate-200 bg-slate-50 text-xs text-slate-400
          focus:ring-0  focus:border-cyan-750 transition-all overflow-hidden disabled:cursor-not-allowed"
            >
              <option value="amount">Amount</option>
              <option value="percent">Percent</option>
              <option value="code">Code</option>
            </select>
            <button
              disabled={cart?.discount_amount > 0}
              type="submit"
              className="w-20 h-10 bg-cyan-750 text-[0.65rem] uppercase font-medium text-white rounded-r
            hover:bg-cyan-800 transition-all disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </form>

          {/**Tip */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (tipObj?.type === "amount") {
                let value =
                  Number(tipObj?.value) / selectedCurrency?.rate_multiplier;
                setCart((prev: any) => ({
                  ...prev,
                  tip_type: tipObj?.type,
                  tip_amount: value,
                  tip_percent: ((value / prev?.total) * 100)?.toFixed(0),
                }));
                e.currentTarget.reset();
                setTip({
                  type: "amount",
                  value: "",
                });
              } else if (tipObj?.type === "percent") {
                let value = (Number(tipObj?.value) / 100) * cart?.total;
                setCart((prev: any) => ({
                  ...prev,
                  tip_type: tipObj?.type,
                  tip_amount: value,
                  tip_percent: tipObj?.value,
                }));
                e.currentTarget.reset();
                setTip({
                  type: "amount",
                  value: "",
                });
              }
            }}
            className="flex items-center justify-between"
          >
            <input
              disabled={cart?.tip_amount > 0}
              onChange={(e) => {
                setTip((prev: any) => ({
                  ...prev,
                  value: Number(e.target.value?.replace(/%/gim, "")),
                }));
              }}
              value={tipObj?.value}
              autoComplete="off"
              type="text"
              name="tip"
              id="tip"
              placeholder="Tip ..."
              className="w-[calc(100%-12rem)] h-10 rounded rounded-r-none bg-slate-50 border border-slate-200 text-xs text-slate-600
  placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all disabled:cursor-not-allowed"
            />
            <select
              disabled={cart?.tip_amount > 0}
              onChange={(e) => {
                setTip((prev: any) => ({
                  ...prev,
                  type: e.target.value,
                }));
              }}
              className="h-10 w-28 border border-l-0 focus:border-l border-slate-200 bg-slate-50 text-xs text-slate-400
          focus:ring-0  focus:border-cyan-750 transition-all overflow-hidden disabled:cursor-not-allowed"
            >
              <option value="amount">Amount</option>
              <option value="percent">Percent</option>
            </select>
            <button
              disabled={cart?.tip_amount > 0}
              type="submit"
              className="w-20 h-10 bg-cyan-750 text-[0.65rem] uppercase font-medium text-white rounded-r
    hover:bg-cyan-800 transition-all disabled:cursor-not-allowed"
            >
              apply
            </button>
          </form>
        </div>

        {/**Other Half */}
        <div
          className="transition-all w-[25rem] h-[30rem] bg-white rounded-md m-auto lg:m-0
       flex flex-col justify-between p-6 space-y-4"
        >
          {!showProcessDone ? (
            <>
              <div className="w-full h-fit">
                {/**PrintOptions */}
                <div className="w-full h-8 flex items-center justify-end space-x-2 select-none">
                  <div
                    onClick={() => {
                      setInvoiceOptions((prev: any) =>
                        invoiceOptions?.includes("print")
                          ? [...prev?.filter((data: any) => data !== "print")]
                          : [...prev, "print"]
                      );
                    }}
                    className={`px-6 h-full rounded-sm bg-slate-100 border ${
                      invoiceOptions?.includes("print")
                        ? "border-cyan-750 text-cyan-750"
                        : "border-slate-300 text-slate-500"
                    } 
            text-[0.65rem] font-semibold
            flex flex-col items-center justify-center space-y-0.5
              relative cursor-pointer uppercase`}
                  >
                    {invoiceOptions?.includes("print") && (
                      <div className="absolute text-base -top-1.5 -right-1.5 w-fit h-fit rounded-full bg-white">
                        <HiCheckCircle className="text-cyan-750 z-[99]" />
                      </div>
                    )}
                    <span>Print</span>
                  </div>
                  <div
                    onClick={() => {
                      setInvoiceOptions((prev: any) =>
                        invoiceOptions?.includes("email")
                          ? [...prev?.filter((data: any) => data !== "email")]
                          : [...prev, "email"]
                      );
                    }}
                    className={`px-6 h-full rounded-sm bg-slate-100 border ${
                      invoiceOptions?.includes("email")
                        ? "border-cyan-750 text-cyan-750"
                        : "border-slate-300 text-slate-500"
                    } 
            text-[0.65rem] font-semibold
            flex flex-col items-center justify-center space-y-0.5
              relative cursor-pointer uppercase`}
                  >
                    {invoiceOptions?.includes("email") && (
                      <div className="absolute text-base -top-1.5 -right-1.5 w-fit h-fit rounded-full bg-white">
                        <HiCheckCircle className="text-cyan-750 z-[99]" />
                      </div>
                    )}
                    <span>email</span>
                  </div>
                </div>
                <ul className="mt-2 w-full h-24 flex flex-col justify-between p-2 border-y border-slate-200">
                  <li className="h-8 w-full flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">
                      Tip ({cart?.tip_percent}%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                      {cart?.products?.length >= 1 && cart?.tip_amount
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              cart?.tip_amount
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                  </li>
                  <li className="h-8 w-full flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">
                      Discount ({cart?.discount_percent}%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                      {cart?.products?.length >= 1 && cart?.discount_amount
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              cart?.discount_amount
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                  </li>
                  <li className="h-8 w-full flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">
                      Tax (0%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                      {cart?.products?.length >= 1
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              cart?.tax_in_usd
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                  </li>
                  <li className="h-8 w-full flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">
                      Overall Total
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                      {cart?.products?.length >= 1
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              (cart?.total + (cart?.tip_amount ?? 0))
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                  </li>
                </ul>

                {/**Change calculation */}
                {paymentMethods?.filter(
                  (methods: any) => methods.method === "cash"
                )[0]?.selected && (
                  <div className="w-full flex items-center justify-between mt-3">
                    <div className="flex w-full h-fit rounded border border-slate-200 hover:border-cyan-750 overflow-hidden">
                      <div
                        className="w-16 h-8 text-xs text-slate-500 font-medium flex items-center justify-center
              border-r border-slate-200"
                      >
                        {selectedCurrency?.symbol}
                      </div>
                      <div className="flex w-[calc(100%-5rem)] h-fit overflow-hidden">
                        <input
                          onChange={(e) => {
                            calcChange(
                              Number(e.target.value) -
                                selectedCurrency?.rate_multiplier * cart?.total
                            );
                            setCart((prev: any) => ({
                              ...prev,
                              cash:
                                selectedCurrency?.symbol +
                                " " +
                                Number(e.target.value),
                              change:
                                Number(e.target.value) -
                                selectedCurrency?.rate_multiplier * cart?.total,
                            }));
                          }}
                          autoComplete="off"
                          type="text"
                          name="amount_recieved"
                          id="amount_recieved"
                          placeholder="Tendered amount ..."
                          className="w-[50%] h-8 rounded rounded-r-none bg-inherit border-0 text-xs text-slate-600
                placeholder:text-slate-400 px-2 focus:ring-0
                 focus:border-0 focus:border-r focus:border-r-slate-200 transition-all border-r border-slate-200"
                        />
                        <div
                          className="px-3 w-[50%] h-8 text-xs text-slate-500 font-medium flex items-center justify-center
             "
                        >
                          {change <= 0
                            ? "Change"
                            : numberWithSpaces(change.toFixed(2))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {paymentMethods?.filter(
                  (methods: any) => methods.method === "card"
                )[0]?.selected && (
                  <div className="mt-5 m-auto w-[95%] h-[12rem] rounded-lg bg-gradient-to-tr from-cyan-700 to-cyan-800 drop-shadow-xl p-4">
                    <div className="w-full h-fit flex items-center justify-between">
                      <img
                        src={master_card_logo}
                        alt="card"
                        className="w-9 h-8"
                      />
                      <TbWifi className="text-2xl text-slate-300 rotate-90" />
                    </div>
                    <div className="mt-4 w-full flex items-center justify-between">
                      <label
                        htmlFor="cardholder"
                        className="flex flex-col w-[50%] overflow-hidden"
                      >
                        <span className="w-full whitespace-nowrap overflow-hidden text-xs text-slate-300 uppercase">
                          Name
                        </span>
                        <input
                          type="text"
                          autoComplete="off"
                          id="cardholder"
                          placeholder="John Doe"
                          className="text-xs capitalize text-slate-100 placeholder:text-slate-400 
                        bg-inherit border-0 focus:ring-0 focus:border-0 px-0"
                        />
                      </label>
                      <label
                        htmlFor="card_number"
                        className="flex flex-col w-[50%] overflow-hidden"
                      >
                        <span className="w-full whitespace-nowrap overflow-hidden text-xs text-slate-300 uppercase text-end">
                          Card Number
                        </span>
                        <input
                          type="text"
                          autoComplete="off"
                          id="card_number"
                          placeholder="**** **** **** 1123"
                          className="text-xs capitalize text-slate-100 placeholder:text-slate-400 
                        bg-inherit border-0 focus:ring-0 focus:border-0 px-0 text-right"
                        />
                      </label>
                    </div>
                    <div className="mt-4 w-full flex items-center justify-between">
                      <label
                        htmlFor="expiry date"
                        className="flex flex-col w-[50%] overflow-hidden"
                      >
                        <span className="w-full whitespace-nowrap overflow-hidden text-xs text-slate-300 uppercase">
                          expiry date
                        </span>
                        <input
                          type="text"
                          autoComplete="off"
                          id="expiry date"
                          placeholder="MM/YYYY"
                          className="text-xs capitalize text-slate-100 placeholder:text-slate-400 
                        bg-inherit border-0 focus:ring-0 focus:border-0 px-0"
                        />
                      </label>
                      <label
                        htmlFor="cvv"
                        className="flex flex-col w-[50%] overflow-hidden"
                      >
                        <span className="w-full whitespace-nowrap overflow-hidden text-xs text-slate-300 uppercase text-end">
                          Cvv
                        </span>
                        <input
                          type="text"
                          autoComplete="off"
                          id="cvv"
                          placeholder="123"
                          className="text-xs capitalize text-slate-100 placeholder:text-slate-400 
                        bg-inherit border-0 focus:ring-0 focus:border-0 px-0 text-right"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/**Transact Btn */}
              <div className="w-full h-fit flex justify-between px-2">
                <button
                  onClick={() => createTransaction()}
                  disabled={
                    !paymentMethods?.filter(
                      (methods: any) => methods.method === "cash"
                    )[0]?.selected || transactProcess
                  }
                  className="w-[45%] h-10 rounded-sm bg-cyan-750 hover:bg-cyan-800
             transition-all font-medium text-xs text-white uppercase 
             disabled:cursor-not-allowed disabled:opacity-80 flex items-center justify-center"
                >
                  {!transactProcess && <span>transact</span>}
                  {transactProcess && (
                    <div className="h-5 w-5 rounded-full border-4 border-cyan-50 border-l-cyan-300 animate-spin"></div>
                  )}
                </button>

                <button
                  onClick={() => {
                    //Update State
                    dispatch(
                      parkSales([
                        ...(parked_sales?.length >= 1
                          ? parked_sales?.filter(
                              (record: any) =>
                                record?.transact_id !== cart?.transact_id
                            )
                          : []),
                        {
                          ...cart,
                          status: "pending",
                          date: new Date().getTime(),
                          customers_details:
                            additional_details?.customers_details,
                          note: additional_details?.note,
                        },
                      ])
                    );
                    //Save Data Locally
                    window.localStorage.setItem(
                      "parked_sales",
                      JSON.stringify([
                        ...(parked_sales?.length >= 1
                          ? parked_sales?.filter(
                              (record: any) =>
                                record?.transact_id !== cart?.transact_id
                            )
                          : []),
                        {
                          ...cart,
                          status: "pending",
                          date: new Date().getTime(),
                          customers_details:
                            additional_details?.customers_details,
                          note: additional_details?.note,
                        },
                      ])
                    );
                    //Clear Cart
                    setCart({});
                    window.localStorage.setItem("cart", "");
                    setDetails({
                      customers_details: { name: "", email: "", address: "" },
                      note: "",
                    });
                    openCheckout(false);
                  }}
                  className="w-[45%] h-10 rounded-sm bg-cyan-750 hover:bg-cyan-800
                transition-all font-medium text-xs text-white uppercase 
                disabled:cursor-not-allowed disabled:opacity-80 flex items-center justify-center"
                >
                  park cart
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-green-200 p-2">
                <div
                  className="h-full w-full rounded-full bg-green-600 drop-shadow-lg
              flex items-center justify-center text-2xl text-white transition-all duration-200"
                >
                  <TbChecks />
                </div>
              </div>
              <span className="text-sm text-slate-500 font-semibold text-center">
                Transaction Completed Succecfully
              </span>
              <div className="w-full h-fit flex items-center justify-center space-x-6">
                <button
                  onClick={() => {
                    setProcessDone(false);
                    openCheckout(false);
                  }}
                  className="h-9 w-28 bg-cyan-750 rounded-full text-xs text-white font-medium"
                >
                  Done
                </button>
                <Link to="app/sales" className="w-fit h-fit">
                  <div
                    className="h-9 w-28 border-2 border-cyan-750 rounded-full text-xs text-cyan-750 font-medium
                flex items-center justify-center hover:bg-cyan-50 transition-all"
                  >
                    Sales
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/**Auth */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={applyDiscount}
        showReason={false}
      />
    </>
  );
};

export default CheckOut;
