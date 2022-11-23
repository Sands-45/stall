import { FC, useEffect } from "react";
//import logo from "../../Assets/Full Logo Tranparent Short.png";
import userImg from "../../Assets/portal images/user.png";
import { TbBell } from "react-icons/tb";
import Tooltip from "../../Components/Profile Tooltip/Tooltip";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { AppDispatch, RootState } from "../../Redux/store";
import { useSelector, useDispatch } from "react-redux";
import {
  MdPointOfSale,
  MdReceipt,
  MdLoyalty,
  MdAnalytics,
  MdAssignment,
  MdLocalMall,MdTv
} from "react-icons/md";
import {AiFillSetting} from "react-icons/ai"
import {HiUserGroup} from "react-icons/hi"

type Props = {};

const AppShell: FC<Props> = () => {
  const routeLocation = useSelector(
    (state: RootState) => state.UserInfo.routeLocation
  );
  const company = useSelector(
    (state: RootState) => state.UserInfo.current_workspace
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch:AppDispatch = useDispatch();

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


  //Check If User Is Logged
  useEffect(() => {
    if (!company && !user) {
      navigate("/login");
    }
  }, [navigate, user, company]);

  //Component
  return (
    <div className="w-screen h-screen overflow-hidden no-scrollbar no-scrollbar::-webkit-scrollbar bg-slate-200">
      <div className="w-full h-14 bg-white flex items-center justify-between px-[2.5%]">
        <Link
          to="/portal"
          className="focus:outline-none outline-none w-fit h-fit"
        >
          <div className="h-9 px-3 rounded border-2 border-cyan-750 bg-slate-100 text-sm text-cyan-750 font-semibold flex items-center justify-center space-x-2">
           <MdTv className="text-xl"/><span>Portal</span> 
          </div>
        </Link>
        <div className="flex items-center justify-between space-x-3">
          <div className="h-7 w-7 rounded border border-slate-400 flex items-center justify-center text-lg text-slate-600">
            <TbBell />
          </div>
          <div className="h-10 2 w-10 group cursor-pointer rounded-full border border-slate-400 flex items-center justify-center text-xl text-slate-600 relative">
            <img
              src={userImg}
              alt="user"
              className="h-9 object-fit object-center object-cover"
            />
            <Tooltip position="top-14 right-0" />
          </div>
        </div>
      </div>

      {/**Nav list */}
      <nav className="w-full h-12 border-y border-slate-200 bg-white grid grid-cols-8 px-[2.5%]">
        <NavLink
          to="/app"
          className={`navLinks border-l border-slate-200
            px-2 ${
              location.pathname === "/app"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdPointOfSale className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Point of Sale</span>
        </NavLink>
        <NavLink
          to="/app/orders"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/orders"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdReceipt className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Orders</span>
        </NavLink>
        <NavLink
          to="/app/campaigns"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/campaigns"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdLoyalty className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Campaigns</span>
        </NavLink>
        <NavLink
          to="/app/reports"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/reports"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdAnalytics className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Reports</span>
        </NavLink>
        <NavLink
          to="/app/customers"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/customers"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <HiUserGroup className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Customers</span>
        </NavLink>
        <NavLink
          to="/app/inventory"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/inventory"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdAssignment className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Inventory</span>
        </NavLink>
        <NavLink
          to="/app/online-store"
          className={`navLinks
            px-2 ${
              location.pathname === "/app/online-store"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <MdLocalMall className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Online Store</span>
        </NavLink>
        <NavLink
          to="/app/settings"
          className={`navLinks 
            px-2 ${
              location.pathname === "/app/settings"
                ? "border-b-4 border-b-cyan-750 bg-cyan-50"
                : ""
            }`}
        >
          <AiFillSetting className="text-xl" /> <span className="hidden ml:flex whitespace-nowrap max-w-[60%] overflow-hidden text-ellipsis">Setings</span>
        </NavLink>
      </nav>

      {/**Main */}
      <main className="w-full h-[calc(100%-6.55rem)]  overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
