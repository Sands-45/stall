import { FC } from "react";
import { TbClick,TbInfinity } from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
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
          key={prod?.id_two}
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
          className={`col-span-1 h-[8.5rem] bg-slate-50/50 rounded hover:drop-shadow-xl group cursor-pointer box-shadow-one
             transition-all flex flex-col justify-between p-3 select-none ${
              Number(prod?.in_stock) <= 0 && prod?.has_stock_count
                ? "!pointer-events-none"
                : ""
            }`}
        >
          <div className="w-full h-fit flex flex-col space-y-1.5 pt-2 px-2">
            <span
              className="text-xs font-bold text-slate-700
                     uppercase w-full whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {prod?.name}
            </span>
            <p
              className="mt-2 text-[0.65rem] font-semibold text-slate-500 w-full
                  whitespace-nowrap  overflow-hidden text-ellipsis flex items-center space-x-1"
            >
             <span> IN-STOCK :</span> {prod?.has_stock_count?<strong>{prod?.in_stock}</strong>:<TbInfinity className="text-lg"/>}
            </p>
            <span
              className="text-xs font-bold text-slate-600 uppercase w-full
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
          <div
            className="h-8 w-full pt-1 border-t border-slate-200 group-hover:text-cyan-800 bg-inherit transition-all text-cyan-750 
                  text-base flex items-center justify-between px-1 focus:outline-none       "
          >
            <span className="text-xs font-semibold uppercase">Add item</span>
            <TbClick className="text-lg"/>
          </div>
        </div>
      );
    })
  ) : (
    <></>
  );
};

export default Product;
