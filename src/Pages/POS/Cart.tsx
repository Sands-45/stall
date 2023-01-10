import { FC, useMemo, useState } from "react";
import {
  TbSearch,
  TbChevronLeft,
  TbTrash,
  TbDotsVertical,
} from "react-icons/tb";
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
  smallScreenCart: boolean;
  setSmCart: any;
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
  smallScreenCart,
  setSmCart,
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
      <div
        className={`h-full w-full lg:w-[25rem] bg-slate-200 lg:bg-white p-4 flex flex-col justify-between
       items-center lg:border-l border-slate-200 ${
         smallScreenCart
           ? "z-[99999] -top-6 bottom-0 left-0 right-0"
           : "-left-[200%]"
       } fixed lg:left-auto lg:right-0 lg:top-auto lg:relative transition-all duration-300`}
      >
        <div className="w-full h-8 lg:hidden">
          <button
            onClick={() => setSmCart(false)}
            className="h-8 w-8 outline-none focus:outline-none text-xl text-slate-600 stroke-[3]"
          >
            <TbChevronLeft />
          </button>
        </div>
        <div className="w-full flex justify-between items-center space-x-2">
          <label
            htmlFor="search_cart"
            className="w-[calc(100%-3rem)] h-fit relative"
          >
            <TbSearch className="absolute left-4 top-3 text-slate-500 text-lg" />
            <input
              onChange={(e) => {
                searchCart(e.target.value?.toString());
              }}
              value={searchValue}
              type="search"
              name="search_cart"
              id="search_cart"
              placeholder="Search Cart ..."
              className="w-full h-11 rounded-sm border border-slate-200 px-4 pl-10
           text-xs text-slate-600 placeholder:text-slate-400 bg-slate-50
           focus:ring-0 focus:border-cyan-750 transition-all"
            />
          </label>
          <button
            onClick={() => setCart({})}
            className="h-11 w-11 rounded-sm bg-slate-50 hover:bg-red-100 transition-all border border-red-100 
         hover:border-red-300 flex items-center justify-center text-lg text-red-500"
          >
            <TbTrash />
          </button>
        </div>

        {/**Cart List */}
        <ul
          className="w-full h-[calc(100%-18rem)] lg:h-[calc(100%-15.5rem)] overflow-hidden overflow-y-scroll
       flex flex-col space-y-2 select-none no-scrollbar no-scrollbar::webkit-scrollbar"
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
                  <div className="h-full w-[calc(100%-3.5rem)] flex flex-col justify-center space-y-1.5">
                    <div className="flex items-center justify-between space-x-2">
                      <span
                        className="text-[0.65rem] font-semibold text-slate-600
                     whitespace-nowrap w-[70%] overflow-hidden text-ellipsis uppercase"
                      >
                        {prod?.prod_obj?.name}
                      </span>
                      <span
                        className="text-xs font-semibold text-slate-600
                     whitespace-nowrap w-[30%] overflow-hidden text-ellipsis text-right"
                      >
                        x {prod?.quantity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center h-fit space-x-2 w-[70%]">
                        <span
                          className="text-xs font-bold text-slate-600
                     whitespace-nowrap w-full overflow-hidden text-ellipsis capitalize"
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
                      <div className="group h-5 w-[10%] flex justify-end items-end relative">
                        <TbDotsVertical className="text-sm text-cyan-750 cursor-pointer select-none" />
                        <div
                          className="absolute top-5 right-0 w-36 h-fit bg-white border border-slate-300 p-3 px-1
                        rounded z-10 shadow-md hidden group-hover:block"
                        >
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
                            className="outline-none focus:outline-none w-full h-8 border-b border-slate-200
                          text-xs font-medium text-left text-slate-600 hover:bg-slate-100 px-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCart((prev: any) => ({
                                ...prev,
                                products: [
                                  ...prev?.products?.filter(
                                    (data: any) =>
                                      data?.prod_cart_uid !==
                                      prod?.prod_cart_uid
                                  ),
                                ],
                              }));
                            }}
                            className="outline-none focus:outline-none w-full h-8
                          text-xs font-medium text-left text-slate-600 hover:bg-slate-100 px-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
          <ul className="w-full h-[calc(100%-2.75rem)] grid grid-rows-5 p-2 border-y border-slate-300 lg:border-slate-200">
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-[0.7rem] text-slate-500 uppercase font-semibold">
                Tip
              </span>
              <span className="text-xs text-slate-600 font-bold uppercase">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-[0.7rem] text-slate-500 uppercase font-semibold">
                Discount
              </span>
              <span className="text-xs text-slate-600 font-bold uppercase">
                {selectedCurrency?.symbol}&nbsp;0.00
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-[0.7rem] text-slate-500 uppercase font-semibold">
                Tax (15%)
              </span>
              <span className="text-xs text-slate-600 font-bold uppercase">
                {selectedCurrency?.symbol}&nbsp;
                {cart?.products?.length >= 1
                  ? numberWithSpaces(
                      (selectedCurrency?.rate_multiplier * tax).toFixed(2)
                    )
                  : "0.00"}
              </span>
            </li>
            <li className="row-span-1 w-full flex items-center justify-between">
              <span className="text-[0.7rem] text-slate-500 uppercase font-semibold">
                Subtotal
              </span>
              <span className="text-xs text-slate-600 font-bold uppercase">
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
              <span className="text-[0.7rem] text-slate-500 uppercase font-semibold">
                Overall Total
              </span>
              <span className="text-xs text-slate-600 font-bold uppercase">
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
              <strong>[&nbsp;{cart?.products?.length ?? 0}&nbsp;]</strong>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
