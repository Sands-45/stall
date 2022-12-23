import { FC, useState, useMemo, useEffect } from "react";
import {
  TbSearch,
  TbScan,
  TbCheck,
  TbChevronLeft,
  TbChevronRight,
} from "react-icons/tb";
import { HiOutlineCollection } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../Redux/store";
import Product from "./Product";
import pos_empty from "../../Assets/pos_empty.png";
import ProductPreview from "./ProductPreview";
import Cart from "./Cart";
import CheckOut from "./CheckOut";
import CashFloat from "./CashFloat";
import Authorize from "../../Components/Authorize/Authorize";

type Props = {};

const PointOfSell: FC<Props> = () => {
  const fetched_inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const [product_obj, setProObj] = useState<any>({});
  const [selectedImg, setImg] = useState<any>("");
  const [openPreview, setPreview] = useState<boolean>(false);
  const [selectedCategory, addCategory] = useState<any>([]);
  const [productSearch, changeSearch] = useState<string>("");
  const inventory_data = useMemo(() => {
    return [...fetched_inventory_data]
      ?.filter((item: any) =>
        selectedCategory?.length >= 1
          ? selectedCategory?.includes(item?.category?.toLowerCase())
          : true
      )
      ?.filter(
        (inven: any) =>
          inven?.name
            ?.toString()
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(
              productSearch?.toString()?.toLowerCase()?.replace(/\s/gim, "")
            ) ||
          inven?.product_id
            ?.toString()
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(
              productSearch?.toString()?.toLowerCase()?.replace(/\s/gim, "")
            ) ||
          inven?.description
            ?.toString()
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(
              productSearch?.toString()?.toLowerCase()?.replace(/\s/gim, "")
            )
      )
      ?.sort((a: any, b: any) => (a?.name < b?.name ? -1 : 1));
  }, [selectedCategory, productSearch, fetched_inventory_data]);
  const localCart = window.localStorage.getItem("cart");
  const [cart, setCart] = useState<any>(localCart ? JSON.parse(localCart) : {});
  const [prod_cart, setProduct] = useState<any>({
    prod_cart_uid: new Date()?.getTime(),
    prod_obj: "",
    quantity: 1,
    customization: "",
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [customization, setCustomization] = useState<any>([]);
  const [isCheckout, openCheckout] = useState<boolean>(false);
  const [openFloat, setFloatOpen] = useState<boolean>(false);
  const [showAuthorize, setAuthorize] = useState<boolean>(false);

  //Open Float with Auth Funct
  const authFloat = (value: any) => {
    if (value) {
      setFloatOpen(true);
      setAuthorize(false);
    } else {
      setFloatOpen(false);
    }
  };

  //Save Cart Changes Locally
  useEffect(() => {
    if (cart) {
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }
  });

  //Component =========
  return (
    <>
      <div
        className="w-full h-full flex justify-between
     overflow-hidden pl-[2.5%] space-x-4 bg-slate-100"
      >
        <div className="h-full w-[calc(100%-25rem)] py-4">
          <div className="h-full w-full flex flex-col space-y-4">
            <div
              className="h-12 w-full
          flex items-center justify-between overflow-hidden"
            >
              {/** Search */}
              <div className="h-full w-[calc(100%-18rem)] relative">
                <TbSearch className="absolute text-xl text-slate-500 top-3.5 left-2.5" />
                <input
                  onChange={(e) => {
                    changeSearch(e.target.value);
                  }}
                  value={productSearch}
                  autoComplete="off"
                  type="search"
                  name="point_of_sale_main_search"
                  id="point_of_sale_main_search"
                  className="h-full w-full rounded p-2 px-3 pl-9 text-xs text-slate-600 placeholder:text-slate-400
              border-slate-300 focus:border-cyan-750 focus:ring-0"
                  placeholder="Quick Search ..."
                />
              </div>
              <button
                className="w-28 h-full bg-slate-50
             border border-slate-300 rounded-sm flex items-center justify-center focus:outline-none
             space-x-3 text-slate-600 hover:bg-cyan-750 hover:text-white transition-all"
              >
                <span className="uppercase font-medium text-xs">Scan</span>
                <TbScan className="text-xl" />
              </button>
              <button
                onClick={() => {
                  setAuthorize(true);
                }}
                className="w-40 h-11 bg-cyan-750 focus:outline-none rounded-sm flex items-center justify-center
             space-x-3 text-white hover:bg-cyan-800 transition-all"
              >
                <span className="uppercase font-medium text-xs">
                  Cash Float
                </span>
                <HiOutlineCollection className="text-xl" />
              </button>
            </div>
            {/** Categories */}
            <div
              className="w-full h-7 flex items-center justify-between space-x-2
             relative"
            >
              <div
                className="flex items-center space-x-1 h-full w-full overflow-hidden overflow-x-scroll
              no-scrollbar no-scrollbar::-webkit-scrollbar"
              >
                {Array.from(
                  new Set(
                    fetched_inventory_data?.map((data: any) =>
                      data?.category
                        ? data?.category?.toString()?.toLowerCase()?.trim()
                        : ""
                    )
                  )
                )?.length <= 0 && (
                  <button
                    className={`h-full w-fit px-3 bg-white rounded border text-[0.65rem]
              uppercase font-medium border-slate-300 text-slate-500 hover:text-cyan-750 hover:border-cyan-750 flex 
             items-center space-x-1 transition-all`}
                  >
                    <span className="whitespace-nowrap">no categories</span>{" "}
                  </button>
                )}
                {Array.from(
                  new Set(
                    fetched_inventory_data?.map((data: any) =>
                      data?.category
                        ? data?.category?.toString()?.toLowerCase()?.trim()
                        : ""
                    )
                  )
                )
                  ?.sort((a: any, b: any) => (a < b ? -1 : 1))
                  ?.map((cat: any) => {
                    return (
                      <button
                        onClick={() => {
                          if (
                            selectedCategory?.some((data: any) =>
                              data
                                ?.toString()
                                ?.toLowerCase()
                                ?.includes(cat?.toString()?.toLowerCase())
                            )
                          ) {
                            addCategory((prev: any) => [
                              ...prev?.filter((data: any) => data !== cat),
                            ]);
                          } else {
                            addCategory((prev: any) => [...prev, cat]);
                          }
                        }}
                        key={cat}
                        className={`h-full w-fit px-3 bg-white rounded border text-[0.65rem]
              uppercase font-medium ${
                selectedCategory?.some((data: any) =>
                  data
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(cat?.toString()?.toLowerCase())
                )
                  ? "text-cyan-750 border-cyan-750 pl-1"
                  : "border-slate-300 text-slate-500"
              } hover:text-cyan-750 hover:border-cyan-750 flex 
             items-center space-x-1 transition-all`}
                      >
                        {selectedCategory?.some((data: any) =>
                          data
                            ?.toString()
                            ?.toLowerCase()
                            ?.includes(cat?.toString()?.toLowerCase())
                        ) && <TbCheck className="text-base" />}
                        <span className="whitespace-nowrap">{cat}</span>{" "}
                      </button>
                    );
                  })}
              </div>
              <div
                className="h-full w-fit pl-2 flex items-center space-x-1 justify-end
               absolute right-0 bg-slate-100"
              >
                <button
                  className="h-6 w-8 text-sm text-slate-500 bg-slate-50 rounded
                 border border-slate-300 flex items-center justify-center"
                >
                  <TbChevronLeft />
                </button>
                <button
                  className="h-6 w-8 text-sm text-slate-500 bg-slate-50 rounded
                 border border-slate-300 flex items-center justify-center"
                >
                  <TbChevronRight />
                </button>
              </div>
            </div>
            {/** Products */}
            {inventory_data?.length >= 1 ? (
              <div
                className="w-fill h-[calc(100%-5.5rem)] rounded bg-slate-50 border border-slate-300 p-4 
          overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar grid
           grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 auto-rows-min"
              >
                <Product
                  inventory_data={inventory_data}
                  setProObj={setProObj}
                  setPreview={setPreview}
                  setImg={setImg}
                  setProduct={setProduct}
                />
              </div>
            ) : (
              <div
                className="w-fill h-[calc(100%-5.5rem)] rounded bg-white border border-slate-300 p-4 
            overflow-hidden flex flex-col items-center justify-center space-y-4"
              >
                <img
                  src={pos_empty}
                  alt="no_data"
                  className="h-[4rem] w-[3.5rem] opacity-40 overflow-hidden object-center objct-fit"
                />
                <p className="text-sm font-medium text-slate-400 text-center">
                  There's no data to display, you either out of stock
                  <br /> or searched product doesn't exit
                </p>
                <Link to="/app/inventory">
                  <div
                    className="h-9 w-36 whitespace-nowrap bg-cyan-750 hover:bg-cyan-800 transition-all 
              text-white text-xs text-center font-medium
               capitalize flex items-center justify-center rounded-sm"
                  >
                    add stock
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/** ============= Cart ================ */}
        <Cart
          cart={cart}
          setCart={setCart}
          setProduct={setProduct}
          setPreview={setPreview}
          setImg={setImg}
          setProObj={setProObj}
          setCustomization={setCustomization}
          setQuantity={setQuantity}
          openCheckout={openCheckout}
        />
      </div>
      {/** ============= Product Preview================ */}
      <ProductPreview
        product_obj={product_obj}
        setProObj={setProObj}
        openPreview={openPreview}
        setPreview={setPreview}
        selectedImg={selectedImg}
        setImg={setImg}
        setCart={setCart}
        prod_cart={prod_cart}
        setProduct={setProduct}
        setCustomization={setCustomization}
        customization={customization}
        setQuantity={setQuantity}
        quantity={quantity}
      />

      {/**Check Out */}
      <CheckOut
        setCart={setCart}
        cart={cart}
        isCheckout={isCheckout}
        openCheckout={openCheckout}
      />

      {/**Flaot */}
      <CashFloat openFloat={openFloat} setFloatOpen={setFloatOpen} />

      {/**Auth */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={authFloat}
        showReason={false}
      />
    </>
  );
};

export default PointOfSell;
