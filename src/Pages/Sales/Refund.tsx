import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {
  showRefund: boolean;
  openRefund: any;
  currentSale: any;
};

const Refund: FC<Props> = ({ showRefund, openRefund, currentSale }) => {
  const [currentType, setType] = useState<string>("item");
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );

  //Componentns
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0  bg-cyan-750/50 z-[999] ${
        showRefund ? "flex" : "hidden"
      } justify-center pt-20 backdrop-blur-sm`}
    >
      <div className="w-[30rem] h-[35rem] bg-white rounded p-6 flex flex-col justify-between items-center">
        <div className="w-full h-10 border border-cyan-750 rounded-sm overflow-hidden flex">
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
        </div>

        {/**Items center */}
        {currentType === "item" && (
          <ul
            className="w-full h-[20rem] overflow-hidden overflow-y-scroll
        no-scrollbar no-scrollbar::webkit-scrollbar px-2"
          >
            <label
              htmlFor="select_all_items"
              className="w-full h-10 border-b border-slate-300
             flex items-center justify-between text-sm text-slate-500 font-medium cursor-pointer select-none"
            >
              <input
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
                    className="w-full h-11 border-b border-slate-300
             flex items-center justify-between text-xs text-slate-500 font-medium"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        name="select_item"
                        id="select_item"
                        className="rounded-sm h-3 w-3 border-slate-400"
                      />
                      <span>
                        {item?.quantity} x {item?.prod_obj?.name}
                      </span>
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
                type="text"
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
            }}
            className="h-full w-[35%] bg-inherit text-sm font-medium rounded-sm  border border-cyan-750 capitalize
            text-cyan-750 flex items-center justify-center hover:opacity-75 transition-all focus:outline-none"
          >
            Cancel
          </button>
          <button
            className="h-full w-[35%] bg-inherit text-sm font-medium rounded-sm  border border-cyan-750 capitalize
           text-cyan-750 flex items-center justify-center hover:opacity-75 transition-all focus:outline-none"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Refund;
