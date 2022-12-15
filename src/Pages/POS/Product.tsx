import { FC } from "react";
import { TbShoppingCartPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import no_gallery from "../../Assets/no_gallery.png";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {
  inventory_data: any;
  setProObj: any;
  setPreview: any;
  setImg: any;
  setProduct: any;
};

const Product: FC<Props> = ({
  inventory_data,
  setProObj,
  setPreview,
  setImg,
  setProduct,
}): any => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );

  //Component
  return inventory_data?.length >= 1 ? (
    inventory_data?.map((prod: any) => {
      return (
        <div
          onClick={() => {
            setProObj(prod);
            setImg(prod?.gallery?.length >= 1 ? prod?.gallery[0]?.url : "");
            setProduct({
              prod_cart_uid: new Date()?.getTime(),
              prod_obj: prod,
              quantity: 1,
              customization: "",
            });
            setPreview(true);
          }}
          className={`col-span-1 h-[8.5rem] bg-white rounded border border-cyan-750/30 cursor-pointer
            hover:border-cyan-750 transition-all shadow-md flex flex-col justify-between p-3 select-none ${
              Number(prod?.in_stock) <= 0 ? "!pointer-events-none" : ""
            }`}
        >
          <div className="w-full h-fit flex flex-col space-y-1 pt-2 px-2">
            <span
              className="text-xs font-semibold text-slate-600
                     uppercase w-full whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {prod?.name}
            </span>
            <p
              className="mt-2 text-[0.65rem] font-medium text-slate-500 w-full
                  whitespace-nowrap  overflow-hidden text-ellipsis"
            >
              IN-STOCK : <strong>{prod?.in_stock}</strong>
            </p>
            <span
              className="text-sm font-semibold text-slate-500 capitalize w-full
                   whitespace-nowrap overflow-hidden text-ellipsis text-left"
            >
              {selectedCurrency?.symbol}&nbsp;
              {numberWithSpaces(
                (
                  selectedCurrency?.rate_multiplier * Number(prod?.price_in_usd)
                ).toFixed(2)
              )}
            </span>
          </div>
          <button
            onClick={() => {
              setProObj(prod);
              setImg(prod?.gallery?.length >= 1 ? prod?.gallery[0]?.url : "");
              setProduct({
                prod_cart_uid: new Date()?.getTime(),
                prod_obj: prod,
                quantity: 1,
                customization: "",
              });
              setPreview(true);
            }}
            className="h-8 w-full rounded-sm border border-cyan-750/20 hover:border-cyan-750 bg-slate-50 transition-all text-cyan-750 
                  text-base flex items-center justify-between px-2"
          >
            <span className="text-xs font-medium uppercase">Add item</span><TbShoppingCartPlus />
          </button>
        </div>
      );
    })
  ) : (
    <></>
  );
};

export default Product;
