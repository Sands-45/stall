import { FC, useMemo, useState } from "react";
import { TbListSearch, TbEdit, TbTrash } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import no_gallery from "../../Assets/no_gallery.png";
import empty_cart from "../../Assets/empty_cart.png";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { parkSales } from "../../Redux/Slices/SalesSlice";

type Props = {
  cart: any;
  setCart: any;
  setProduct: any;
  setPreview: any;
  setImg: any;
  setProObj: any;
  setCustomization: any;
  setQuantity: any;
};

const Cart: FC<Props> = ({
  cart,
  setCart,
  setProduct,
  setPreview,
  setImg,
  setProObj,
  setCustomization,
  setQuantity,
}) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const parked_sales = useSelector(
    (state: RootState) => state.Sales.parked_sales
  );
  const completed_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const dispatch: AppDispatch = useDispatch();
  const [searchValue, searchCart] = useState<string>("");
  const total = useMemo((): any => {
    return cart?.products?.length >= 1
      ? cart?.products
          ?.map((prod: any) => prod?.prod_obj?.price_in_usd * prod?.quantity)
          ?.reduce((acc: any, value: any) => Number(acc) + Number(value), 0)
      : 0.0;
  }, [cart]);
  const tax = useMemo((): any => {
    return cart?.products?.length >= 1 ? ((15 / 100) * total).toFixed(2) : 0.0;
  }, [total, cart]);

  //Component
  return (
    <div className="h-full w-[23rem] bg-white p-4 pt-4 flex flex-col justify-between items-center">
      <label htmlFor="search_cart" className="w-full h-fit pt-0.5 relative">
        <TbListSearch className="absolute right-4 top-3.5 text-slate-500 text-lg" />
        <input
          onChange={(e) => {
            searchCart(e.target.value?.toString());
          }}
          value={searchValue}
          type="search"
          name="search_cart"
          id="search_cart"
          placeholder="Search Cart ..."
          className="w-full h-10 rounded-full border border-slate-200 px-4
           text-xs text-slate-600 placeholder:text-slate-400 bg-slate-50
           focus:ring-0 focus:border-cyan-750 transition-all"
        />
      </label>

      {/**Cart List */}
      <ul
        className="w-full h-[calc(100%-15.5rem)] p-1 overflow-hidden overflow-y-scroll
       flex flex-col space-y-2 select-none"
      >
        {cart?.products?.length >= 1 ? (
          cart?.products?.map((prod: any) => {
            return (
              <li
                key={prod?.prod_cart_uid}
                className={`w-full h-[4.5rem] bg-slate-50 border border-slate-200 rounded shadow-sm p-2
         ${
           prod?.prod_obj?.name
             ?.toLowerCase()
             ?.replace(/\s/gim, "")
             ?.includes(searchValue?.toLowerCase()?.replace(/\s/gim, ""))
             ? "flex"
             : "hidden"
         } items-center justify-between space-x-2`}
              >
                <img
                  src={
                    prod?.prod_obj?.gallery?.length >= 1
                      ? prod?.prod_obj?.gallery[0]?.url
                      : no_gallery
                  }
                  alt="img"
                  className="h-full w-14 rounded p-0.5 overflow-hidden
                   object-fit object-center object-cover border border-slate-200 bg-white"
                />
                <div className="h-full w-[calc(100%-3.5rem)] flex flex-col justify-center space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <span
                      className="text-[0.65rem] font-medium text-slate-600
                     whitespace-nowrap w-[50%] overflow-hidden text-ellipsis uppercase"
                    >
                      {prod?.prod_obj?.name}
                    </span>
                    <span
                      className="text-xs font-semibold text-slate-600
                     whitespace-nowrap w-[50%] overflow-hidden text-ellipsis capitalize text-right"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(prod?.prod_obj?.price_in_usd) *
                          Number(prod?.quantity)
                        ).toFixed(2)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center h-fit space-x-2 w-[20%]">
                      <button
                        onClick={() => {
                          setProduct({ ...prod, edit: true });
                          setPreview(true);
                          setImg(
                            prod?.prod_obj?.gallery?.length >= 1
                              ? prod?.prod_obj?.gallery[0]?.url
                              : ""
                          );
                          setProObj(prod?.prod_obj);
                          setCustomization(prod?.customization ?? []);
                          setQuantity(prod?.quantity ?? 1);
                        }}
                        className="h-5 w-[50%] flex items-center justify-center
                      rounded text-sm text-cyan-750
                     hover:opacity-80 transition-all border border-slate-200 bg-slate-100"
                      >
                        <TbEdit />
                      </button>
                      <button
                        onClick={() => {
                          setCart((prev: any) => ({
                            ...prev,
                            products: [
                              ...prev?.products?.filter(
                                (data: any) =>
                                  data?.prod_obj?.name !== prod?.prod_obj?.name
                              ),
                            ],
                          }));
                        }}
                        className="h-5 w-[50%] flex items-center justify-center
                      rounded text-sm text-red-600
                     hover:opacity-80 transition-all border border-slate-200 bg-slate-100 hover:bg-red-100"
                      >
                        <TbTrash />
                      </button>
                    </div>
                    <span
                      className="text-xs font-medium text-slate-400
                     whitespace-nowrap w-[20%] overflow-hidden text-ellipsis text-right"
                    >
                      x {prod?.quantity}
                    </span>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
            <img
              src={empty_cart}
              alt="empty_cart"
              className="h-14 w-fit overflow-hidden object-fit object-center
               object-cover opacity-60"
            />
            <span className="text-sm text-center text-slate-400 font-medium capitalize">
              Cart is empty
            </span>
          </div>
        )}
      </ul>

      {/**Totals */}
      <div
        className="w-full h-[11rem] 
       flex flex-col justify-between space-y-4"
      >
        <ul className="w-full h-[calc(100%-2.75rem)] grid grid-rows-5 p-2 border-y border-slate-200">
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
                    (selectedCurrency?.rate_multiplier * tax).toFixed(2)
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
                      selectedCurrency?.rate_multiplier * total -
                      selectedCurrency?.rate_multiplier * tax
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
                    (selectedCurrency?.rate_multiplier * total).toFixed(2)
                  )
                : "0.00"}
            </span>
          </li>
        </ul>
        <div className="w-full h-fit flex items-center justify-between">
          <button
          disabled={cart?.products?.length <= 0}
            className="h-10 w-[50%] bg-cyan-750 hover:bg-cyan-800 transition-all rounded rounded-r-none
            text-white text-xs uppercase font-medium disabled:cursor-not-allowed disabled:opacity-70"
          >
            check-out
          </button>
          <button
          disabled={cart?.products?.length <= 0}
            onClick={() => {
              //Generate Unique ID
              let uniqueID = () => {
                let name = "trans".replace(/[^a-zA-Z]|\s/gi, "");
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
                    total: total,
                    tax_percentage: 15,
                    tax_in_usd: tax,
                    transact_id: uniqueID(),
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
                    total: total,
                    tax_percentage: 15,
                    tax_in_usd: tax,
                    transact_id: uniqueID(),
                  },
                ])
              );
              //Clear Cart
              setCart({});
              window.localStorage.setItem("cart", "");
            }}
            className="h-10 w-[50%] bg-cyan-750 hover:bg-cyan-800 transition-all rounded rounded-l-none
            text-white text-xs uppercase font-medium
             border-l border-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            park cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
