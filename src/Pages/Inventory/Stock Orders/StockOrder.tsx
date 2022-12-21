import { FC, useState } from "react";
import Authorize from "../../../Components/Authorize/Authorize";
import CrudOrders from "./CrudOrders";

type Props = {};

const StockOrder: FC<Props> = () => {
  const [crudOpen, openCrud] = useState<boolean>(false);
  const [showAuthorize, setAuthorize] = useState<boolean>(false);

  const crudAction = (verify: any) => {
    if (verify) {
      openCrud(true);
      setAuthorize(false);
    }
  };

  //Component
  return (
    <>
      <div className="w-full h-full bg-white p-4 border border-slate-200 rounded">
        <div className="h-9 w-full overflow-hidden flex justify-between">
          <span className="text-lg font-semibold text-slate-700">
            Stock Orders
          </span>
          <div className="flex items-center space-x-4">
            <input
              type="search"
              name="filterOrders"
              id="filterOrders"
              placeholder="Filter orders ..."
              className="w-[15rem] h-9 rounded-sm border-slate-300 bginherit
               text-xs text-slate-500 placeholder:text-slate-500 px-2 focus:ring-0 focus:border-cyan-750"
            />
            <button
              onClick={() => {
                setAuthorize(true);
              }}
              className="h-9 w-32 flex items-center justify-center rounded-sm
          space-x-2 font-medium uppercase text-xs text-white bg-cyan-750 outline-none 
          focus:outline-none hover:bg-cyan-800 transition-all"
            >
              <span>Create order</span>
            </button>
          </div>
        </div>
      </div>

      {/**Auth */}
      <CrudOrders crudOpen={crudOpen} openCrud={openCrud} />

      {/**Auth */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={crudAction}
        showReason={false}
      />
    </>
  );
};

export default StockOrder;
