import { FC, useMemo, useState } from "react";
import { TbListSearch, TbEdit, TbTrash } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import no_gallery from "../../Assets/no_gallery.png";
import empty_cart from "../../Assets/empty_cart.png";

type Props = {
  cart: any;
  setCart: any;
  setProduct: any;
  setPreview: any;
  setImg: any;
  setProObj: any;
  setCustomization: any;
  setQuantity: any;
  openCheckout: any;
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
  openCheckout,
}) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const [searchValue, searchCart] = useState<string>("");
  const total = useMemo((): any => {
    return cart?.products?.length >= 1
      ? cart?.products
          ?.map((prod: any) => prod?.prod_obj?.price_in_usd * prod?.quantity)
          ?.reduce((acc: any, value: any) => Number(acc) + Number(value), 0)
      : 0.0;
  }, [cart]);
  const profit = useMemo((): any => {
    return cart?.products?.length >= 1
      ? total -
          cart?.products
            ?.map(
              (prod: any) =>
                prod?.prod_obj?.buying_price_in_usd * prod?.quantity
            )
            ?.reduce((acc: any, value: any) => Number(acc) + Number(value), 0)
      : 0.0;
  }, [cart, total]);
  const tax = 0;

  //Component
  return (
    <>
      <div className="h-full w-[25rem] bg-white p-4 pt-4 flex flex-col justify-between items-center border-l border-slate-200">
        <div className="w-full flex justify-between items-center space-x-2">
          <label
            htmlFor="search_cart"
            className="w-[calc(100%-3rem)] h-fit pt-0.5 relative"
          >
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
              className="w-full h-10 rounded-sm border border-slate-200 px-4 pr-10
           text-xs text-slate-600 placeholder:text-slate-400 bg-slate-50
           focus:ring-0 focus:border-cyan-750 transition-all"
            />
          </label>
          <button
            onClick={() => setCart({})}
            className="h-10 w-10 rounded-sm bg-slate-50 hover:bg-red-100 transition-all border border-red-100 
         hover:border-red-300 flex items-center justify-center text-lg text-red-500"
          >
            <TbTrash />
          </button>
        </div>

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
                    onError={(e) => {
                      e.currentTarget.src = no_gallery;
                    }}
                    src={
                      prod?.prod_obj?.gallery?.length >= 1
                        ? prod?.prod_obj?.gallery[0]?.url
                        : no_gallery
                    }
                    alt="img"
                    className="h-full w-14 rounded p-1 overflow-hidden
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
                                    data?.prod_cart_uid !== prod?.prod_cart_uid
                                ),
                              ],
                            }));
                          }}
                          className="h-5 w-[50%] flex items-center justify-center
                      rounded text-sm text-red-600 <focus:outline-none></focus:outline-none>
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
                className="h-14 w-14 overflow-hidden object-fit object-center
               object-cover opacity-60"
              />
              <span className="text-sm text-center text-slate-400 font-medium capitalize">
                Cart is empty
              </span>
            </div>
          )}
        </ul>

        {/**Totals and Controls */}
        <div
          className="w-full h-[11rem] 
       flex flex-col justify-between space-y-4"
        >
          <ul className="w-full h-[calc(100%-2.75rem)] grid grid-rows-5 p-2 border-y border-slate-200">
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">Tip</span>
              <span className="text-xs text-slate-600 font-semibold uppercase">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Discount
              </span>
              <span className="text-xs text-slate-600 font-semibold uppercase">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                Tax (15%)
              </span>
              <span className="text-xs text-slate-600 font-semibold uppercase">
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
              <span className="text-xs text-slate-600 font-semibold uppercase">
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
              <span className="text-xs text-slate-600 font-semibold uppercase">
                {selectedCurrency?.symbol}&nbsp;
                {cart?.products?.length >= 1
                  ? numberWithSpaces(
                      (selectedCurrency?.rate_multiplier * total).toFixed(2)
                    )
                  : "0.00"}
              </span>
            </li>
          </ul>
          <div className="w-full h-fit flex items-center justify-center px-1">
            <button
              onClick={() => {
                //Generate Unique ID
                let uniqueID = () => {
                  let name = "trans".replace(/[^a-zA-Z]|\s/gi, "");
                  let combined = `${
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
                setCart((prev: any) => ({
                  ...prev,
                  profit: profit,
                  total: total,
                  tax_percentage: 0,
                  tax_in_usd: 0,
                  transact_id: uniqueID(),
                  sale_channel: "counter",
                }));
                openCheckout(true);
              }}
              disabled={cart?.products?.length <= 0 || !cart?.products}
              className="h-11 w-full bg-cyan-750 hover:bg-cyan-800 transition-all rounded-sm
            text-white text-xs uppercase font-medium disabled:cursor-not-allowed
            flex items-center justify-center space-x-4"
            >
              <span>check-out</span>{" "}
              <strong className="text-sm">{cart?.products?.length ?? 0}</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
