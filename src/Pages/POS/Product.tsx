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
          className="col-span-1 h-[12rem] bg-slate-100 rounded-md border border-cyan-750/30
            hover:border-cyan-750 transition-all shadow-md flex flex-col justify-between p-2 select-none"
        >
          <img
            onError={(e) => {
              e.currentTarget.src = no_gallery;
            }}
            src={prod?.gallery[0]?.url ?? no_gallery}
            alt="product-img"
            className="h-[50%] w-full overflow-hidden object-center object-contain object-fit
                border border-slate-300 bg-slate-200 rounded p-2"
          />
          <div className="h-[50%] w-full flex flex-col justify-between space-y-1">
            <div className="flex flex-col justify-between w-full h-[calc(100%-2.25rem)] pt-2.5 pb-1">
              <div className="w-full flex justify-between items-center space-x-[5%] px-0.5">
                <span
                  className="text-[0.65rem] font-semibold text-slate-500
                     capitalize w-full whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {prod?.name}
                </span>
              </div>
              <span
                className="text-[0.65rem] font-normal text-slate-600 px-0.5 w-full
                   whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {prod?.description}
              </span>
            </div>
            <div className="h-8 w-full bg-inherit rounded flex items-center justify-between space-x-2">
              {/* <div className="h-full w-[calc(100%-2.5rem)] flex items-center justify-between rounded">
                <button
                  className="flex items-center justify-center rounded rounded-r-none border
                    border-cyan-750/70 h-full w-7 text-base text-cyan-750 hover:bg-cyan-50 transition-all"
                >
                  <TbMinus />
                </button>
                <input
                  value="1"
                  type="text"
                  name="incement_item_number"
                  className="h-full w-[calc(100%-3.5rem)] border-0 border-y border-cyan-750/40 focus:border-cyan-750/40 focus:ring-0 bg-inherit
                    text-xs placeholder:text-slate-400 text-slate-600 flex items-center justify-center text-center overflow-hidden
                    "
                />
                <button
                  className="flex items-center justify-center rounded rounded-l-none border
                    border-cyan-750/70 h-full w-7 text-base text-cyan-750 hover:bg-cyan-50 transition-all"
                >
                  <TbPlus />
                </button>
              </div> */}
              <div
                className="flex items-center w-[calc(100%-2.5rem)] h-8 rounded
                "
              >
                <span
                  className="text-xs font-semibold text-slate-600 capitalize px-1 w-full
                   whitespace-nowrap overflow-hidden text-ellipsis text-left"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(prod?.price_in_usd)
                    ).toFixed(2)
                  )}
                </span>
              </div>
              <button
                onClick={() => {
                  setProObj(prod);
                  setImg(
                    prod?.gallery?.length >= 1 ? prod?.gallery[0]?.url : ""
                  );
                  setProduct({
                    prod_cart_uid: new Date()?.getTime(),
                    prod_obj: prod,
                    quantity: 1,
                    customization: "",
                  });
                  setPreview(true);
                }}
                className="h-full w-8 rounded bg-cyan-750 hover:bg-cyan-800 transition-all text-white 
                  text-base flex items-center justify-center"
              >
                <TbShoppingCartPlus />
              </button>
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <></>
  );
};

export default Product;
