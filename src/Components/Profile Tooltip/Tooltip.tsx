import { FC } from "react";
import { signOut, getAuth } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeLocation } from "../../Redux/Slices/UserSlice";
import { AppDispatch } from "../../Redux/store";

type Props = {
  position: any;
};

const Tooltip: FC<Props> = ({ position }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  //component
  return (
    <div
      className={`h-[20rem] w-[15rem] overflow-hidden hidden group-hover:flex flex-col justify-between items-center border border-cyan-900/50 shadow-2xl drop-shadow-2xl rounded-lg bg-cyan-50/50 backdrop-blur-md p-3 absolute z-[9999] ${position}`}
    >
      <div></div>

      {/**Sign Out */}
      <button
        onClick={() => {
          dispatch(changeLocation("Stall"));
          signOut(auth).then(() => {
            window.localStorage.clear();
            document.title = "Stall";
            navigate("/login");
          });
        }}
        className="h-10 w-full rounded hover:opacity-80 transition-all bg-red-600 uppercase font-semibold text-white text-xs"
      >
        Sign out
      </button>
    </div>
  );
};

export default Tooltip;
