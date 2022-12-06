import { FC, useState, useMemo, useEffect } from "react";
import {
  TbSearch,
  TbQrcode,
  TbCheck,
  TbChevronLeft,
  TbChevronRight,
} from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../Redux/store";
import Product from "./Product";
import pos_empty from "../../Assets/pos_empty.png";
import ProductPreview from "./ProductPreview";
import Cart from "./Cart";
import CheckOut from "./CheckOut";

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
          ? selectedCategory?.includes(item?.category)
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
     overflow-hidden pl-[2.5%] space-x-4"
      >
        <div className="h-full w-[calc(100%-23rem)] py-4">
          <div className="h-full w-full flex flex-col space-y-4">
            <div
              className="h-12 w-full bg-white rounded
          grid grid-cols-10 overflow-hidden"
            >
              {/** Search */}
              <div className="h-full col-span-8 relative">
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
                  className="h-full w-full rounded rounded-r-none p-2 px-3 pl-9 text-xs text-slate-600 placeholder:text-slate-400
              border-slate-300 focus:border-cyan-750 focus:ring-0"
                  placeholder="Quick Search ..."
                />
              </div>
              <button
                className="col-span-2 h-full bg-slate-100
             border border-l-0 border-slate-300 rounded rounded-l-none flex items-center justify-center
             space-x-3 text-slate-600 hover:bg-cyan-750 hover:text-white transition-all"
              >
                <span className="uppercase font-medium text-xs">Scan</span>
                <TbQrcode className="text-xl" />
              </button>
            </div>
            {/** Categories */}
            <div
              className="w-full h-9 flex items-center justify-between space-x-2 py-1
             relative"
            >
              <div
                className="flex items-center space-x-1 h-full w-full overflow-hidden overflow-x-scroll
              no-scrollbar no-scrollbar::-webkit-scrollbar"
              >
                <span className="w-fit pr-2 overflow-hidden whitespace-nowrap text-xs uppercase font-semibold text-slate-500">
                  Categories :
                </span>
                {Array.from(
                  new Set(
                    fetched_inventory_data?.map((data: any) =>
                      data?.category ? data?.category : ""
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
                        className={`h-full w-fit px-3 bg-slate-50 rounded border text-[0.65rem]
              uppercase font-medium ${
                selectedCategory?.some((data: any) =>
                  data
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(cat?.toString()?.toLowerCase())
                )
                  ? "text-cyan-750 border-cyan-750 pl-1"
                  : "border-slate-300 text-slate-400"
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
               absolute right-0 bg-slate-200"
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
                className="w-fill h-[calc(100%-5.5rem)] rounded bg-white p-4 
          overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar grid
           grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6  gap-4"
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
                className="w-fill h-[calc(100%-5.5rem)] rounded bg-white p-4 
            overflow-hidden flex flex-col items-center justify-center space-y-4"
              >
                <img
                  src={pos_empty}
                  alt="no_data"
                  className="h-[7rem] w-fit overflow-hidden object-center objct-fit"
                />
                <p className="text-sm font-medium text-slate-400 text-center">
                  There's no data to display, you either out of stock
                  <br /> or searched product doesn't exit
                </p>
                <Link to="/app/inventory">
                  <div
                    className="h-9 px-6 whitespace-nowrap bg-cyan-750 hover:bg-cyan-800 transition-all 
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
    </>
  );
};

export default PointOfSell;
