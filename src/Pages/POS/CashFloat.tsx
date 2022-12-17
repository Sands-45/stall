import { FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import no_float from "../../Assets/no_float.png";
import float_no_activity from "../../Assets/float_no_activity.png";
import { getCurrentDateInput } from "../../Custom Functions/Functions";
import { updateFloat } from "../../Redux/Slices/SalesSlice";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { TbChevronRight } from "react-icons/tb";

type Props = {
  openFloat: boolean;
  setFloatOpen: any;
};

const CashFloat: FC<Props> = ({ openFloat, setFloatOpen }) => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const [activityObj, setActivityObj] = useState<any>({
    amount: "",
    time: "",
    note: "",
  });
  const [dates, setDates] = useState<any>({
    startDate: getCurrentDateInput(),
    endDate: getCurrentDateInput(),
  });
  const [selectedFloat, setActiveFloat] = useState<any>(
    cash_float?.length >= 1
      ? [...cash_float]?.sort((a: any, b: any) => b.date - a.date)[0]
      : null
  );
  const activeFloat = useMemo(() => {
    return selectedFloat && cash_float?.length >= 1 ? selectedFloat : null;
  }, [selectedFloat, cash_float]);
  const [floatFunction, setFunction] = useState("");

  //Handle Submit
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    let id = new Date().getTime() + activityObj?.note?.replace(/\s/gim, "");
    if (activityObj?.new) {
      dispatch(
        updateFloat([
          ...cash_float,
          {
            total: (
              activityObj?.amount / selectedCurrency?.rate_multiplier
            )?.toFixed(2),
            status: "open",
            user: user,
            refunds: 0,
            gross: (
              activityObj?.amount / selectedCurrency?.rate_multiplier
            )?.toFixed(2),
            activities: [{ ...activityObj, time: new Date()?.getTime() }],
            date: new Date()?.getTime(),
            id_two: id,
          },
        ])
      );

      //Save local
      window.localStorage.setItem(
        "cash_float",
        JSON.stringify([
          ...cash_float,
          {
            total: (
              activityObj?.amount / selectedCurrency?.rate_multiplier
            )?.toFixed(2),
            status: "open",
            user: user,
            refunds: 0,
            gross: (
              activityObj?.amount / selectedCurrency?.rate_multiplier
            )?.toFixed(2),
            activities: [{ ...activityObj, time: new Date()?.getTime() }],
            date: new Date()?.getTime(),
            id_two: id,
          },
        ])
      );

      setActivityObj({
        amount: "",
        time: "",
        note: "",
      });
    } else {
      if (floatFunction === "add" && activeFloat?.status === "open") {
        dispatch(
          updateFloat([
            ...cash_float.filter(
              (data: any) => data.id_two !== activeFloat?.id_two
            ),
            {
              ...activeFloat,
              total: (
                activityObj?.amount / selectedCurrency?.rate_multiplier +
                parseFloat(activeFloat?.total)
              )?.toFixed(2),
              gross: (
                activityObj?.amount / selectedCurrency?.rate_multiplier +
                parseFloat(activeFloat?.gross)
              )?.toFixed(2),
              activities: [
                ...activeFloat?.activities,
                { ...activityObj, time: new Date()?.getTime() },
              ],
              edited: true,
            },
          ])
        );

        //Save local
        window.localStorage.setItem(
          "cash_float",
          JSON.stringify([
            ...cash_float.filter(
              (data: any) => data.id_two !== activeFloat?.id_two
            ),
            {
              ...activeFloat,
              total: (
                activityObj?.amount / selectedCurrency?.rate_multiplier +
                parseFloat(activeFloat?.total)
              )?.toFixed(2),
              gross: (
                activityObj?.amount / selectedCurrency?.rate_multiplier +
                parseFloat(activeFloat?.gross)
              )?.toFixed(2),
              activities: [
                ...activeFloat?.activities,
                { ...activityObj, time: new Date()?.getTime() },
              ],
              edited: true,
            },
          ])
        );

        setActivityObj({
          amount: "",
          time: "",
          note: "",
        });
      } else if (floatFunction === "minus" && activeFloat?.status === "open") {
        dispatch(
          updateFloat([
            ...cash_float.filter(
              (data: any) => data.id_two !== activeFloat?.id_two
            ),
            {
              ...activeFloat,
              total: (
                parseFloat(activeFloat?.total) -
                activityObj?.amount / selectedCurrency?.rate_multiplier
              )?.toFixed(2),
              gross: (
                parseFloat(activeFloat?.gross) -
                activityObj?.amount / selectedCurrency?.rate_multiplier
              )?.toFixed(2),
              activities: [
                ...activeFloat?.activities,
                {
                  ...activityObj,
                  time: new Date()?.getTime(),
                  amount: "-" + activityObj?.amount,
                },
              ],
              edited: true,
            },
          ])
        );

        //Save local
        window.localStorage.setItem(
          "cash_float",
          JSON.stringify([
            ...cash_float.filter(
              (data: any) => data.id_two !== activeFloat?.id_two
            ),
            {
              ...activeFloat,
              total: (
                parseFloat(activeFloat?.total) -
                activityObj?.amount / selectedCurrency?.rate_multiplier
              )?.toFixed(2),
              gross: (
                parseFloat(activeFloat?.gross) -
                activityObj?.amount / selectedCurrency?.rate_multiplier
              )?.toFixed(2),
              activities: [
                ...activeFloat?.activities,
                {
                  ...activityObj,
                  time: new Date()?.getTime(),
                  amount: "-" + activityObj?.amount,
                },
              ],
              edited: true,
            },
          ])
        );

        setActivityObj({
          amount: "",
          time: "",
          note: "",
        });
      }
    }
  };

  //Component
  return (
    <div
      className={`fixed ${
        openFloat ? "bottom-0 top-0" : "bottom-[200%]"
      } left-0 right-0 transition-all bg-cyan-750/50 backdrop-blur-sm flex justify-center pt-28 overflow-hidden overflow-y-scroll`}
    >
      <div className="w-[45rem] h-[30rem] bg-white rounded relative">
        <div className="h-fit flex justify-between space-x-2 overflow-hidden px-5 mt-5">
          <div
            className="h-fit w-[48.5%]
            flex justify-end space-x-2 overflow-hidden"
          >
            <input
              value={dates?.startDate}
              type="date"
              name="start_date_float"
              id="start_date_float"
              className="w-full h-7 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-500
              focus:border-cyan-750 outline-none focus:outline-none focus:ring-0"
            />
            <input
              value={dates?.endDate}
              type="date"
              name="end_date_float"
              id="end_date_float"
              className="w-full h-7 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-500
              focus:border-cyan-750 outline-none focus:outline-none focus:ring-0"
            />{" "}
          </div>
          {/**Close Float Btn */}
          <button
            onClick={() => {
              setFloatOpen(false);
              setDates({
                startDate: getCurrentDateInput(),
                endDate: getCurrentDateInput(),
              })
            }}
            className="h-7 w-7 rounded-sm bg-slate-50 outline-none text-lg
           text-slate-500 font-medium hover:bg-red-50 transition-all border border-slate-200"
          >
            &times;
          </button>
          {/**Close Float Btn */}
        </div>

        <div className="w-full h-[calc(100%-3rem)] p-4 grid grid-cols-4 gap-4">
          <div className="col-span-2 h-full overflow-hidden p-1 flex flex-col">
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="h-fit grid grid-cols-2 gap-2 overflow-hidden"
            >
              <label
                htmlFor="float_add_amount"
                className="col-span-1 h-10 overflow-hidden relative"
              >
                <span
                  className="absolute top-2.5 left-4 text-sm text-slate-500 w-6 border-r overflow-hidden
                 text-ellipsis whitespace-nowrap"
                >
                  {selectedCurrency?.symbol}
                </span>
                <input
                  onChange={(e) => {
                    setActivityObj((prev: any) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }));
                  }}
                  value={activityObj?.amount}
                  type="text"
                  name="float_add_amount"
                  id="float_add_amount"
                  placeholder="0.00"
                  autoComplete="off"
                  required
                  className="w-full h-full bg-slate-50 rounded-sm border border-slate-300 overflow-hidden 
                  focus:ring-0 focus:border-cyan-750 px-4 pl-12 text-sm text-slate-600 placeholder:text-slate-400"
                />
              </label>
              <div className="col-span-1 h-10 flex items-center justify-between">
                {cash_float?.length >= 1 &&
                cash_float?.filter(
                  (data: any) => data?.status?.toLowerCase() === "open"
                )?.length >= 1 ? (
                  <>
                    <button
                      onClick={() => {
                        setFunction("add");
                      }}
                      type="submit"
                      className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-lg"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setFunction("minus");
                      }}
                      type="submit"
                      className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-lg"
                    >
                      -
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setActivityObj((prev: any) => ({
                        ...prev,
                        new: true,
                      }));
                    }}
                    type="submit"
                    className="h-full w-full rounded-sm focus:outline-none  bg-cyan-750
                     hover:bg-cyan-800 transition-all text-white text-xs uppercase font-medium"
                  >
                    add new
                  </button>
                )}
              </div>
              <textarea
                onChange={(e) => {
                  setActivityObj((prev: any) => ({
                    ...prev,
                    note: e.target.value,
                  }));
                }}
                value={activityObj?.note}
                name="float_note"
                id="float_note"
                placeholder="Add note ..."
                required
                className="col-span-2 h-20 rounded-sm border-2 border-dashed border-slate-200 text-xs
                 hover:border-ccyan-750 transition-all resize-none text-slate-600 placeholder:text-slate-400
                  focus:ring-0 focus:border-cyan-750 bg-slate-50"
              ></textarea>
            </form>

            {/**List Of Floats Registered */}
            <div
              className="mt-4 w-full h-[calc(100%-12rem)] p-0.5 overflow-hidden overflow-y-scroll
            no-scrollbar no-scrollbar::-webkit-scrollbar"
            >
              {cash_float?.length <= 0 ? (
                <div className="w-full h-full flex flex-col items-center pt-16 space-y-4">
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
                [...cash_float]
                  ?.sort((a: any, b: any) => b.date - a.date)
                  ?.map((float: any) => {
                    return (
                      <div
                        onClick={() => {
                          setActiveFloat(float);
                        }}
                        key={float?.id_two}
                        className={`w-full h-16 even:bg-slate-50 ${
                          float?.id_two === activeFloat?.id_two
                            ? "border-l-cyan-750 border-l-2"
                            : ""
                        } border-b border-slate-100 p-2
                       flex flex-col justify-center space-y-1 cursor-pointer select-none`}
                      >
                        <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="w-[60%] font-semibold whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                            {float?.user?.name}
                          </span>
                          <span className="w-[40%] font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-end text-slate-600">
                            {selectedCurrency?.symbol}&nbsp;
                            {float?.total
                              ? numberWithSpaces(
                                  (
                                    selectedCurrency?.rate_multiplier *
                                    Number(float?.total)
                                  ).toFixed(2)
                                )
                              : "0.00"}
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="w-[70%] whitespace-nowrap overflow-hidden text-ellipsis text-[0.7rem] text-slate-400">
                            {new Date(float?.date).toString()?.split("(")[0]}
                          </span>
                          {float?.status === "open" ? (
                            <button
                              onClick={() => {
                                dispatch(
                                  updateFloat([
                                    ...cash_float.filter(
                                      (data: any) =>
                                        data.id_two !== activeFloat?.id_two
                                    ),
                                    {
                                      ...activeFloat,
                                      status: "closed",
                                      edited: true,
                                    },
                                  ])
                                );

                                //Save local
                                window.localStorage.setItem(
                                  "cash_float",
                                  JSON.stringify([
                                    ...cash_float.filter(
                                      (data: any) =>
                                        data.id_two !== activeFloat?.id_two
                                    ),
                                    {
                                      ...activeFloat,
                                      status: "closed",
                                      edited: true,
                                    },
                                  ])
                                );
                              }}
                              className="h-5 px-3 text-[0.6rem] focus:outline-none
                         border border-slate-200 bg-slate-100 rounded"
                            >
                              close
                            </button>
                          ) : (
                            <TbChevronRight className="text-sm text-slate-600" />
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/**List Of Activitirs and Stats */}
          <div className="col-span-2 h-full p-1 pl-4 flex flex-col items-center border-l border-slate-200">
            <div className="w-full h-14 grid grid-cols-3 gap-2">
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-2.5
              flex flex-col justify-between overflow-hidden"
              >
                <span
                  className="text-xs text-center font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.refund
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(activeFloat?.refund)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  refunds
                </span>
              </div>
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-2.5
              flex flex-col justify-between overflow-hidden"
              >
                <span
                  className="text-xs text-center font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.gross
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(activeFloat?.gross)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  Gross
                </span>
              </div>
              <div
                className="h-full col-span-1 rounded-sm border bg-slate-50 p-2.5
              flex flex-col justify-between overflow-hidden"
              >
                <span
                  className="text-xs text-center font-semibold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.total
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          Number(activeFloat?.total)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  Total
                </span>
              </div>
            </div>

            {/**Activity Logs */}
            {activeFloat &&
            activeFloat?.activities?.length >= 1 &&
            cash_float?.length >= 1 ? (
              <ul
                className="mt-4 w-full h-[calc(100%-5rem)] pr-2 py-1 
            overflow-hidden overflow-y-scroll flex flex-col space-y-2"
              >
                {[...activeFloat?.activities]
                  ?.sort((a: any, b: any) => b.time - a.time)
                  ?.map((log: any, index: number) => {
                    return (
                      <li
                        key={index + log?.date}
                        className="w-full h-14 flex flex-col space-y-1 border-b first:border-t border-slate-100 px-1 py-2"
                      >
                        <div className="flex items-center justify-between w-full h-fit">
                          <span
                            className="text-xs capitalize text-slate-500 font-semibold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                          >
                            {log?.note}
                          </span>
                          <span
                            className="text-xs capitalize text-slate-600 font-bold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis text-end"
                          >
                            {selectedCurrency?.symbol}&nbsp;
                            {log?.amount
                              ? numberWithSpaces(
                                  (
                                    selectedCurrency?.rate_multiplier *
                                    Number(log?.amount)
                                  ).toFixed(2)
                                )
                              : "0.00"}
                          </span>
                        </div>
                        <span
                          className="text-xs capitalize text-slate-400 font-medium w-full
                 overflow-hidden whitespace-nowrap text-ellipsis"
                        >
                          {new Date().toString()?.split("(")[0]}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div
                className="mt-4 w-full h-[calc(100%-5rem)] pr-2 py-1 pt-16 
            overflow-hidden flex flex-col space-y-4 items-center"
              >
                <img
                  src={float_no_activity}
                  alt="no_float"
                  className="w-12 h-12 overflow-hidden object-center object-contain opacity-80"
                />
                <span className="text-xs font-medium text-slate-400 text-center px-4">
                  Activities list is empty, select the float you want to view on
                  your left.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFloat;
