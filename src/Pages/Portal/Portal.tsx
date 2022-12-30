import { FC, useEffect } from "react";
import userImg from "../../Assets/portal images/user.png";
import { TbMessage2,TbSearch } from "react-icons/tb";
import { signOut, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  MdPointOfSale,
  MdReceipt,
  MdLoyalty,
  MdOutlineStackedBarChart,
  MdAssignment,
  MdLocalMall,
  MdSupervisorAccount,
} from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { Link } from "react-router-dom";
import { changeLocation, updateUserData } from "../../Redux/Slices/UserSlice";
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
        <div className="h-fit w-fit relative shadow-sm rounded overflow-hidden group">
          <TbSearch className="absolute top-3.5 right-[1.15rem] group-focus-within:right-3 text-lg
           text-slate-400 pointer-events-none stroke-[3]"/>
          <input
            type="search"
            name="portal_Search"
            id="portal_Search"
            placeholder="Quick Search ..."
            className="h-11 w-11 focus:w-[10rem] focus:md:w-[23rem] bg-cyan-50/60 border-slate-300
             focus:border-cyan-750 focus:ring-0 rounded pr-10 px-3 transition-all border-[1.5px]
            text-slate-600 text-xs placeholder:text-slate-400 font-medium"
          />
        </div>
        <div className="flex items-center justify-between space-x-3">
          <div className="h-8 w-8 rounded border border-slate-400 flex items-center justify-center text-xl text-slate-600">
            <TbMessage2 />
          </div>
          <div className="h-12 w-12 group cursor-pointer rounded-full border border-slate-400 flex items-center justify-center text-xl text-slate-600 relative">
            <img
              src={userImg}
              alt="user"
              className="h-10 object-fit object-center object-cover"
            />
            <Tooltip position="top-12 right-0" />
          </div>
        </div>
      </nav>

      {/**Menu Options */}
      <div className="w-full lg:w-[56rem] h-fit grid grid-cols-1 sm:grid-cols-2 ml:grid-cols-4 gap-6">
        {/**Point Of Sale */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-600 text-white text-xl">
                <MdPointOfSale />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Point of Sale
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Sales */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/sales"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-cyan-700 text-white text-xl">
                <MdReceipt />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Sales
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Campaigns */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/campaigns"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-teal-600 text-white text-xl">
                <MdLoyalty />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Campaigns
              </p>
            </div>
          </Link>{" "}
        </div>
        {/**Reports */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/reports"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-blue-600 text-white text-xl">
                <MdOutlineStackedBarChart />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Reports
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Customers */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/customers"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-teal-800 text-white text-xl">
                <MdSupervisorAccount className="text-2xl" />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Customers
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Inventory */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/inventory"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-blue-600 text-white text-xl">
                <MdAssignment />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Inventory
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Online Store */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/online-store"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-slate-600 text-white text-xl">
                <MdLocalMall />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Online Store
              </p>
            </div>
          </Link>{" "}
        </div>

        {/**Settings */}
        <div className="portal_cards box-shadow-one">
          <Link
            to="/app/settings"
            className="h-fit w-full outline-none focus:outline-none"
          >
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 flex items-center justify-center rounded bg-cyan-800 text-white text-xl">
                <AiFillSetting />
              </div>
              <p className="text-base font-semibold text-cyan-700 whitespace-nowrap">
                Settings
              </p>
            </div>
          </Link>{" "}
        </div>
      </div>
      {/**Menu Options */}

      <div className="h-14 w-full flex items-center justify-end">
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
          className="h-10 px-8 rounded hover:opacity-80 hover:bg-cyan-50 disabled:cursor-not-allowed
          transition-all border-2 border-cyan-750 uppercase font-bold text-cyan-750 text-xs"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Portal;
