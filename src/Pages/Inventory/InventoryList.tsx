import { FC } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import no_gallery from "../../Assets/no_gallery.png";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";

type Props = {
  inventory_data: any[];
  setEdit: any;
  setCrud: any;
  setStockObj: any;
};

const InventoryList: FC<Props> = ({
  inventory_data,
  setCrud,
  setEdit,
  setStockObj,
}) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );

  //Component
  return (
    <>
      {inventory_data?.length >= 1 &&
        inventory_data?.map((inven: any) => {
          return (
            <tr
              key={inven?.id}
              className="w-full h-[15%] border-b border-slate-200 flex items-center justify-between overflow-hidden 
       text-xs capitalize
       text-slate-500 hover:bg-slate-50 transition-all"
            >
              <td className="w-[4.76%] h-full overflow-hidden">
                <div className="h-full w-full flex items-center justify-center p-2">
                  <input
                    type="checkbox"
                    name="select_all"
                    id="select_all"
                    className="rounded h-3 w-3 border-slate-400"
                  />
                </div>
              </td>
              <td className="w-[28.57%] h-full overflow-hidden">
                <div className="h-full w-full flex items-center p-2 space-x-2">
                  <img
                    src={inven?.gallery[0]?.url ?? no_gallery}
                    alt="product_image"
                    className="h-11 w-11 rounded object-cover object-center
                   border-2 border-slate-200 overflow-hidden p-0.5"
                  />
                  <div className="h-full w-[calc(100%-3rem)] flex flex-col space-y-0 justify-center">
                    <span
                      className="text-xs capitalize font-medium text-slate-600 overflow-hidden
                   text-ellipsis w-full"
                    >
                      {inven?.name}
                    </span>
                    <span
                      className="text-xs uppercase font-medium text-slate-500 overflow-hidden
                   text-ellipsis w-full"
                    >
                      {inven?.product_id}
                    </span>
                  </div>
                </div>
              </td>
              <td className="w-[19.04%] h-full overflow-hidden">
                <div
                  className="h-full w-full flex items-center p-2 text-xs capitalize 
                font-medium text-slate-600 overflow-hidden text-ellipsis"
                >
                  {inven?.category}
                </div>
              </td>
              <td className="w-[19.04%] h-full overflow-hidden">
                <div
                  className="h-full w-full flex items-center p-2 text-xs capitalize 
                font-medium text-slate-600 overflow-hidden text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {numberWithSpaces(
                    (
                      selectedCurrency?.rate_multiplier *
                      Number(inven?.price_in_usd)
                    ).toFixed(2)
                  )}
                </div>
              </td>
              <td className="w-[19.04%] h-full overflow-hidden">
                <div className="h-full w-full flex flex-col space-y-0 justify-center p-2">
                  <span
                    className="text-xs uppercase font-medium text-slate-500 overflow-hidden
                   text-ellipsis w-full"
                  >
                    {inven?.in_stock}
                  </span>
                  <span
                    className="text-xs capitalize font-medium text-slate-600 overflow-hidden
                   text-ellipsis w-full"
                  >
                    BB :{" "}
                    <span className="text-slate-500">
                      {" "}
                      {inven?.best_before
                        ? new Date(inven?.best_before)
                            .toLocaleDateString()
                            ?.replace(/\//gim, "-")
                        : "N/A"}
                    </span>
                  </span>
                </div>
              </td>
              <td className="w-[9.52%] h-full overflow-hidden">
                <div className="h-full w-full flex items-center space-x-3 p-2 font-medium">
                  <button
                    onClick={() => {
                      setEdit(true);
                      setCrud(true);
                      setStockObj(inven);
                    }}
                    className="flex justify-center items-center text-lg
                   text-slate-600 h-8 w-8 rounded border
                    border-slate-200 bg-slate-50 hover:bg-cyan-50 transition-all"
                  >
                    <TbEdit />
                  </button>
                  <button
                    className="flex justify-center items-center text-lg
                   text-slate-600 h-8 w-8 rounded border
                    border-slate-200 bg-slate-50 hover:bg-red-50 transition-all"
                  >
                    <TbTrash />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export default InventoryList;
