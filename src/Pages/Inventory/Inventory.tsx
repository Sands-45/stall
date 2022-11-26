import { FC, useState,useEffect } from "react";
import { TbDatabaseExport, TbDatabaseImport, TbFilter ,TbQrcode} from "react-icons/tb";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import CrudInventory from "./CrudInventory";
import InventoryList from "./InventoryList";

type Props = {};

const Inventory: FC<Props> = () => {
  const [onlineStatus, isOnline] = useState<boolean>(navigator.onLine);
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const [crudOpen, setCrud] = useState<boolean>(false);
  const [editAction, setEdit] = useState<boolean>(false);
  const [stockObj, setStockObj] = useState<any>({
    id: "",
    name: "",
    product_id: "",
    category: "",
    description: "",
    price_in_usd: 0,
    in_stock: 0,
    customization_option: [],
    gallery: [],
    best_before: "",
  });


  //Listen For Offline and Online Changes
  useEffect(() => {
    const setOnline = () => {
      isOnline(true);
    };
    const setOffline = () => {
      isOnline(false);
    };
      window.addEventListener('offline', setOffline);
      window.addEventListener('online', setOnline);
  
      // cleanup if we unmount
      return () => {
        window.removeEventListener('offline', setOffline);
        window.removeEventListener('online', setOnline);
      }
    }, []);

  //Component
  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden px-[2.5%] py-3 space-y-2">
        <div className="h-[10%] w-full flex justify-between items-center">
          {/**Search and Filters Option */}
          <div className="flex items-center space-x-3">
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
              <span>scan</span><TbQrcode className="text-lg"/>
            </button></div>
          </div>
        </div>

        {/**Table */}
        <div
          className="w-full h-[87.5%] rounded overflow-hidden 
      overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar bg-white border border-slate-300"
        >
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
              />
            </tbody>
          </table>
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
