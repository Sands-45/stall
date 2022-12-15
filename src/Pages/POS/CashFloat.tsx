import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import no_float from "../../Assets/no_float.png";
import { getCurrentDateInput } from "../../Custom Functions/Functions";

type Props = {
  openFloat: boolean;
  setFloatOpen: any;
};

const CashFloat: FC<Props> = ({ openFloat, setFloatOpen }) => {
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const [dates, setDates] = useState<any>({
    startDate: getCurrentDateInput(),
    endDate: getCurrentDateInput(),
  });

  //Component
  return (
    <div
      className={`fixed ${
        openFloat ? "bottom-0 top-0" : "bottom-[200%]"
      } left-0 right-0 transition-all bg-cyan-750/50 backdrop-blur-sm flex justify-center pt-28 overflow-hidden overflow-y-scroll`}
    >
      <div className="w-[45rem] h-[30rem] bg-white rounded relative">
        {/**Close Float Btn */}
        <button
          onClick={() => {
            setFloatOpen(false);
          }}
          className="h-8 w-8 rounded-sm bg-white outline-none text-lg text-slate-500 font-medium
        absolute -top-4 -right-12 hover:bg-red-50 transition-all"
        >
          &times;
        </button>
        {/**Close Float Btn */}

        <div className="w-full h-full p-4 grid grid-cols-5 gap-4">
          <div className="col-span-2 h-full overflow-hidden p-1 flex flex-col">
            <div className="h-10 grid grid-cols-2 gap-2 overflow-hidden">
              <label
                htmlFor="float_add_amount"
                className="col-span-1 h-full overflow-hidden relative"
              >
                <span
                  className="absolute top-2.5 left-4 text-sm text-slate-500 w-6 border-r overflow-hidden
                 text-ellipsis whitespace-nowrap"
                >
                  {selectedCurrency?.symbol}
                </span>
                <input
                  type="text"
                  name="float_add_amount"
                  id="float_add_amount"
                  placeholder="0.00"
                  className="w-full h-full bg-slate-50 rounded-sm border border-slate-300 overflow-hidden 
                  focus:ring-0 focus:border-cyan-750 px-4 pl-12 text-sm text-slate-600 placeholder:text-slate-400"
                />
              </label>
              <div className="col-span-1 flex items-center justify-between">
                {cash_float?.length >= 1 &&
                cash_float?.filter(
                  (data: any) => data?.status?.toLowerCase() === "open"
                )?.length <= 0 ? (
                  <>
                    <button
                      className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-lg"
                    >
                      +
                    </button>
                    <button
                      className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-lg"
                    >
                      -
                    </button>
                  </>
                ) : (
                  <button
                    className="h-full w-full rounded-sm focus:outline-none  bg-cyan-750
                     hover:bg-cyan-800 transition-all text-white text-xs uppercase font-medium"
                  >
                    add new
                  </button>
                )}
              </div>
            </div>

            <div
              className="mt-2 h-8
              flex justify-between space-x-2 overflow-hidden"
            >
              <input
                value={dates?.startDate}
                type="date"
                name="start_date_float"
                id="start_date_float"
                className="w-full h-7 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-500"
              />
              <input
                value={dates?.endDate}
                type="date"
                name="end_date_float"
                id="end_date_float"
                className="w-full h-7 bg-slate-50 border border-slate-300 rounded-sm text-xs text-slate-500"
              />
            </div>

            {/**List Of Floats Registered */}
            <div
              className="mt-4 w-full h-[calc(100%-5rem)] p-0.5 overflow-hidden overflow-y-scroll
            no-scrollbar no-scrollbar::-webkit-scrollbar"
            >
              {cash_float?.length <= 0 ? (
                <div className="w-full h-full flex flex-col items-center pt-20 space-y-4">
                  <img
                    src={no_float}
                    alt="no_float"
                    className="w-12 h-12 overflow-hidden object-center object-contain opacity-80"
                  />
                  <span className="text-xs font-medium text-slate-400 text-center px-4">
                    No cash floats added yet, either add one above or change the
                    date to see floats for specific dates.
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/**List Of Activitirs and Stats */}
          <div className="col-span-3 h-full p-1 pl-4 flex flex-col items-center border-l border-slate-200">
            <div className="w-full h-[4.65rem] grid grid-cols-3 gap-2">
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-3
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  $ 00.00
                </span>
                <span
                  className="text-[0.7rem] uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  refunds
                </span>
              </div>
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-3
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  $ 00.00
                </span>
                <span
                  className="text-[0.7rem] uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  net payments
                </span>
              </div>
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-3
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  $ 00.00
                </span>
                <span
                  className="text-[0.7rem] uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  total
                </span>
              </div>
            </div>

            {/**Activity Logs */}
            <ul
              className="mt-4 w-full h-[calc(100%-5rem)] pr-1 
            overflow-hidden overflow-y-scroll flex flex-col space-y-2"
            >
              <li className="w-full h-14 flex flex-col space-y-1 border-b border-slate-200 px-1 py-2">
                <div className="flex items-center justify-between w-full h-fit">
                  <span
                    className="text-xs capitalize text-slate-500 font-semibold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    Lunch money
                  </span>
                  <span
                    className="text-xs capitalize text-slate-600 font-bold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis text-end"
                  >
                    $ 409.90
                  </span>
                </div>
                <span
                    className="text-xs capitalize text-slate-500 font-medium w-full
                 overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {new Date().toString()?.split("(")[0]}
                  </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFloat;
