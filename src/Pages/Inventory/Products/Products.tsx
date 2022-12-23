import { FC, useState, useEffect, useMemo } from "react";
import { TbDotsVertical, TbTrash } from "react-icons/tb";
import ProductsList from "./ProductsList";
import pos_empty from "../../../Assets/pos_empty.png";
import CrudInventory from "./CrudInventory";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../../Redux/Slices/InventorySlice";
import Authorize from "../../../Components/Authorize/Authorize";

type Props = {};

const Products: FC<Props> = () => {
  const [onlineStatus, isOnline] = useState<boolean>(navigator.onLine);
  const fetched_inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const dispatch = useDispatch();
  const [crudOpen, setCrud] = useState<boolean>(false);
  const [editAction, setEdit] = useState<boolean>(false);
  const [markedArray, markItem] = useState<any[]>([]);
  const [stockObj, setStockObj] = useState<any>({
    id_two: "",
    name: "",
    product_id: "",
    category: "",
    description: "",
    price_in_usd: "",
    buying_price_in_usd: "",
    in_stock: 0,
    customization_option: [],
    gallery: [],
    best_before: "",
  });
  const [search, setSearch] = useState<string>("");
  const inventory_data = useMemo(() => {
    return [...fetched_inventory_data]
      .filter(
        (data: any) =>
          data?.name
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.product_id
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.category
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.description
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
          data?.price_in_usd
            ?.toLowerCase()
            ?.replace(/\s/gim, "")
            ?.includes(search?.toLowerCase()?.replace(/\s/gim, ""))
      )
      ?.sort((a: any, b: any) => b.last_editedAt - a.last_editedAt);
  }, [search, fetched_inventory_data]);
  const [showAuthorize, setAuthorize] = useState<boolean>(false);
  const [action, setAction] = useState<string>("edit");

  //Listen For Offline and Online Changes
  useEffect(() => {
    const setOnline = () => {
      isOnline(true);
    };
    const setOffline = () => {
      isOnline(false);
    };
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);

    // cleanup if we unmount
    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  //Delete Inventory
  const deleteStock = () => {
    markedArray.forEach((inven: any) => {
      //Save Local
      window.localStorage.setItem(
        "inventory_data",
        JSON.stringify([
          ...inventory_data?.filter(
            (data: any) => data?.id_two !== inven?.id_two
          ),
        ])
      );
      window.localStorage.setItem(
        "inventory_changes_data",
        JSON.stringify([
          ...inventory_data_queue?.filter(
            (data: any) => data?.id_two !== inven?.id_two
          ),
          {
            ...inventory_data?.filter(
              (data: any) => data?.id_two === inven?.id_two
            )[0],
            deleted: true,
          },
        ])
      );
      //Update Redux
      dispatch(
        updateLocalInventory_Changes([
          ...inventory_data_queue?.filter(
            (data: any) => data?.id_two !== inven?.id_two
          ),
          {
            ...inventory_data?.filter(
              (data: any) => data?.id_two === inven?.id_two
            )[0],
            deleted: true,
          },
        ])
      );
      dispatch(
        loadInventoryData([
          ...inventory_data?.filter(
            (data: any) => data?.id_two !== inven?.id_two
          ),
        ])
      );
      markItem((prev: any) => [
        ...prev?.filter((data: any) => data?.id_two !== inven?.id_two),
      ]);
    });
  };

  const crudAction = (verify: any) => {
    if (verify) {
      if (action !== "delete") {
        setCrud(true);
        setEdit(false);
        setAuthorize(false);
      } else {
        deleteStock();
        setCrud(false);
        setEdit(false);
        setAuthorize(false);
      }
    }
  };

  //Component
  return (
    <>
      <div className="h-full w-full">
        <div className="h-full w-full rounded bg-white border border-slate-200 p-4 flex flex-col space-y-4">
          <div className="h-9 w-full overflow-hidden flex justify-between">
            <span className="text-lg font-bold text-slate-700">
              Products
            </span>
            <button
              className="h-8 w-9 flex items-center justify-center 
          space-x-2 font-semibold uppercase text-xs text-slate-600 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <TbDotsVertical className="text-lg" />
            </button>
          </div>

          <div className="h-9 w-full flex justify-between items-center">
            {/**Search and Filters Option */}
            <div className="flex items-center space-x-3">
              {markedArray?.length >= 1 && (
                <button
                  onClick={() => {
                    setAction("delete");
                    setAuthorize(true);
                  }}
                  className="h-9 w-10 flex items-center justify-center 
          space-x-2 rounded-sm border border-slate-300 hover:border-red-750 bg-white font-semibold uppercase 
          text-xs text-slate-600 hover:text-red-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-red-50 transition-all"
                >
                  <TbTrash className="text-xl" />
                </button>
              )}
              <label htmlFor="search_stock">
                <input
                  type="search"
                  name="search_stock"
                  id="search_stock"
                  placeholder="Quick Search ..."
                  className="h-9 w-[20rem] rounded-sm border-slate-300 p-2 px-3
             focus:border-cyan-750 focus:ring-0 text-xs text-slate-700 placeholder:text-slatee-400"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                />
              </label>
            </div>

            <div className="flex space-x-3">
              <div className="w-fit h-fit overflow-hidden flex items-center">
                <button
                  onClick={() => {
                    setAuthorize(true);
                  }}
                  className="h-9 w-32 flex items-center justify-center 
          space-x-2 rounded-sm bg-cyan-750 font-semibold uppercase text-xs text-white outline-none focus:outline-none 
          hover:opacity-80 hover:bg-cyan-700 transition-all"
                >
                  <span>Add product</span>
                </button>
              </div>
            </div>
          </div>

          {/**Table */}
          <div
            className="w-full h-[calc(100%-5.5rem)] overflow-hidden 
      overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar bg-white border-t border-slate-200"
          >
            {inventory_data?.length >= 1 ? (
              <div className="w-full h-full bg-inherit rounded relative">
                <div className="w-full h-[10%] bg-slate-50 border-b border-slate-200 overflow-hidden sticky top-0 left-0 right-0">
                  <div
                    className="w-full h-full flex items-center justify-between overflow-hidden 
           text-[0.65rem] uppercase px-1
           text-slate-500"
                  >
                    <div className="w-[4.76%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center p-2">
                        <input
                          type="checkbox"
                          name="select_all"
                          id="select_all"
                          className="rounded-sm h-4 w-4 border-slate-400"
                          checked={
                            markedArray?.length === inventory_data.length &&
                            markedArray?.length >= 1
                              ? true
                              : false
                          }
                          onChange={(e: any) => {
                            if (e.target.checked === true) {
                              markItem(inventory_data);
                            } else {
                              markItem([]);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-[28.57%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center p-2 font-semibold">
                        Product
                      </div>
                    </div>
                    <div className="w-[19.04%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center p-2 font-semibold">
                        Category
                      </div>
                    </div>
                    <div className="w-[19.04%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center p-2 font-semibold">
                        Price
                      </div>
                    </div>
                    <div className="w-[19.04%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center p-2 font-semibold">
                        In-Stock
                      </div>
                    </div>
                    <div className="w-[9.52%] h-full overflow-hidden">
                      <div className="h-full w-full flex items-center p-2 font-semibold">
                        Actions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[90%] w-full p-1 overflow-hidden">
                  <div
                    className="h-full w-full text-sm text-slate-700
         overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit"
                  >
                    <ProductsList
                      inventory_data={inventory_data}
                      setEdit={setEdit}
                      setCrud={setCrud}
                      setStockObj={setStockObj}
                      markItem={markItem}
                      markedArray={markedArray}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="w-fill h-[calc(100%-5.5rem)] bg-white p-4 
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/*CRUD Modal*/}
      <CrudInventory
        inventory_data={inventory_data}
        crudOpen={crudOpen}
        setCrud={setCrud}
        editAction={editAction}
        setEdit={setEdit}
        setStockObj={setStockObj}
        stockObj={stockObj}
        onlineStatus={onlineStatus}
      />

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

export default Products;
