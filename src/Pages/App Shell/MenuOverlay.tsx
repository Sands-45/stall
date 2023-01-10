import { FC } from "react";
import { TbChevronLeft } from "react-icons/tb";
import {
  MdReceipt,
  MdLoyalty,
  MdAnalytics,
  MdAssignment,
  MdStore,
  MdSupervisorAccount,
} from "react-icons/md";
import { HiShoppingBag } from "react-icons/hi";
import { AiFillSetting } from "react-icons/ai";
import { NavLink } from "react-router-dom";

type Props = {
  overlayMenuOpen: boolean;
  setMenuOverlay: any;
};

const MenuOverlay: FC<Props> = ({ overlayMenuOpen, setMenuOverlay }) => {
  //Component
  return (
    <div
      className={`${
        overlayMenuOpen ? "left-0 right-0" : "-left-[200%]"
      } fixed top-0 bottom-[3.75rem] bg-white z-[9999] min-w-screen transition-all duration-500 overflow-hidden pb-2`}
    >
      <div className="w-full h-full flex flex-col space-y-4">
        <div className="h-12 w-full px-4 pt-4">
          <button
            onClick={() => {
              setMenuOverlay(false);
            }}
            className="outline-none focus:outline-none flex items-center justify-center
            text-xl h-9 w-9 bg-slate-100 rounded text-slate-500 border border-slate-200"
          >
            <TbChevronLeft />
          </button>
        </div>

        <div
          className="w-full h-[calc(100%-5rem)] p-4 grid grid-cols-6 gap-4 auto-rows-min overflow-hidden
        overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar"
        >
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <HiShoppingBag className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Point of sale
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/sales"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdReceipt className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Sales
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/reports"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdAnalytics className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Reports
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/campaigns"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdLoyalty className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              campaigns
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/customers"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdSupervisorAccount className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              customers
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/inventory"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdAssignment className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Inventory
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/online-store"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <MdStore className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Online Store
            </span>
          </NavLink>
          <NavLink
            onClick={() => {
              setMenuOverlay(false);
            }}
            to="/app/settings"
            className="col-span-3 sm:col-span-2 h-32 bg-slate-100 rounded border border-slate-200 group
            hover:border-cyan-750 transition-all flex flex-col items-center justify-center space-y-2
            text-slate-600"
          >
            <AiFillSetting className="text-2xl group-hover:text-cyan-750" />
            <span className="text-sm font-bold  capitalize group-hover:text-cyan-750">
              Settings
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
