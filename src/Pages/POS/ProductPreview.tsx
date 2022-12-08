import { FC, useEffect, useMemo, useState } from "react";
import no_gallery from "../../Assets/no_gallery.png";
import no_customization from "../../Assets/no_customization.png";
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
  useEffect(()=>{
    if (
      currentProd?.length >= 1 &&
      Number(currentProd[0]?.in_stock) < quantity
    ) {
      setQuantity(Number(currentProd[0]?.in_stock));
    }
  },[currentProd,quantity,setQuantity])

  //Component
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 h-screen w-screen p-6 pt-14 z-[999] ${
        openPreview ? "flex" : "hidden"
      } 
     justify-center bg-cyan-750/40 overflow-hidden overflow-y-scroll`}
    >
      <div className="w-[30rem] h-[35rem] bg-white rounded-md relative p-4 pt-0.5 flex flex-col justify-between space-y-4">
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
          className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded
         bg-cyan-750 hover:bg-red-600 border border-white transition-all text-white text-sm"
        >
          &times;
        </button>

        {/**images  Prev*/}
        <div className="w-full h-[50%] grid grid-cols-8 overflow-hidden border border-slate-200 rounded">
          <div
            className="h-full col-span-2 flex flex-col space-y-2 p-2
           bg-slate-50 overflow-hidden border-r border-slate-100"
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
                    className="w-full h-[23%] rounded bg-white
                     p-1 object-center object-cover object-fit cursor-pointer overflow-hidden
                     border border-slate-200"
                  />
                );
              })}
          </div>
          <img
            onError={(e) => {
              e.currentTarget.src = no_gallery;
            }}
            onClick={(e) => zoomElement(e)}
            src={selectedImg ? selectedImg : no_gallery}
            alt="prod_preview"
            className="col-span-6 h-full w-full object-center object-fit object-contain 
          p-2 bg-white overflow-hidden cursor-zoom-in"
          />
        </div>

        {/**Details*/}
        <div className="w-full h-[40%] grid grid-cols-5 gap-2">
          <div
            className="col-span-2 h-full w-full overflow-hidden 
          flex flex-col
          rounded bg-slate-50 border border-slate-200 p-4"
          >
            <div
              className="text-xs h-7 w-full font-semibold text-slate-600 
                whitepsace-nowrap overflow-hidden text-ellipsis uppercase"
            >
              Customazation
            </div>
            {product_obj?.customization_option?.length >= 1 ? (
              <div
                className="w-full h-[calc(100%-1.75rem)] flex flex-col space-y-2
             overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar"
              >
                {product_obj?.customization_option?.map((cust: any) => {
                  return (
                    <div
                      key={cust?.id}
                      className="h-8 w-full rounded border border-slate-300
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
                        className="absolute top-7 left-0 right-0 pt-1 w-full h-fit 
                group-hover:flex hidden bg-transparent z-[9999]"
                      >
                        <ul
                          className="w-full min-h-[3rem] h-fit bg-slate-50 rounded border border-slate-200
                 flex flex-col p-2 shadow-lg drop-shadow-lg"
                        >
                          {cust?.options?.map((opt: any) => {
                            return (
                              <li
                                onClick={() => {
                                  setCustomization((prev: any) => [
                                    ...prev?.filter(
                                      (data: any) => data?.name !== cust?.name
                                    ),
                                    { name: cust?.name, option: opt?.name },
                                  ]);
                                }}
                                key={opt?.id}
                                className="w-full h-8 border-b last:border-none border-slate-200 hover:bg-slate-100
                        text-xs text-slate-500 font-medium flex items-center justify-between px-0.5 capitalize"
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
                  );
                })}
              </div>
            ) : (
              <div
                className="w-full h-[calc(100%-1.75rem)]
               flex flex-col items-center pt-4 space-y-2"
              >
                <img
                  src={no_customization}
                  alt="no customization"
                  className="h-10 w-fit object-center"
                />
                <span className="text-center text-xs text-slate-400 font-medium">
                  No customization
                </span>
              </div>
            )}
          </div>
          <div
            className="col-span-3 h-full overflow-hidden flex flex-col justify-between
           space-y-2 p-4
           rounded bg-slate-50 border border-slate-200"
          >
            <div className="w-full flex items-center justify-between">
            <span
              className="text-xs font-semibold text-slate-600 
                whitepsace-nowrap overflow-hidden text-ellipsis uppercase w-[60%]"
            >
              {product_obj?.name}
            </span>
            <small
              className="text-[0.6rem] italic font-medium text-slate-500 
                whitepsace-nowrap  w-[40%] text-end overflow-hidden text-ellipsis"
            >
              In Stock [{Number(currentProd[0]?.in_stock)}]
            </small></div>
            <p
              className="text-xs font-normal text-slate-400 overflow-hidden
             text-ellipsis h-[6rem] w-full p-2 rounded border-dashed border-2 border-slate-200"
            >
              {product_obj?.description}
            </p>
            <span
              className="text-sm font-semibold text-slate-600 
                whitepsace-nowrap w-full overflow-hidden text-ellipsis capitalize"
            >
              <span className="text-slate-500"> Cost &#10143;</span>{" "}
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
        </div>

        {/**Controls*/}
        <div className="w-full h-[8%] flex items-center justify-between">
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
              className="h-full w-24 border-y border-x-0 focus:ring-0
               focus:border-cyan-750/40 border-cyan-750/40
               text-xs text-slate-600 px-2 text-center font-medium"
            />
            <button
              onClick={() => {
                if (
                  currentProd?.length >= 1 &&
                  Number(currentProd[0]?.in_stock) > quantity
                ) {
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
            className="h-9 rounded flex items-center justify-center space-x-2 px-8
           bg-cyan-750 text-white text-xs font-medium capitalize"
          >
            <TbShoppingCartPlus className="text-base" />
            <span>{prod_cart?.edit ? "Update Cart" : "Add to cart"}</span>
          </button>
        </div>
      </div>

      {/**Zoom Galery */}
      <ZoomedMed zoomMed={zoomMed} setZoomed={setZoomed} type={zoomType} />
    </div>
  );
};

export default ProductPreview;
