import { FC } from "react";
import { signOut } from "firebase/auth";
import {auth} from "../../Firebase/Firebase"
import { useNavigate } from "react-router-dom";
import { changeLocation, updateUserData } from "../../Redux/Slices/UserSlice";
import { TbChevronLeft,TbPower } from "react-icons/tb";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { setCurrency } from "../../Redux/Slices/SettingsSlice";

type Props = {
  overlayMenuOpen: boolean;
  setMenuOverlay: any;
};

const MenuOverlay: FC<Props> = ({ overlayMenuOpen, setMenuOverlay }) => {
  const dispatch:AppDispatch = useDispatch();
  const currencies = useSelector(
    (state: RootState) => state.SettingsData.currencies
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const navigate = useNavigate();

  //Component
  return (
    <div
      className={`${
        overlayMenuOpen ? "left-0 right-0" : "-left-[200%]"
      } fixed top-0 bottom-[3.75rem] bg-white z-[9999] min-w-screen transition-all duration-500 overflow-hidden pb-2`}
    >
      <div className="w-full h-full flex flex-col space-y-4">
        <div className="h-12 w-full px-4 pt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setMenuOverlay(false);
            }}
            className="outline-none focus:outline-none flex items-center justify-center
            text-xl h-9 w-9 bg-slate-100 rounded text-slate-500 border border-slate-200"
          >
            <TbChevronLeft />
          </button>
          <div className="h-fit w-fit flex items-center space-x-4">
          <select
            onChange={(e: any) => {
              dispatch(setCurrency(JSON.parse(e.target.value)));
              window.localStorage.setItem("selectedCurrency", e.target.value);
            }}
            className="h-9 w-[8rem] text-gray-500 focus:outline-none
              uppercase text-xs font-semibold rounded bg-slate-50 pt-2 border border-slate-300 focus:ring-0 focus:border-cyan-750"
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
          <button
        disabled={
          window.localStorage.getItem("dataSynced") === "true" ? false : true
        }
        onClick={() => {
          dispatch(changeLocation("Stall"));
          dispatch(updateUserData(null));
          signOut(auth).then(() => {
            window.localStorage.clear();
            document.title = "Stall";
            navigate("/login");
          });
        }}
         className="h-9 w-9 rounded bg-red-50 text-red-600 text-ms flex items-center justify-center
          border border-red-300">
            <TbPower/>
          </button>
          </div>
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
