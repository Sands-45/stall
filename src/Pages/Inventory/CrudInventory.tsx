import { FC, useState } from "react";
import { useSelector } from "react-redux";
import useOnClickOutside from "../../Custom-Hooks/useOnClickOutsideRef";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {
  crudOpen: boolean;
  setCrud: any;
  editAction: boolean;
  setEdit: any;
  stockObj: any;
  setStockObj: any;
};

const CrudInventory: FC<Props> = ({
  crudOpen,
  setCrud,
  editAction,
  setEdit,
  stockObj,
  setStockObj,
}) => {
  const currencies = useSelector(
    (state: RootState) => state.SettingsData.currencies
  );
  const [amountCurrency, setAmountCurrency] = useState<any>({
    name: "usd",
    symbol: "$",
    rate_multiplier: 1,
  });
  const closeModalRef = useOnClickOutside(() => {
    setCrud(false);
    setEdit(false);
    setStockObj({
      id: "",
      name: "",
      product_id: "",
      category: "",
      price_in_usd: 0,
      in_stock: 0,
      customization_option: [],
      gallery: [],
      best_before: "",
    });
  });

  //Component
  return (
    <div
      className={`fixed top-0 bottom-0 ${
        crudOpen
          ? "left-0 right-0 scale-x-100"
          : "left-[200%] -right-[200%] scale-x-0"
      }
     transition-all duration-1500 w-screen h-screen z-[999] bg-cyan-750/50 overflow-hidden flex justify-end`}
    >
      <form className="h-full w-[25rem] bg-white relative">
        <div
          ref={closeModalRef}
          className="h-full w-full flex flex-col justify-between"
        >
          {/**Close Button */}
          <button
            type="button"
            onClick={() => {
              setCrud(false);
              setEdit(false);
              setStockObj({
                id: "",
                name: "",
                product_id: "",
                category: "",
                price_in_usd: 0,
                in_stock: 0,
                customization_option: [],
                gallery: [],
                best_before: "",
              });
            }}
            className="h-6 w-6 border border-r-0 border-white rounded-bl-md
             absolute top-0 -left-6 bg-red-600 text-xs text-white hover:opacity-80 transition-all"
          >
            &times;
          </button>

          {/**Input Form  */}
          <div className="w-full h-[calc(100%-4.25rem)] p-4 space-y-3 flex flex-col overflow-hidden overflow-y-scroll">
            <label htmlFor="product_name">
              <span className="text-xs text-slate-500 font-medium">
                Product Name
              </span>
              <input
                type="text"
                name="product_name"
                id="product_name"
                placeholder="Product name ..."
                className="inventory_input"
                value={stockObj?.name}
                onChange={(e) => {
                  stockObj((prev: any) => ({
                    ...prev,
                    name: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="Category">
              <span className="text-xs text-slate-500 font-medium">
                Category
              </span>
              <input
                type="text"
                name="Category"
                id="Category"
                placeholder="Category ..."
                className="inventory_input"
                value={stockObj?.category}
                onChange={(e) => {
                  stockObj((prev: any) => ({
                    ...prev,
                    category: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="In-Stock">
              <span className="text-xs text-slate-500 font-medium">
                In-Stock
              </span>
              <input
                type="text"
                name="In-Stock"
                id="In-Stock"
                placeholder="In-Stock ..."
                className="inventory_input"
                value={stockObj?.in_stock}
                onChange={(e) => {
                  stockObj((prev: any) => ({
                    ...prev,
                    in_stock: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="Expiry Date">
              <span className="text-xs text-slate-500 font-medium">
                Expiry Date
              </span>
              <input
                type="date"
                name="Expiry Date"
                id="Expiry Date"
                placeholder="Expiry Date ..."
                className="inventory_input"
                onChange={(e) => {
                  stockObj((prev: any) => ({
                    ...prev,
                    category: e.target?.value,
                  }));
                }}
              />
            </label>

            <label htmlFor="Price">
              <div className="flex items-end justify-between w-full space-x-2">
                <div className="w-[70%]">
                  <span className="text-xs text-slate-500 font-medium">
                    Price
                  </span>
                  <input
                    type="text"
                    name="Price"
                    id="Price"
                    placeholder="Price ..."
                    className="inventory_input"
                    value={stockObj?.price_in_usd}
                    onChange={(e) => {
                      stockObj((prev: any) => ({
                        ...prev,
                        price_in_usd: (
                          Number(e.target.value) /
                          amountCurrency?.rate_multiplier
                        )?.toFixed(2),
                      }));
                    }}
                  />
                </div>
                <div className="h-12 w-[25%] px-1 bg-white border-2 border-slate-200 rounded">
                  <select
                    disabled
                    onChange={(e) => {
                      setAmountCurrency(e.target.value);
                      stockObj((prev: any) => ({
                        ...prev,
                        payment_currency: e.target.value?.toLowerCase(),
                      }));
                    }}
                    required
                    name="payment_currency"
                    id="payment_currency"
                    className="w-full h-full flex items-center justify-center pt-1 text-xs 
                    border-0 focus:border-0 focus:ring-0 focus:outline-none uppercase text-slate-700"
                  >
                    {currencies?.map((currence: any) => {
                      return (
                        <option key={currence.name} value={currence}>
                          {currence.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </label>
          </div>

          {/**Submit Options  */}
          <div
            className="w-full h-16 bg-slate-50 border-t
           border-slate-200 flex items-center justify-between p-4"
          >
            <button
              onClick={() => {
                setCrud(false);
                setEdit(false);
                setStockObj({
                  id: "",
                  name: "",
                  product_id: "",
                  category: "",
                  price_in_usd: 0,
                  in_stock: 0,
                  customization_option: [],
                  gallery: [],
                  best_before: "",
                });
              }}
              type="button"
              className="h-10 w-[45%] flex items-center justify-center 
          space-x-2 rounded-sm border border-cyan-750 bg-white font-semibold 
          uppercase text-xs text-cyan-750 outline-none focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="h-10 w-[45%] flex items-center justify-center 
          space-x-2 rounded-sm bg-cyan-750 font-semibold uppercase text-xs text-white outline-none focus:outline-none 
          hover:opacity-80 hover:bg-cyan-700 transition-all"
            >
              <span>{editAction ? "edit item" : "add new"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CrudInventory;
