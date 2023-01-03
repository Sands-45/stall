import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { TbChevronLeft, TbChevronRight, TbCalendarEvent } from "react-icons/tb";
import useOnClickOutside from "../../Custom-Hooks/useOnClickOutsideRef";

type Props = { openDatePicker: any; setDateOpen: any; dates: any;additionalStyles:string;localName:string;changeDate:any;parentWidth:string; };

const DatePicker: FC<Props> = ({ openDatePicker, setDateOpen, dates,additionalStyles,localName ,changeDate,parentWidth}) => {
  const dispatch: AppDispatch = useDispatch();
  const [startDate, setStartDate] = useState<any>(dates?.start);
  const [end, setEnd] = useState<any>(dates?.end);
  const [months, setMonths] = useState<any>([
    startDate,
    new Date(
      new Date(startDate)?.setMonth(new Date(startDate).getMonth() + 1)
    )?.getTime(),
  ]);

  //Check if start Date is selected  ==============
  const [startSelected, setStartSelect] = useState<boolean>(false);

  //Overlap Start Dates ==============
  const overlapStartDate = () => {
    let days = new Date(
      new Date(months[0]).getFullYear(),
      new Date(months[0]).getMonth(),
      1
    ).getDay();
    let arr = [];
    for (let i = 1; i <= days; i++) {
      arr.push(i);
    }
    return arr;
  };
  const overlapStartDateTwo = () => {
    let days = new Date(
      new Date(months[1]).getFullYear(),
      new Date(months[1]).getMonth(),
      1
    ).getDay();
    let arr = [];
    for (let i = 1; i <= days; i++) {
      arr.push(i);
    }
    return arr;
  };

  //Days In A Month
  const getDays = (year: number, month: number) => {
    let days = new Date(year, month, -0).getDate();
    let arr = [];
    for (let i = 1; i <= days; i++) {
      arr.push({ day: i, dayMilli: new Date(year, month, i).getTime() });
    }
    return arr;
  };

  //Close Picker OnClick Outside ======
  const pickerRef = useOnClickOutside(() => {
    setDateOpen(false);
  });

  //Component
  return (
    <div ref={pickerRef} className={`relative ${parentWidth}`}>
      <button
        onClick={() => {
          setDateOpen(true);
        }}
        className={`${additionalStyles} relative
  overflow-hidden flex justify-between items-center`}
      >
        <div
          className={`h-full w-9 border-r border-slate-200 flex items-center justify-center
    text-base`}
        >
          <TbCalendarEvent />
        </div>
        <div
          className="w-[calc(100%-2.5rem)] h-full flex 
      items-center justify-between space-x-1 px-2"
        >
          <span className="w-[40%] whitespace-nowrap overflow-hidden text-ellipsis">{new Date(dates?.start)?.toLocaleDateString()}</span>-
          <span className="w-[40%] whitespace-nowrap overflow-hidden text-ellipsis">{new Date(dates?.end)?.toLocaleDateString()}</span>
        </div>
      </button>

      {/**Content ================== */}
      <div
        className={`absolute top-11 -left-11 md:left-0 z-[99999] h-fit w-[calc(100vw-2rem)] md:w-[33rem] rounded-sm shadow-2xl bg-white dark:bg-slate-700 border ${
          openDatePicker ? "border-cyan-750" : "border-slate-300"
        } dark:border-slate-600 overflow-hidden ${
          openDatePicker ? "grid" : "hidden"
        } text-slate-800 dark:text-slate-300`}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {/**Firs tHalf ================================================ */}
          <div className="col-span-1 w-full space-y-1 p-2 overflow-hidden">
            <div className="h-7 w-full flex items-center justify-between">
              <button
                onClick={() => {
                  setMonths((prev: any[]) => [
                    new Date(
                      new Date(prev[0]).setMonth(
                        new Date(prev[0]).getMonth() - 1
                      )
                    ).getTime(),
                    new Date(
                      new Date(prev[1]).setMonth(
                        new Date(prev[1]).getMonth() - 1
                      )
                    ).getTime(),
                  ]);
                }}
                className="h-6 w-6 flex items-center justify-center bg-slate-100 dark:bg-slate-750 hover:opacity-80 transition-all rounded"
              >
                <TbChevronLeft />
              </button>
              <div className="text-xs font-sans font-semibold uppercase flex items-center justify-end overflow-hidden whitespace-nowrap overflow-ellipsis w-28  tracking-wider">
                {new Date(
                  new Date(months[0]).getFullYear(),
                  new Date(months[0]).getMonth(),
                  1
                ).toLocaleString("en-us", {
                  month: "short",
                })}{" "}
                {new Date(months[0]).getFullYear()}
              </div>
            </div>
            {/**Heding ===================== */}
            <div className="h-7 w-full grid grid-cols-7">
              {["su", "mo", "tu", "we", "th", "fr", "sa"].map((day) => {
                return (
                  <div
                    key={day + 1}
                    className="col-span-1 h-full flex items-center justify-center text-xs capitalize"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            {/**Day ===================== */}
            <div className="h-[10rem] w-full grid grid-cols-7 grid-rows-6 gap-1">
              {/**Overlap ============= */}
              {overlapStartDate()?.map((day) => {
                return (
                  <div
                    key={day + "h"}
                    className="col-span-1 row-span-1 h-full flex items-center justify-center text-xs capitalize "
                  ></div>
                );
              })}
              {/**Days ============= */}
              {getDays(
                new Date(months[0]).getFullYear(),
                new Date(months[0]).getMonth() + 1
              )?.map((day) => {
                return (
                  <button
                    onClick={() => {
                      if (!startSelected) {
                        setStartDate(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setEnd(null);
                        setStartSelect(true);
                      } else if (
                        startSelected &&
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime() >= startDate
                      ) {
                        setEnd(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setStartSelect(false);
                      } else if (
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime() < startDate
                      ) {
                        setStartDate(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setEnd(null);
                        setStartSelect(true);
                      }
                    }}
                    data-date={day.dayMilli}
                    key={day.dayMilli}
                    className={`col-span-1 h-full row-span-1 flex items-center justify-center text-xs capitalize transition-all outline-none focus:outline-none rounded-sm peer ${
                      new Date(
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime()
                      ).toLocaleDateString() === new Date().toLocaleDateString()
                        ? "border border-cyan-750 dark:border-blue-700"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() === startDate
                        ? "bg-cyan-750 dark:bg-blue-700 text-slate-50"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() === end
                        ? "bg-cyan-750 dark:bg-blue-700 text-slate-50"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() > startDate &&
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() < end
                        ? "bg-slate-200 dark:bg-slate-750"
                        : ""
                    }`}
                  >
                    {day?.day}
                  </button>
                );
              })}
            </div>
          </div>
          {/**First Half ================================================ */}

          {/**Second Half ================================================ */}
          <div className="col-span-1 w-full space-y-1 p-2 overflow-hidden">
            <div className="h-7 w-full flex items-center justify-between pl-1">
              <div className="text-xs font-sans font-semibold uppercase flex items-center justify-start overflow-hidden whitespace-nowrap overflow-ellipsis w-28 tracking-wider">
                {new Date(
                  new Date(months[1]).getFullYear(),
                  new Date(months[1]).getMonth(),
                  1
                ).toLocaleString("en-us", {
                  month: "short",
                })}{" "}
                {new Date(months[1]).getFullYear()}
              </div>
              <button
                onClick={() => {
                  setMonths((prev: any[]) => [
                    new Date(
                      new Date(prev[0]).setMonth(
                        new Date(prev[0]).getMonth() + 1
                      )
                    ).getTime(),
                    new Date(
                      new Date(prev[1]).setMonth(
                        new Date(prev[1]).getMonth() + 1
                      )
                    ).getTime(),
                  ]);
                }}
                className="h-6 w-6 flex items-center justify-center bg-slate-100 dark:bg-slate-750 hover:opacity-80 transition-all rounded"
              >
                <TbChevronRight />
              </button>
            </div>
            {/**Heding ===================== */}
            <div className="h-7 w-full grid grid-cols-7">
              {["su", "mo", "tu", "we", "th", "fr", "sa"].map((day) => {
                return (
                  <div
                    key={day + "k"}
                    className="col-span-1 h-full flex items-center justify-center text-xs capitalize"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            {/**Day ===================== */}
            <div className="h-[10rem] w-full grid grid-cols-7 grid-rows-6 gap-1">
              {/**Overlap ============= */}
              {overlapStartDateTwo()?.map((day) => {
                return (
                  <div
                    key={day + "f"}
                    className="col-span-1 row-span-1 h-full flex items-center justify-center text-xs capitalize "
                  ></div>
                );
              })}
              {/**Days ============= */}
              {getDays(
                new Date(months[1]).getFullYear(),
                new Date(months[1]).getMonth() + 1
              )?.map((day) => {
                return (
                  <button
                    onClick={() => {
                      if (!startSelected) {
                        setStartDate(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setEnd(null);
                        setStartSelect(true);
                      } else if (
                        startSelected &&
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime() >= startDate
                      ) {
                        setEnd(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setStartSelect(false);
                      } else if (
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime() < startDate
                      ) {
                        setStartDate(
                          new Date(
                            new Date(day.dayMilli).setMonth(
                              new Date(day.dayMilli).getMonth() - 1
                            )
                          ).getTime()
                        );
                        setEnd(null);
                        setStartSelect(true);
                      }
                    }}
                    key={day.dayMilli}
                    className={`col-span-1 h-full row-span-1 flex items-center justify-center text-xs capitalize transition-all outline-none focus:outline-none rounded-sm peer ${
                      new Date(
                        new Date(
                          new Date(day.dayMilli).setMonth(
                            new Date(day.dayMilli).getMonth() - 1
                          )
                        ).getTime()
                      )?.toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "border border-cyan-750 dark:border-blue-700"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() === startDate
                        ? "bg-cyan-750 dark:bg-blue-700 text-slate-50"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() === end
                        ? "bg-cyan-750 dark:bg-blue-700 text-slate-50"
                        : ""
                    } ${
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() > startDate &&
                      new Date(
                        new Date(day.dayMilli).setMonth(
                          new Date(day.dayMilli).getMonth() - 1
                        )
                      ).getTime() < end
                        ? "bg-slate-200 dark:bg-slate-750"
                        : ""
                    }`}
                  >
                    {day?.day}
                  </button>
                );
              })}
            </div>
          </div>
          {/**Second Half ================================================ */}
        </div>

        {/**Bottom Nav ========================= */}
        <div className="min-h-[2.5rem] py-1 w-full bg-slate-50 dark:bg-slate-750 border-t border-slate-200 dark:border-slate-600 flex justify-end md:justify-between items-center px-1">
          <div className="hidden md:flex items-center justify-between space-x-2 p-1">
            <div className="text-xs dark:text-slate-400 text-slate-700 font-sans w-32 h-8 overflow-hidden whitespace-nowrap overflow-ellipsis p-2 flex items-center justify-center">
              <span className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                <b>From</b> {new Date(startDate).toDateString()}
              </span>
            </div>
            <div className="text-xs dark:text-slate-400 text-slate-700 font-sans w-32 h-8 overflow-hidden whitespace-nowrap overflow-ellipsis p-2 flex items-center justify-center">
              <span className="w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                <b>To</b> {new Date(end ? end : "").toDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-1">
            <button
              onClick={() => {
                setDateOpen(false);
              }}
              className="h-8 w-[6.5rem] bg-inherit dark:text-slate-300 text-slate-900 text-xs font-sans font-medium uppercase hover:opacity-80 transition-all rounded-sm tracking-wider"
            >
              cancel
            </button>
            <button
              onClick={() => {
                dispatch(
                  changeDate({
                    start: startDate,
                    end: end,
                  })
                );
                localStorage.setItem(
                  localName,
                  JSON.stringify({
                    start: startDate,
                    end: end,
                  })
                );
                setDateOpen(false);
              }}
              disabled={end ? false : true}
              className="h-8 w-[6.5rem] bg-cyan-750 dark:bg-blue-700 text-slate-50 text-xs font-sans font-semibold uppercase hover:opacity-80 transition-all rounded-sm disabled:opacity-70 disabled:cursor-not-allowed tracking-wider"
            >
              <abbr
                title="Please Select A Proper End Date"
                className={`${end ? "hidden" : ""}`}
              >
                select end
              </abbr>
              <span className={`${end ? "" : "hidden"} font-semibold`}>
                apply
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
