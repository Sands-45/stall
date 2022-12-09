import { FC, useState, useEffect, useMemo } from "react";
import {
  TbDatabaseExport,
  TbDatabaseImport,
  TbFilter,
  TbQrcode,
  TbTrash,
} from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import CrudInventory from "./CrudInventory";
import InventoryList from "./InventoryList";
import pos_empty from "../../Assets/pos_empty.png";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../Redux/Slices/InventorySlice";
import { Link } from "react-router-dom";

type Props = {};

const Inventory: FC<Props> = () => {
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
    in_stock: "",
    customization_option: [],
    gallery: [],
    best_before: "",
  });
  const [search, setSearch] = useState<string>("");
  const inventory_data = useMemo(() => {
    return [...fetched_inventory_data].filter(
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
    );
  }, [search, fetched_inventory_data]);

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

  //Component
  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden px-[2.5%] py-3 space-y-2">
        <div className="h-[10%] w-full flex justify-between items-center">
          {/**Search and Filters Option */}
          <div className="flex items-center space-x-3">
            {markedArray?.length >= 1 && (
              <button
                onClick={() => {
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
                      ...prev?.filter(
                        (data: any) => data?.id_two !== inven?.id_two
                      ),
                    ]);
                  });
                }}
                className="h-10 w-11 flex items-center justify-center 
          space-x-2 rounded border border-slate-300 hover:border-red-750 bg-white font-semibold uppercase 
          text-xs text-slate-600 hover:text-red-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-red-50 transition-all"
              >
                <TbTrash className="text-xl" />
              </button>
            )}
            <button
              className="h-10 w-11 flex items-center justify-center 
          space-x-2 rounded border border-slate-300 hover:border-cyan-750 bg-white font-semibold uppercase 
          text-xs text-slate-600 hover:text-cyan-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <TbFilter className="text-xl" />
            </button>
            <label htmlFor="search_stock">
              <input
                type="search"
                name="search_stock"
                id="search_stock"
                placeholder="Quick Search ..."
                className="h-10 w-[15rem] rounded
             border-slate-300 p-2 px-3
             focus:border-cyan-750 focus:ring-0 text-xs text-slate-700 placeholder:text-slatee-400"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
              />
            </label>
          </div>

          {/**Export and Import Options */}
          <div className="flex items-center space-x-3">
            <button
              className="h-10 w-28 flex items-center justify-center 
          space-x-2 rounded border border-cyan-750 bg-white font-semibold uppercase 
          text-xs text-cyan-750 outline-none 
          focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <span>export</span>
              <TbDatabaseExport className="text-lg" />
            </button>
            <button
              className="h-10 w-28 flex items-center justify-center 
          space-x-2 rounded border border-cyan-750 bg-white font-semibold 
          uppercase text-xs text-cyan-750 outline-none focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <span>import</span>
              <TbDatabaseImport className="text-lg" />
            </button>
            <div className="w-fit h-fit overflow-hidden flex items-center">
              <button
                onClick={() => {
                  setCrud(true);
                  setEdit(false);
                }}
                className="h-10 w-28 flex items-center justify-center 
          space-x-2 rounded rounded-r-none bg-cyan-750 font-semibold uppercase text-xs text-white outline-none focus:outline-none 
          hover:opacity-80 hover:bg-cyan-700 transition-all"
              >
                <span>Add stock</span>
              </button>
              <button
                onClick={() => {
                  setCrud(true);
                  setEdit(false);
                }}
                className="h-10 w-24 flex items-center justify-center 
          space-x-2 rounded rounded-l-none bg-cyan-750 font-semibold uppercase text-xs text-white outline-none focus:outline-none 
          hover:opacity-80 hover:bg-cyan-700 transition-all border-l border-white/50"
              >
                <span>scan</span>
                <TbQrcode className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/**Table */}
        <div
          className="w-full h-[87.5%] rounded overflow-hidden 
      overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar bg-white border border-slate-300"
        >
          {inventory_data?.length >= 1 ? (
            <table
              className="w-full h-full bg-inherit  rounded
        p-2 relative"
            >
              <thead className="w-full h-[10%] bg-slate-50 border-b border-slate-200 overflow-hidden sticky top-0 left-0 right-0">
                <tr
                  className="w-full h-full flex items-center justify-between overflow-hidden 
           text-xs capitalize
           text-slate-500"
                >
                  <th className="w-[4.76%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center p-2">
                      <input
                        type="checkbox"
                        name="select_all"
                        id="select_all"
                        className="rounded h-4 w-4 border-slate-400"
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
                  </th>
                  <th className="w-[28.57%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center p-2 font-medium">
                      Product
                    </div>
                  </th>
                  <th className="w-[19.04%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center p-2 font-medium">
                      Category
                    </div>
                  </th>
                  <th className="w-[19.04%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center p-2 font-medium">
                      Price
                    </div>
                  </th>
                  <th className="w-[19.04%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center p-2 font-medium">
                      In-Stock
                    </div>
                  </th>
                  <th className="w-[9.52%] h-full overflow-hidden">
                    <div className="h-full w-full flex items-center p-2 font-medium">
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                className="h-[90%] w-full text-sm text-slate-700
         overflow-hidden"
              >
                <InventoryList
                  inventory_data={inventory_data}
                  setEdit={setEdit}
                  setCrud={setCrud}
                  setStockObj={setStockObj}
                  markItem={markItem}
                  markedArray={markedArray}
                />
              </tbody>
            </table>
          ) : (
            <div
              className="w-fill h-[calc(100%-5.5rem)] rounded bg-white p-4 
            overflow-hidden flex flex-col items-center justify-center space-y-4"
            >
              <img
                src={pos_empty}
                alt="no_data"
                className="h-[7rem] w-[6.5rem] opacity-40 overflow-hidden object-center objct-fit"
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
    </>
  );
};

export default Inventory;
