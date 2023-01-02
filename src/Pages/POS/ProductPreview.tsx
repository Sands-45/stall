import { FC, useEffect, useMemo, useState } from "react";
import no_gallery from "../../Assets/no_gallery.png";
import ZoomedMed from "../../Components/Zoom Media/ZoomedMedia";
import {
  TbShoppingCartPlus,
  TbPlus,
  TbMinus,
  TbCaretDown,
} from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {
  product_obj: any;
  setProObj: any;
  openPreview: boolean;
  setPreview: any;
  selectedImg: any;
  setImg: any;
  setCart: any;
  prod_cart: any;
  setProduct: any;
  customization: any;
  setCustomization: any;
  quantity: any;
  setQuantity: any;
};

const ProductPreview: FC<Props> = ({
  product_obj,
  setProObj,
  openPreview,
  setPreview,
  selectedImg,
  setImg,
  setCart,
  prod_cart,
  setProduct,
  customization,
  setCustomization,
  quantity,
  setQuantity,
}) => {
  const [zoomMed, setZoomed] = useState({
    open: false,
    src: "",
  });
  const [zoomType, setType] = useState(null);
  //Zoom Media ========================
  const zoomElement = (e: any) => {
    setType(e.target?.tagName);
    if (e.target?.tagName === "IMG") {
      setZoomed((prev) => ({ ...prev, open: true, src: e.target?.src }));
      document.body.style.overflow = "hidden";
    }
  };
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  let currentProd = useMemo(() => {
    return inventory_data?.filter(
      (data: any) => data?.id_two === product_obj?.id_two
    );
  }, [product_obj, inventory_data]);

  //Check If Quanity Is greater than stock
  useEffect(() => {
    if (
      currentProd?.length >= 1 &&
      Number(currentProd[0]?.in_stock) < quantity && currentProd[0]?.has_stock_count
    ) {
      setQuantity(Number(currentProd[0]?.in_stock));
    }
  }, [currentProd, quantity, setQuantity]);

  //Component
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 h-screen w-screen p-6 pt-20 z-[999] ${
        openPreview ? "flex" : "hidden"
      } 
     justify-center bg-cyan-750/40 overflow-hidden overflow-y-scroll`}
    >
      <div
        className="w-[45rem] h-[30rem] bg-white rounded-md relative p-4 
      grid grid-cols-4 gap-4"
      >
        {/**Close Btn */}
        <button
          onClick={() => {
            setProObj({});
            setProduct({
              prod_cart_uid: new Date()?.getTime(),
              prod_obj: "",
              quantity: 1,
              customization: "",
            });
            setQuantity(1);
            setCustomization([]);
            setPreview(false);
          }}
          className="absolute -top-3 -right-3 h-7 w-7 rounded-sm
         bg-cyan-750 hover:bg-red-600 border border-white transition-all text-white text-sm"
        >
          &times;
        </button>

        {/**images  Prev*/}
        <div className="col-span-2 w-full h-full grid grid-rows-6 gap-4 overflow-hidden">
          <img
            onError={(e) => {
              e.currentTarget.src = no_gallery;
            }}
            onClick={(e) => zoomElement(e)}
            src={selectedImg ? selectedImg : no_gallery}
            alt="prod_preview"
            className="w-full row-span-5 h-full object-center object-fit object-contain 
          p-4 bg-slate-50 border border-slate-200 rounded overflow-hidden cursor-zoom-in"
          />
          <div
            className="w-full row-span-1 grid grid-cols-4 gap-1
           overflow-hidden rounded bg-slate-50 border border-slate-200 p-1"
          >
            {product_obj?.gallery?.length >= 1 &&
              product_obj?.gallery?.map((img: any) => {
                return (
                  <img
                    onError={(e) => {
                      e.currentTarget.src = no_gallery;
                    }}
                    onClick={() => setImg(img?.url)}
                    key={img?.id}
                    src={img?.url}
                    alt="prev"
                    className="w-full h-full col-span-1 rounded bg-white
                     p-1 object-center object-contain object-fit cursor-pointer overflow-hidden
                     border border-slate-100"
                  />
                );
              })}
          </div>
        </div>

        {/**Details*/}
        <div className="col-span-2 w-full h-full flex flex-col justify-between">
          <div
            className="w-full h-full overflow-hidden flex flex-col 
           space-y-4 pt-6"
          >
            <div className="w-full h-hit flex items-center pb-2 border-b border-slate-200">
              <span
                className="text-xs font-semibold text-slate-600 
                whitespace-nowrap overflow-hidden text-ellipsis uppercase w-[60%]"
              >
                {product_obj?.name}
              </span>
              <span
                className="text-xs text-end font-semibold text-slate-500 
                whitespace-nowrap overflow-hidden text-ellipsis uppercase w-[40%]"
              >
                {selectedCurrency?.symbol}&nbsp;
                {numberWithSpaces(
                  (
                    selectedCurrency?.rate_multiplier *
                    Number(product_obj?.price_in_usd) *
                    Number(quantity)
                  ).toFixed(2)
                )}
              </span>
            </div>
            <p
              className="text-xs font-normal text-slate-400 overflow-hidden
             text-ellipsis h-[6rem] w-full p-2 rounded border-dashed border-2 border-slate-200"
            >
              {product_obj?.description}
            </p>
            <div
              className="h-full w-full overflow-hidden 
          flex flex-col"
            >
              <div
                className="text-xs h-6 w-full font-semibold text-slate-500 flex items-center justify-between 
                whitepsace-nowrap overflow-hidden text-ellipsis uppercase"
              >
                <span>Customization</span>
                <small
                  className="text-[0.7rem] font-medium text-slate-500 
                whitepsace-nowrap  w-[40%] text-end overflow-hidden text-ellipsis"
                >
                  In Stock :&nbsp;
                  <span className="text-cyan-750 text-xs font-semibold">
                    {currentProd[0]?.has_stock_count
                      ? Number(currentProd[0]?.in_stock)
                      : "Unlimited" ?? 0}
                  </span>
                </small>
              </div>
              <div className="w-full h-[11.5rem] flex flex-col space-y-2 pt-2 px-2 mt-2 overflow-hidden overflow-y-scroll">
                {product_obj?.customization_option?.length >= 1 &&
                  product_obj?.customization_option?.map((cust: any) => {
                    return (
                      <div
                        key={cust?.id}
                        className="h-8 w-full rounded-sm bg-slate-50 border border-slate-200
                 hover:border-cyan-750 flex items-center justify-between
            relative p-2 text-xs text-slate-500 cursor-pointer transition-all group capitalize"
                      >
                        <span>
                          {customization?.filter(
                            (data: any) => data?.name === cust?.name
                          )?.length >= 1
                            ? customization?.filter(
                                (data: any) => data?.name === cust?.name
                              )[0]?.option
                            : cust?.name}{" "}
                        </span>
                        <TbCaretDown className="text-base group-hover:-rotate-180 transition-all" />

                        {/**Drop Down Elements */}
                        <div
                          className="absolute top-8 left-0 right-0 pt-1 w-full h-20 
                group-hover:flex hidden bg-transparent z-[9999]"
                        >
                          <div className="w-full h-full p-1 bg-white rounded border shadow-lg drop-shadow-lg">
                            <ul
                              className="w-full min-h-[3rem] h-full
                  p-1 px-2 overflow-hidden overflow-y-scroll"
                            >
                              {cust?.options?.map((opt: any) => {
                                return (
                                  <li
                                    onClick={() => {
                                      setCustomization((prev: any) => [
                                        ...prev?.filter(
                                          (data: any) =>
                                            data?.name !== cust?.name
                                        ),
                                        { name: cust?.name, option: opt?.name },
                                      ]);
                                    }}
                                    key={opt?.id}
                                    className="w-full h-8 border-b last:border-none border-slate-200 hover:bg-slate-100
                        text-xs text-slate-500 font-medium flex items-center justify-between px-1 capitalize"
                                  >
                                    <span> {opt?.name}</span>
                                    {cust?.name
                                      ?.toString()
                                      ?.toLowerCase()
                                      ?.includes("color") && (
                                      <div
                                        style={{
                                          background: opt?.name?.toLowerCase(),
                                        }}
                                        className="h-4 w-4 rounded-full"
                                      ></div>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/**Controls*/}
          <div className="w-full h-10 flex items-center justify-between">
            <div className="h-9 w-fit rounded flex justify-between items-center">
              <button
                disabled={quantity <= 1}
                onClick={() => {
                  setQuantity((prev: number) => (prev <= 1 ? 1 : prev - 1));
                }}
                className="rounded rounded-r-none border border-cyan-750/40
             h-full w-9 flex items-center justify-center text-base text-cyan-750
             hover:bg-cyan-50 transition-all disabled:cursor-not-allowed disabled:opacity-80"
              >
                <TbMinus />
              </button>
              <input
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
                value={quantity}
                autoComplete="off"
                type="text"
                className="h-full w-16 border-y border-x-0 focus:ring-0
               focus:border-cyan-750/40 border-cyan-750/40
               text-xs text-slate-600 px-2 text-center font-medium"
              />
              <button
                onClick={() => {
                  if (
                    currentProd?.length >= 1 &&
                    Number(currentProd[0]?.in_stock) > quantity && currentProd[0]?.has_stock_count
                  ) {
                    setQuantity((prev: number) => prev + 1);
                  }else if(!currentProd[0]?.has_stock_count){
                    setQuantity((prev: number) => prev + 1);
                  }
                }}
                className="rounded rounded-l-none border border-cyan-750/40
             h-full w-9 flex items-center justify-center text-base text-cyan-750
             hover:bg-cyan-50 transition-all"
              >
                <TbPlus />
              </button>
            </div>
            <button
              onClick={() => {
                setCart((prev: any) => ({
                  ...prev,
                  products: [
                    ...(prev?.products
                      ? prev?.products?.filter(
                          (data: any) =>
                            data?.prod_cart_uid !== prod_cart?.prod_cart_uid
                        )
                      : []),
                    {
                      ...prod_cart,
                      customization: customization,
                      quantity: quantity,
                    },
                  ],
                }));
                setProObj({});
                setProduct({
                  prod_cart_uid: new Date()?.getTime(),
                  prod_obj: "",
                  quantity: 1,
                  customization: "",
                });
                setQuantity(1);
                setCustomization([]);
                setPreview(false);
              }}
              className="h-9 w-40 rounded-sm flex items-center justify-center space-x-3
           bg-cyan-750 text-white text-xs font-semibold uppercase hover:bg-cyan-800 transition-all"
            >
              <span> Add to cart</span>{" "}
              <TbShoppingCartPlus className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/**Zoom Galery */}
      <ZoomedMed zoomMed={zoomMed} setZoomed={setZoomed} type={zoomType} />
    </div>
  );
};

export default ProductPreview;
