import { FC } from "react";
import {
  TbSearch,
  TbQrcode,
  TbShoppingCartPlus,
  TbMinus,
  TbPlus,
  TbColorSwatch,
} from "react-icons/tb";
import no_gallery from "../../Assets/no_gallery.png";

type Props = {};

const PointOfSell: FC<Props> = () => {
  return (
    <div
      className="w-full h-full flex justify-between
     overflow-hidden pl-[2.5%] space-x-4"
    >
      <div className="h-full w-[calc(100%-25rem)] py-4">
        <div className="h-full w-full flex flex-col space-y-3">
          <div
            className="h-12 w-full bg-white rounded
          grid grid-cols-10 overflow-hidden"
          >
            {/** Search */}
            <div className="h-full col-span-8 relative">
              <TbSearch className="absolute text-xl text-slate-500 top-3.5 left-2.5" />
              <input
                type="search"
                name="point_of_sale_main_search"
                id="point_of_sale_main_search"
                className="h-full w-full rounded rounded-r-none p-2 px-3 pl-9 text-xs text-slate-600 placeholder:text-slate-400
              border-slate-300 focus:border-cyan-750 focus:ring-0"
                placeholder="Quick Search ..."
              />
            </div>
            <button
              className="col-span-2 h-full bg-slate-100
             border border-l-0 border-slate-300 rounded rounded-l-none flex items-center justify-center
             space-x-3 text-slate-600 hover:bg-cyan-750 hover:text-white transition-all"
            >
              <span className="uppercase font-medium text-xs">Scan</span>
              <TbQrcode className="text-xl" />
            </button>
          </div>
          {/** Categories */}
          <div className="w-full h-8 flex space-x-3 items-center">
            <button
              className="h-full w-fit p-1 pr-3 bg-white rounded-full border border-slate-300 text-xs
             text-slate-500 capitalize hover:text-cyan-750 hover:border-cyan-750 flex 
             items-center space-x-2 transition-all"
            >
              {" "}
              <img
                src={no_gallery}
                alt="prod_img"
                className="h-full w-fit overflow-hidden
              rounded-full border border-slate-200 object-cover object-center"
              />
              <span>earphones</span>{" "}
            </button>
          </div>
          {/** Products */}
          <div
            className="w-fill h-[calc(100%-5.5rem)] rounded bg-white p-4 
          overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar grid grid-cols-5 gap-3"
          >
            <div
              className="col-span-1 h-[12rem] bg-slate-100 rounded border border-cyan-750/30
            hover:border-cyan-750 transition-all shadow-md flex flex-col justify-between p-2 cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"
                alt="product-img"
                className="h-[50%] w-full overflow-hidden object-center object-cover
                border border-slate-200 bg-white rounded"
              />
              <div className="h-[50%] w-full flex flex-col justify-between space-y-1">
                <div className="flex flex-col justify-between w-full h-[calc(100%-2.25rem)] pt-2 pb-1">
                  <div className="w-full flex justify-between items-center px-1">
                    <span className="text-xs font-semibold text-slate-500 capitalize w-[calc(100%-1.75rem)]">
                      iPhone XR
                    </span>
                    <button className="h-6 w-6 flex items-center justify-center
                     border bg-cyan-750 hover:bg-cyan-800 transition-all rounded-full">
                      <TbColorSwatch className="text-white text-sm" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 capitalize px-1 w-full">
                    $ 1 022.90
                  </span>
                </div>
                <div className="h-8 w-full bg-inherit rounded flex items-center justify-between space-x-2">
                  <div className="h-full w-[calc(100%-2.5rem)] flex items-center justify-between rounded">
                    <button
                      className="flex items-center justify-center rounded rounded-r-none border
                    border-cyan-750/70 h-full w-7 text-base text-cyan-750 hover:bg-cyan-50 transition-all"
                    >
                      <TbMinus />
                    </button>
                    <input
                      value="0"
                      type="text"
                      name="incement_item_number"
                      className="h-full w-[calc(100%-3.5rem)] border-0 border-y border-cyan-750/40 focus:border-cyan-750/40 focus:ring-0 bg-inherit
                    text-xs placeholder:text-slate-400 text-slate-600 flex items-center justify-center text-center overflow-hidden
                    "
                    />
                    <button
                      className="flex items-center justify-center rounded rounded-l-none border
                    border-cyan-750/70 h-full w-7 text-base text-cyan-750 hover:bg-cyan-50 transition-all"
                    >
                      <TbPlus />
                    </button>
                  </div>
                  <button
                    className="h-full w-8 rounded bg-cyan-750 hover:bg-cyan-800 transition-all text-white 
                  text-base flex items-center justify-center"
                  >
                    <TbShoppingCartPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** ============= Cart ================ */}
      <div className="h-full w-[25rem] bg-white"></div>
    </div>
  );
};

export default PointOfSell;
