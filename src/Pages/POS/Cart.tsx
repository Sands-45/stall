import { FC } from "react";
import {
  TbListSearch,
} from "react-icons/tb";

type Props = {};

const Cart: FC<Props> = () => {
  return (
    <div className="h-full w-[23rem] bg-white p-4 pt-4 flex flex-col justify-between items-center">
      <label htmlFor="search_cart" className="w-full h-fit pt-0.5 relative">
        <TbListSearch className="absolute right-4 top-3.5 text-slate-500 text-lg" />
        <input
          type="search"
          name="search_cart"
          id="search_cart"
          placeholder="Search Cart ..."
          className="w-full h-10 rounded-full border border-slate-200 px-4
           text-xs text-slate-600 placeholder:text-slate-400 bg-slate-50
           focus:ring-0 focus:border-cyan-750 transition-all"
        />
      </label>

      {/**Cart List */}
      <div></div>

      {/**Totals */}
      <div
        className="w-full h-[10rem] 
       flex flex-col justify-between"
      >
        <div className="w-full"></div>
        <div className="w-full h-fit flex items-center justify-between">
          <button
            className="h-10 w-[50%] bg-cyan-750 hover:bg-cyan-800 transition-all rounded rounded-r-none
            text-white text-xs uppercase font-medium"
          >
            check-out
          </button>
          <button
            className="h-10 w-[50%] bg-cyan-750 hover:bg-cyan-800 transition-all rounded rounded-l-none
            text-white text-xs uppercase font-medium border-l border-slate-100"
          >
            park cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
