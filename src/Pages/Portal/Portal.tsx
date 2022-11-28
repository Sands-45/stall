import { FC, useEffect } from "react";
import logo from "../../Assets/Full Logo Tranparent Short.png";
import userImg from "../../Assets/portal images/user.png";
import { TbBell } from "react-icons/tb";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  MdPointOfSale,
  MdReceipt,
  MdLoyalty,
  MdOutlineStackedBarChart,
  MdAssignment,
  MdLocalMall,
} from "react-icons/md";
import {AiFillSetting} from "react-icons/ai"
import {HiUserGroup} from "react-icons/hi"
import { Link } from "react-router-dom";
import { changeLocation } from "../../Redux/Slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import Tooltip from "../../Components/Profile Tooltip/Tooltip";

type Props = {};

const Portal: FC<Props> = () => {
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const company = useSelector(
    (state: RootState) => state.UserInfo.current_workspace
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  //Check If User Is Logged
  useEffect(() => {
    if (!company && !user) {
      navigate("/login");
    }
  }, [navigate, user, company]);

  //Component ========
  return (
    <div className="w-screen min-h-screen bg-white p-12 flex flex-col items-center justify-between space-y-6">
      <nav className="w-full h-14 flex items-center justify-between">
        <img
          src={logo}
          alt="logo"
          className="-ml-2 h-14 object-fit object-center"
        />
        <div className="flex items-center justify-between space-x-3">
          <div className="h-8 w-8 rounded border border-slate-400 flex items-center justify-center text-xl text-slate-600">
            <TbBell />
          </div>
          <div className="h-12 w-12 group cursor-pointer rounded-full border border-slate-400 flex items-center justify-center text-xl text-slate-600 relative">
            <img
              src={userImg}
              alt="user"
              className="h-10 object-fit object-center object-cover"
            />
            <Tooltip position="top-14 right-0"/>
          </div>
        </div>
      </nav>

      {/**Menu Options */}
      <div className="w-full lg:w-[56rem] h-fit grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-4 gap-6">
        {/**Point Of Sale */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link
            to="/app"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-orange-600 text-white text-xl">
                <MdPointOfSale />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Point of Sale
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Sales */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/sales" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-cyan-700 text-white text-xl">
                <MdReceipt />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Sales
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Campaigns */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/campaigns" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-teal-600 text-white text-xl">
                <MdLoyalty />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Campaigns
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Reports */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/reports" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-blue-600 text-white text-xl">
                <MdOutlineStackedBarChart />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Reports
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Customers */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/customers" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-stone-900 text-white text-xl">
                <HiUserGroup />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Customers
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Inventory */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/inventory" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-red-600 text-white text-xl">
                <MdAssignment />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Inventory
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Online Store */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/online-store" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-indigo-600 text-white text-xl">
                <MdLocalMall />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Online Store
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Settings */}
        <div className="col-span-1 h-[10rem] rounded border border-cyan-900/30 hover:border-cyan-750 hover:drop-shadow-lg transition-all saturate-200 bg-cyan-50/60 overflow-hidden">
          <Link to="/app/settings" className="h-fit w-full outline-none focus:outline-none">
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-amber-600 text-white text-xl">
                <AiFillSetting />
              </div>
              <p className="text-base font-medium text-cyan-800 whitespace-nowrap">
                Settings
              </p>
            </div>
          </Link>{" "}
        </div>
      </div>
      {/**Menu Options */}

      <div className="h-14 w-full flex items-center justify-end">
        <button
          onClick={() => {
            dispatch(changeLocation("Stall"));
            signOut(auth).then(() => {
              window.localStorage.clear();
              document.title = "Stall";
              navigate("/login");
            });
          }}
          className="h-10 px-8 rounded hover:opacity-80 hover:bg-cyan-50 transition-all bg-white border-2 border-cyan-750 uppercase font-semibold text-cyan-750 text-xs"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Portal;
