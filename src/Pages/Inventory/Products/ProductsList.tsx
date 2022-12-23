import { FC, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import no_gallery from "../../../Assets/no_gallery.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { numberWithSpaces } from "../../../Reusable Functions/Functions";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../../Redux/Slices/InventorySlice";
import { updateAlert } from "../../../Redux/Slices/NotificationsSlice";
import Authorize from "../../../Components/Authorize/Authorize";

type Props = {
  inventory_data: any[];
  setEdit: any;
  setCrud: any;
  setStockObj: any;
  markItem: any;
  markedArray: any;
};

const ProductsList: FC<Props> = ({
  inventory_data,
  setCrud,
  setEdit,
  setStockObj,
  markItem,
  markedArray,
}) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );
  const dispatch = useDispatch();
  const [showAuthorize, setAuthorize] = useState<boolean>(false);
  const [inven, setInven] = useState<any>("");

  const crudAction = (verify: any) => {
    if (verify) {
      setEdit(true);
      setCrud(true);
      setStockObj(inven);
      setAuthorize(false);
    }
  };

  //Component
  return (
    <>
      {inventory_data?.length >= 1 &&
        [...inventory_data]
          ?.sort(
            (a: any, b: any) =>
              Number(b.last_editedAt) - Number(a.last_editedAt)
          )
          ?.map((inven: any) => {
            return (
              <div
                key={inven?.id_two}
                className="w-full h-[6.5rem%] border-b border-slate-100 flex items-center justify-between overflow-hidden 
       text-xs capitalize cursor-pointer
       text-slate-500 hover:bg-slate-50 transition-all"
              >
                <div className="w-[4.76%] h-full overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center p-2">
                    <input
                      type="checkbox"
                      name="select_all"
                      id="select_all"
                      className="rounded-sm h-3 w-3 border-slate-400"
                      checked={
                        markedArray?.some(
                          (data: any) => data?.id_two === inven?.id_two
                        )
                          ? true
                          : false
                      }
                      onChange={(e: any) => {
                        if (e.target.checked === true) {
                          if (
                            markedArray?.some(
                              (data: any) => data?.id_two === inven?.id_two
                            )
                          ) {
                            dispatch(
                              updateAlert([
                                ...alerts,
                                {
                                  message: "Item is already selected",
                                  color: "bg-green-200",
                                  id: new Date().getTime(),
                                },
                              ])
                            );
                          } else {
                            markItem((prev: any) => [...prev, inven]);
                          }
                        } else {
                          markItem((prev: any) => [
                            ...prev?.filter(
                              (data: any) => data?.id_two !== inven?.id_two
                            ),
                          ]);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="w-[28.57%] h-full overflow-hidden">
                  <div className="h-full w-full flex items-center p-2 space-x-2">
                    <img
                      onError={(e) => {
                        e.currentTarget.src = no_gallery;
                      }}
                      src={inven?.gallery[0]?.url ?? no_gallery}
                      alt="product_image"
                      className="h-9 w-9 rounded object-cover object-center
                   border-2 border-slate-200 overflow-hidden p-1.5 bg-slate-100"
                    />
                    <div className="h-full w-[calc(100%-3rem)] flex flex-col space-y-0 justify-center">
                      <span
                        className="text-xs capitalize text-slate-600 overflow-hidden
                   text-ellipsis w-full"
                      >
                        {inven?.name}
                      </span>
                      <span
                        className="text-[0.65rem] uppercase text-slate-500 overflow-hidden
                   text-ellipsis w-full"
                      >
                        {inven?.product_id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-[19.04%] h-full overflow-hidden">
                  <div
                    className="h-full w-full flex items-center p-2 text-xs capitalize 
               text-slate-600 overflow-hidden text-ellipsis"
                  >
                    {inven?.category}
                  </div>
                </div>
                <div className="w-[19.04%] h-full overflow-hidden">
                  <div
                    className="h-full w-full flex items-center p-2 text-xs capitalize 
               text-slate-600 overflow-hidden text-ellipsis"
                  >
                    {selectedCurrency?.symbol}&nbsp;
                    {numberWithSpaces(
                      (
                        selectedCurrency?.rate_multiplier *
                        Number(inven?.price_in_usd)
                      ).toFixed(2)
                    )}
                  </div>
                </div>
                <div className="w-[19.04%] h-full overflow-hidden">
                  <div className="h-full w-full flex flex-col space-y-0 justify-center p-2">
                    <span
                      className="text-xs uppercase text-slate-600 overflow-hidden
                   text-ellipsis w-full"
                    >
                      {inven?.in_stock}
                    </span>
                  </div>
                </div>
                <div className="w-[9.52%] h-full overflow-hidden px-4">
                  <div className="h-full w-full flex items-center space-x-3 p-2">
                    <button
                      onClick={() => {
                        setInven(inven);
                        setAuthorize(true);
                      }}
                      className="flex justify-center items-center text-base
                   text-slate-600 h-7 w-7 rounded border
                    border-slate-200 bg-slate-50 hover:bg-cyan-50 transition-all"
                    >
                      <TbEdit />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

      {/*Athourize */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={crudAction}
        showReason={false}
      />
    </>
  );
};

export default ProductsList;
