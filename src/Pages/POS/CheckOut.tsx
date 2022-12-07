import { FC, useState } from "react";
import paypal_logo from "../../Assets/paypal.png";
import visa_logo from "../../Assets/visa.png";
import account_logo from "../../Assets/account.png";
import cash_logo from "../../Assets/cash.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { addSales } from "../../Redux/Slices/SalesSlice";
import { HiCheckCircle } from "react-icons/hi";

type Props = {
  cart: any;
  setCart: any;
  isCheckout: any;
  openCheckout: any;
};

const CheckOut: FC<Props> = ({ cart, setCart, isCheckout, openCheckout }) => {
  const dispatch: AppDispatch = useDispatch();
  const completed_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const [paymentMethods, setMethod] = useState<any>([
    { method: "cash", selected: true },
    { method: "card", selected: false },
    { method: "paypal", selected: false },
    { method: "account", selected: false },
  ]);
  const [additional_details, setDetails] = useState<any>({
    customers_details: { name: "", email: "", address: "" },
    note: "",
  });
  const [invoiceOptions, setInvoiceOptions] = useState<any[]>([
    "print",
    "email",
  ]);

  //Component ========
  return (
    <div
      className={`fixed top-0 right-0 left-0 bottom-0
       h-screen min-w-screen bg-cyan-750/40 z-[9999] ${
         isCheckout ? "lg:flex" : "hidden"
       } lg:justify-center
      space-y-4 lg:space-y-0 lg:space-x-4 pt-24 p-4 overflow-hidden overflow-y-scroll`}
    >
      {/**Close Button */}
      <button
        onClick={() => openCheckout(false)}
        className="h-7 w-7 rounded bg-red-600
         border-2 border-white absolute right-6 top-6 text-base text-white hover:bg-red-500 transition-all"
      >
        -
      </button>
      {/**Close Button */}

      <div
        className="w-[25rem] h-[30rem] bg-white
       rounded-md m-auto lg:m-0 p-6 overflow-hidden flex flex-col space-y-4"
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
                      selected: data?.method !== method?.method ? false : true,
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
                  className="h-6 w-fit object-fit object-center overflow-hidden"
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
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center justify-between"
        >
          <input
            autoComplete="off"
            type="text"
            name="discount"
            id="discount"
            placeholder="Discount code ..."
            className="w-[80%] h-10 rounded rounded-r-none bg-slate-50 border border-slate-200 text-xs text-slate-600
          placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all"
          />
          <button
            type="submit"
            className="w-[20%] h-10 bg-cyan-750 text-[0.65rem] uppercase font-medium text-white rounded-r
            hover:bg-cyan-800 transition-all"
          >
            Apply
          </button>
        </form>

        {/**Tip */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center justify-between"
        >
          <input
            autoComplete="off"
            type="text"
            name="tip"
            id="tip"
            placeholder="Tip amount ..."
            className="w-[80%] h-10 rounded rounded-r-none bg-slate-50 border border-slate-200 text-xs text-slate-600
  placeholder:text-slate-400 px-3 focus:ring-0 focus:border-cyan-750 transition-all"
          />
          <button
            type="submit"
            className="w-[20%] h-10 bg-cyan-750 text-[0.65rem] uppercase font-medium text-white rounded-r
    hover:bg-cyan-800 transition-all"
          >
            apply
          </button>
        </form>
      </div>

      {/**Other Half */}
      <div
        className="w-[25rem] h-[30rem] bg-white rounded-md m-auto lg:m-0
       flex flex-col justify-between p-6 space-y-4"
      >
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
          <ul className="mt-2 w-full h-28 grid grid-rows-5 p-2 border-y border-slate-200">
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Tip</span>
              <span className="text-xs text-slate-600 font-semibold">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Discount
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Tax (15%)
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {selectedCurrency?.symbol}&nbsp;
                {cart?.products?.length >= 1
                  ? numberWithSpaces(
                      (
                        selectedCurrency?.rate_multiplier * cart?.tax_in_usd
                      ).toFixed(2)
                    )
                  : "0.00"}
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Subtotal
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {selectedCurrency?.symbol}&nbsp;
                {cart?.products?.length >= 1
                  ? numberWithSpaces(
                      (
                        selectedCurrency?.rate_multiplier * cart?.total -
                        selectedCurrency?.rate_multiplier * cart?.tax_in_usd
                      ).toFixed(2)
                    )
                  : "0.00"}
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Overall Total
              </span>
              <span className="text-xs text-slate-600 font-semibold">
                {selectedCurrency?.symbol}&nbsp;
                {cart?.products?.length >= 1
                  ? numberWithSpaces(
                      (selectedCurrency?.rate_multiplier * cart?.total).toFixed(
                        2
                      )
                    )
                  : "0.00"}
              </span>
            </li>
          </ul>
        </div>

        {/**Transact Btn */}
        <div className="w-full h-fit flex justify-center">
          <button
            onClick={() => {
              //Update State
              dispatch(
                addSales([
                  ...(completed_sales?.length >= 1
                    ? completed_sales?.filter(
                        (record: any) =>
                          record?.transact_id !== cart?.transact_id
                      )
                    : []),
                  {
                    ...cart,
                    date: new Date().getTime(),
                    customers_details: additional_details?.customers_details,
                    note: additional_details?.note,
                    payment_method: paymentMethods?.filter(
                      (methods: any) => methods?.selectedƒ
                    ),
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
                          record?.transact_id !== cart?.transact_id
                      )
                    : []),
                  {
                    ...cart,
                    date: new Date().getTime(),
                    customers_details: additional_details?.customers_details,
                    note: additional_details?.note,
                    payment_method: paymentMethods?.filter(
                      (methods: any) => methods?.selected
                    ),
                  },
                ])
              );
              //Clear Cart
              setCart({});
              window.localStorage.setItem("cart", "");
              openCheckout(false);
              setDetails({
                customers_details: { name: "", email: "", address: "" },
                note: "",
              });
            }}
            disabled={
              !paymentMethods?.filter(
                (methods: any) => methods.method === "cash"
              )[0]?.selected
            }
            className="w-[95%] h-10 rounded bg-cyan-750 hover:bg-cyan-800
             transition-all font-medium text-xs text-white uppercase 
             disabled:cursor-not-allowed disabled:opacity-80"
          >
            transact
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
