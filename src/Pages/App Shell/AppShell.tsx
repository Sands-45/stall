import { FC, useEffect, useMemo, useState } from "react";
//import logo from "../../Assets/Full Logo Tranparent Short.png";
//import userImg from "../../Assets/portal images/user.png";
import { TbMessage2, TbCloudOff, TbCloudSnow } from "react-icons/tb";
import Tooltip from "../../Components/Profile Tooltip/Tooltip";
import { NavLink, Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  MdReceipt,
  MdLoyalty,
  MdAnalytics,
  MdAssignment,
  MdStore,
  MdSupervisorAccount,
} from "react-icons/md";
import {
  HiOutlineViewGrid,
  HiShoppingBag,
  HiOutlineCollection,
} from "react-icons/hi";
import { AiFillSetting } from "react-icons/ai";
import { setCurrency } from "../../Redux/Slices/SettingsSlice";
import FirestoreFunc from "../../Firebase/Firestore_Func";
import AlertsWrapper from "../../Components/Toast Notifications/AlertsWrapper";
import { auth } from "../../Firebase/Firebase";
import MenuOverlay from "./MenuOverlay";

type Props = {};

const AppShell: FC<Props> = () => {
  const [onlineStatus, isOnline] = useState<boolean>(navigator.onLine);
  const [overlayMenuOpen, setMenuOverlay] = useState<boolean>(false);
  const routeLocation = useSelector(
    (state: RootState) => state.UserInfo.routeLocation
  );
  const company = useSelector(
    (state: RootState) => state.UserInfo.current_workspace
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const currencies = useSelector(
    (state: RootState) => state.SettingsData.currencies
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const stock_orders = useSelector(
    (state: RootState) => state.Inventory.stock_orders
  );
  const vendors = useSelector((state: RootState) => state.Inventory.vendors);
  const sales = useSelector((state: RootState) => state.Sales.completed_sales);
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const isDataSync = useMemo(() => {
    if (
      inventory_data_queue?.length >= 1 ||
      cash_float?.filter(
        (data: any) => data?.isNew || data?.isDeleted || data?.edited
      )?.length >= 1 ||
      stock_orders?.filter(
        (data: any) => data?.isNew || data?.isDeleted || data?.edited
      )?.length >= 1 ||
      vendors?.filter(
        (data: any) => data?.isNew || data?.isDeleted || data?.edited
      )?.length >= 1 ||
      sales?.filter(
        (data: any) => data?.isNew || data?.isDeleted || data?.edited
      )?.length >= 1
    ) {
      window.localStorage.setItem("dataSynced", "false");
      return false;
    } else {
      window.localStorage.setItem("dataSynced", "true");
      return true;
    }
  }, [inventory_data_queue, stock_orders, cash_float, vendors, sales]);
  //Update Title On route change
  useEffect(() => {
    window.localStorage.setItem("locationPath", routeLocation);
    document.title =
      location.pathname === "/"
        ? `Stall | ${company ? company : ""}`
        : `Stall | ${company ? company : ""} ${routeLocation
            .split("/")
            .join(" | ")}`;
    //dispatch(changeLocation(location.pathname));
  }, [routeLocation, dispatch, location, company]);

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

  //Check If User Is Logged
  useEffect(() => {
    if (!company && !user) {
      navigate("/login");
    }
  }, [navigate, user, company]);

  //Component
  return (
    <>
      <div
        className="w-screen h-screen overflow-hidden no-scrollbar
     no-scrollbar::-webkit-scrollbar bg-slate-200 hidden lg:block"
      >
        {/**FireStore */}
        {auth.currentUser && user?.email && <FirestoreFunc />}
        {/**FireStore */}
        {/**Alert */}
        <AlertsWrapper />
        {/**Alert */}
        <div className="w-full h-14 bg-white flex items-center justify-between px-[2.5%]">
          <div className="w-fit h-fit">
            <select
              onChange={(e: any) => {
                dispatch(setCurrency(JSON.parse(e.target.value)));
                window.localStorage.setItem("selectedCurrency", e.target.value);
              }}
              className="h-8 w-[8rem] text-gray-500 focus:outline-none
              uppercase text-xs font-semibold rounded-sm bg-slate-50 pt-1.5 border-2 border-slate-300 focus:ring-0 focus:border-cyan-750"
            >
              <option value={selectedCurrency}>{selectedCurrency.name}</option>
              {currencies?.map((cur: any) => {
                return (
                  <option key={cur.name} value={JSON.stringify(cur)}>
                    {cur.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-center space-x-2 w-fit">
            <div className="h-8 w-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-lg text-slate-500">
              <TbMessage2 />
            </div>
            <div className="h-8 w-8 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-lg text-slate-500">
              <abbr title={isDataSync ? "Data synced" : "Data not synced"}>
                {!isDataSync ? <TbCloudOff /> : <TbCloudSnow />}
              </abbr>
            </div>
            <div
              className="h-9 w-9 group cursor-pointer rounded-full
           flex items-center justify-center text-xl text-slate-600 relative"
            >
              <div
                className="h-9 w-9 bg-cyan-750 rounded-full flex items-center
             justify-center text-white text-sm font-bold uppercase"
              >
                {user?.name?.charAt(0)}
              </div>
              <div
                className={`h-2.5 w-2.5 rounded-full absolute top-0.5 -right-0.5 border border-white ${
                  onlineStatus ? "bg-green-600" : "bg-red-500"
                }`}
              ></div>
              <Tooltip position="top-9 right-0" />
            </div>
          </div>
        </div>

        {/**Nav list */}
        <nav
          className="w-full min-w-[50rem] h-12 border-y border-slate-200 bg-white hidden md:grid grid-cols-8 px-[2.5%] overflow-hidden
      overflow-x-scroll no-scrollbar no-scrollbar::-webkit-scrollbar"
        >
          <NavLink
            to="/app"
            className={`navLinks border-l border-slate-200
            px-2 ${
              location.pathname === "/app"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <HiShoppingBag className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Point of Sale
            </span>
          </NavLink>
          <NavLink
            to="/app/sales"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/sales"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdReceipt className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Sales
            </span>
          </NavLink>
          <NavLink
            to="/app/reports"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/reports"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdAnalytics className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Reports
            </span>
          </NavLink>
          <NavLink
            to="/app/campaigns"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/campaigns"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdLoyalty className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Campaigns
            </span>
          </NavLink>
          <NavLink
            to="/app/customers"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/customers"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdSupervisorAccount className="text-2xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Customers
            </span>
          </NavLink>
          <NavLink
            to="/app/inventory"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/inventory"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdAssignment className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Inventory
            </span>
          </NavLink>
          <NavLink
            to="/app/online-store"
            className={`navLinks
            px-2 ${
              location.pathname === "/app/online-store"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <MdStore className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Online Store
            </span>
          </NavLink>
          <NavLink
            to="/app/settings"
            className={`navLinks 
            px-2 ${
              location.pathname === "/app/settings"
                ? "after:absolute after:h-[3px] after:bg-cyan-750 after:bottom-0 after:-left-[0.06rem] after:-right-[0.06rem] bg-cyan-50"
                : ""
            }`}
          >
            <AiFillSetting className="text-xl" />{" "}
            <span className="hidden lg:flex whitespace-nowrap max-w-[70%] overflow-hidden text-ellipsis">
              Setings
            </span>
          </NavLink>
        </nav>

        {/**Main */}
        <main className="w-full h-full md:h-[calc(100%-6.55rem)]  overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/**Small Or Mobile App Shell */}
      <div
        className="w-screen h-screen overflow-hidden no-scrollbar
     no-scrollbar::-webkit-scrollbar bg-slate-200 lg:hidden relative"
      >
        {/**FireStore */}
        {auth.currentUser && user?.email && <FirestoreFunc />}
        {/**FireStore */}
        {/**Alert */}
        <AlertsWrapper />
        {/**Alert */}
        <MenuOverlay
          setMenuOverlay={setMenuOverlay}
          overlayMenuOpen={overlayMenuOpen}
        />
        <div className="w-full h-full">
          <Outlet />
        </div>
        {/**Navigation */}
        <div
          className="w-full h-[3.75rem] fixed bottom-0 left-0 right-0 border-t border-slate-200
      bg-white shadow-md flex items-center justify-center space-x-4 p-2 z-[99]"
        >
          <button
            onClick={() => setMenuOverlay((prev: any) => (prev ? false : true))}
            className="h-9 w-9 flex items-center justify-center text-cyan-750
           text-2xl select-none group outline-none focus:outline-none"
          >
            <HiOutlineViewGrid className="group-hover:rotate-180 transition-all" />
          </button>
          <div
            className="h-9 w-9 flex items-center justify-center text-white
           text-xl select-none bg-cyan-750 rounded-lg"
          >
            {location.pathname === "/app" ? (
              <HiShoppingBag />
            ) : location.pathname === "/app/sales" ? (
              <MdReceipt />
            ) : location.pathname === "/app/reports" ? (
              <MdAnalytics />
            ) : location.pathname === "/app/campaigns" ? (
              <MdLoyalty />
            ) : location.pathname === "/app/customers" ? (
              <MdSupervisorAccount />
            ) : location.pathname === "/app/inventory" ? (
              <MdAssignment />
            ) : location.pathname === "/app/online-store" ? (
              <MdStore />
            ) : location.pathname === "/app/settings" ? (
              <AiFillSetting />
            ) : (
              ""
            )}
          </div>
          <button
            className="h-9 w-9 flex items-center justify-center text-cyan-750
           text-2xl select-none group outline-none focus:outline-none"
          >
            <HiOutlineCollection
              className="group-hover:rotate-[360deg] transition-all
             duration-200 ease-in-out"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default AppShell;
