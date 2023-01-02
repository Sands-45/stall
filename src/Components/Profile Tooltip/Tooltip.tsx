import { FC } from "react";
import { signOut, getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeLocation } from "../../Redux/Slices/UserSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  TbDoorEnter,
  TbSettings,
  TbSwitchHorizontal,
  TbKeyboard,
  TbHeadset,
} from "react-icons/tb";

type Props = {
  position: any;
};

const Tooltip: FC<Props> = ({ position }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = useSelector((state:RootState)=>state.UserInfo.user)

  //component
  return (
    <div
      className={`h-fit w-[13rem] overflow-hidden hidden group-hover:flex flex-col
       justify-between items-center border border-slate-300 shadow-2xl drop-shadow-2xl
        rounded-sm bg-white backdrop-blur-md p-3 absolute z-[9999] ${position}`}
    >
      <div className="h-fit w-full px-1">
        <Link to="" className="w-full h-fit">
          <div
            className="w-full h-9 flex items-center space-x-2
          font-semibold text-slate-500 text-xs hover:bg-slate-50 transition-all"
          >
            {" "}
            <TbSettings className="text-lg" />
            <span>Profile Settings</span>
          </div>
        </Link>
        <Link
          onClick={() => {
            window.localStorage.setItem("current_workspace", "");
          }}
          to="/login"
          className="w-full h-fit"
        >
          <div
            className="w-full h-9 flex items-center space-x-2
          font-semibold text-slate-500 text-xs hover:bg-slate-50 transition-all"
          >
            {" "}
            <TbSwitchHorizontal className="text-lg" />
            <span>Switch Workspace</span>
          </div>
        </Link>
        <Link to="" className="w-full h-fit">
          <div
            className="w-full h-9 flex items-center space-x-2
          font-semibold text-slate-500 text-xs hover:bg-slate-50 transition-all"
          >
            {" "}
            <TbKeyboard className="text-lg" />
            <span>Keyboard Shortcuts</span>
          </div>
        </Link>
        <Link to="" className="w-full h-fit">
          <div
            className="w-full h-9 flex items-center space-x-2
          font-semibold text-slate-500 text-xs hover:bg-slate-50 transition-all"
          >
            {" "}
            <TbHeadset className="text-lg" />
            <span>Help Center</span>
          </div>
        </Link>
      </div>

      {/**Sign Out */}
      <button
        disabled={
          window.localStorage.getItem("dataSynced") === "true" ? false : true
        }
        onClick={() => {
          dispatch(changeLocation("Stall"));
          signOut(auth).then(() => {
            window.localStorage.clear();
            document.title = "Stall";
            navigate("/login");
          });
        }}
        className="mt-2 h-12 w-full hover:opacity-80 transition-all bg-inherit px-1 flex items-center space-x-2
        capitalize text-left font-semibold text-slate-500 text-xs border-t border-slate-200"
      >
        <TbDoorEnter className="text-lg" /> <span>Sign out</span>
      </button>
    </div>
  );
};

export default Tooltip;
