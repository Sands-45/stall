import { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { TbMenu2 } from "react-icons/tb";

type Props = {};

const Inventory: FC<Props> = () => {
  const location = useLocation();

  //Component
  return (
    <>
      <div className="w-full h-full flex justify-between space-x-6 overflow-hidden px-[2.5%] md:pl-0 bg-slate-50 relative">
        {/**Side Menu ============ */}
        <div
          className="h-full w-[16rem] min-w-[16rem] bg-white border-r border-slate-200 
        p-4 pt-8 px-[2.5%] absolute md:relative left-0 top-0 bottom-0 z-[999] md:shadow-none md:drop-shadow-none shadow-lg drop-shadow-lg"
        >
          {/**Close Side Nav */}
          <button
            className="absolute top-6 -right-4 h-8 w-8 rounded border
             border-slate-300 hover:border-cyan-750 transition-all bg-white  text-lg text-cyan-750
          shadow-lg drop-shadow-lg flex items-center justify-center focus:outline-none"
          >
            <TbMenu2 />
          </button>
          {/**Close Side Nav */}
          <div className="text-xs text-slate-500 font-semibold uppercase pb-2 border-b border-slate-200">
            Inventory management
          </div>
          <div className="w-full flex flex-col space-y-2 mt-4">
          <div className="w-full h-fit">
            <NavLink to="/app/inventory" className="w-full h-fit">
              <div
                className={`h-6 w-full px-1 text-xs capitalize font-medium hover:border-cyan-750 ${
                  location.pathname !== "/app/inventory"
                    ? "text-slate-600"
                    : "text-cyan-750"
                }`}
              >
                Products
              </div>
            </NavLink>
          </div>
          <div className="w-full h-fit">
            <NavLink to="/app/inventory/stock-orders" className="w-full h-fit">
              <div
                className={`h-6 w-full px-1 text-xs capitalize font-medium hover:border-cyan-750 ${
                  location.pathname !== "/app/inventory/stock-orders"
                    ? "text-slate-600"
                    : "text-cyan-750"
                }`}
              >
                Stock Orders
              </div>
            </NavLink>
          </div>
          <div className="w-full h-fit">
            <NavLink to="/app/inventory/vendors" className="w-full h-fit">
              <div
                className={`h-6 w-full px-1 text-xs capitalize font-medium hover:border-cyan-750 ${
                  location.pathname !== "/app/inventory/vendors"
                    ? "text-slate-600"
                    : "text-cyan-750"
                }`}
              >
                Vendors
              </div>
            </NavLink>
          </div>
          <div className="w-full h-fit">
            <NavLink to="/app/inventory/forecast" className="w-full h-fit">
              <div
                className={`h-6 w-full px-1 text-xs capitalize font-medium hover:border-cyan-750 ${
                  location.pathname !== "/app/inventory/forecast"
                    ? "text-slate-600"
                    : "text-cyan-750"
                }`}
              >
                Forecast
              </div>
            </NavLink>
          </div>
          <div className="w-full h-fit">
            <NavLink to="/app/inventory/settings" className="w-full h-fit">
              <div
                className={`h-6 w-full px-1 text-xs capitalize font-medium hover:border-cyan-750 ${
                  location.pathname !== "/app/inventory/settings"
                    ? "text-slate-600"
                    : "text-cyan-750"
                }`}
              >
                Settings
              </div>
            </NavLink>
          </div></div>
        </div>

        {/**Main ============ */}
        <div className="h-full w-full md:w-[calc(100%-17rem)] py-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Inventory;
