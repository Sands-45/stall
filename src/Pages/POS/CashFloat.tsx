import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import no_float from "../../Assets/no_float.png";
import float_no_activity from "../../Assets/float_no_activity.png";
import { updateFloat,changeFloatDate} from "../../Redux/Slices/SalesSlice";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { TbPrinter, TbFilter } from "react-icons/tb";
import DatePicker from "../../Components/Date Picker/DatePicker";

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
  const fetched_cash_float = useSelector(
    (state: RootState) => state.Sales.cash_float
  );
  const cash_float_date = useSelector(
    (state: RootState) => state.Sales.cash_float_date
  );
  const cash_float = useMemo(() => {
    return fetched_cash_float.length >= 1 ? fetched_cash_float : [];
  }, [fetched_cash_float]);
  const [activityObj, setActivityObj] = useState<any>({
    amount: "",
    time: "",
    note: "",
  });
  const [activeFloat, setActiveFloat] = useState<any>(
    cash_float?.length >= 1
      ? [...cash_float]?.sort((a: any, b: any) => b.date - a.date)[0]
      : null
  );
  const [floatFunction, setFunction] = useState("");
  const [openDatePicker, setDateOpen] = useState<boolean>(false);
  const [logsType, setType] = useState<any>([
    { name: "All", value: "", field: "note", active: true },
    { name: "Expenses", value: "-", field: "amount", active: false },
    { name: "Void", value: "Voided", field: "note", active: false },
    { name: "Refund", value: "Refund", field: "note", active: false },
  ]);

  //Update Selected Float On change
  useEffect(() => {
    if (cash_float?.length >= 1 || activeFloat) {
      setActiveFloat((prev: any) =>
        prev
          ? cash_float.filter((data: any) => data.id_two === prev?.id_two)[0]
          : cash_float[0]
      );
    }
  }, [cash_float, activeFloat]);

  //Handle Submit
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const localData = () => {
      let temp = window.localStorage.getItem("cash_float");
      return temp ? JSON.parse(temp) : null;
    };

    let uniqueID = () => {
      let name = "float".replace(/[^a-zA-Z]|\s/gi, "");
      let combined = `${
        name?.split("")?.slice(0, 4)?.join("")?.toUpperCase() +
        new Date().getFullYear().toString().slice(2, 4) +
        new Date().toISOString().slice(5, 7) +
        new Date().toISOString().slice(8, 10) +
        "-" +
        new Date().getMilliseconds()?.toString()?.charAt(0) +
        new Date().toISOString().slice(11, 13) +
        new Date().toISOString().slice(14, 16) +
        new Date().toISOString().slice(17, 19)
      }`;
      return combined?.replace(/\s/g, "");
    };

    const currentFloat =
      cash_float?.filter(
        (data: any) =>
          data.status === "open" && data?.user?.email === user?.email
      )[0] ?? null;

    if (activityObj?.new && !currentFloat) {
      dispatch(
        updateFloat([
          ...localData(),
          {
            total:
              Number(activityObj?.amount) / selectedCurrency?.rate_multiplier,
            opening:
              Number(activityObj?.amount) / selectedCurrency?.rate_multiplier,
            sales: 0,
            refunds: 0,
            additional: 0,
            expenses: 0,
            status: "open",
            user: user,
            activities: [
              {
                ...activityObj,
                amount:
                  Number(activityObj?.amount) /
                  selectedCurrency?.rate_multiplier,
                time: new Date()?.getTime(),
                currency: selectedCurrency?.name,
              },
            ],
            date: new Date()?.getTime(),
            id_two: uniqueID(),
            isNew: true,
            isDeleted: false,
            edited: false,
          },
        ])
      );
      //Save local
      window.localStorage.setItem(
        "cash_float",
        JSON.stringify([
          ...localData(),
          {
            total:
              Number(activityObj?.amount) / selectedCurrency?.rate_multiplier,
            opening:
              Number(activityObj?.amount) / selectedCurrency?.rate_multiplier,
            sales: 0,
            refunds: 0,
            additional: 0,
            expenses: 0,
            status: "open",
            user: user,
            activities: [
              {
                ...activityObj,
                amount:
                  Number(activityObj?.amount) /
                  selectedCurrency?.rate_multiplier,
                time: new Date()?.getTime(),
                currency: selectedCurrency?.name,
              },
            ],
            date: new Date()?.getTime(),
            id_two: uniqueID(),
            isNew: true,
            isDeleted: false,
            edited: false,
          },
        ])
      );

      setActivityObj({
        amount: "",
        time: "",
        note: "",
      });
    } else if (currentFloat && !activityObj?.new) {
      if (floatFunction === "add" && currentFloat) {
        if (localData()) {
          //Save local
          window.localStorage.setItem(
            "cash_float",
            JSON.stringify([
              ...localData().filter(
                (data: any) => data.id_two !== currentFloat?.id_two
              ),
              {
                ...currentFloat,
                total:
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier +
                  parseFloat(currentFloat?.total),
                additional:
                  currentFloat?.additional +
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                status: "open",
                user: user,
                activities: [
                  ...currentFloat?.activities,
                  {
                    ...activityObj,
                    amount:
                      Number(activityObj?.amount) /
                      selectedCurrency?.rate_multiplier,
                    time: new Date()?.getTime(),
                    currency: selectedCurrency?.name,
                  },
                ],
                edited: true,
                isNew: false,
                isDeleted: false,
              },
            ])
          );

          dispatch(
            updateFloat([
              ...localData().filter(
                (data: any) => data.id_two !== currentFloat?.id_two
              ),
              {
                ...currentFloat,
                total:
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier +
                  parseFloat(currentFloat?.total),
                additional:
                  currentFloat?.additional +
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                status: "open",
                user: user,
                activities: [
                  ...currentFloat?.activities,
                  {
                    ...activityObj,
                    amount:
                      Number(activityObj?.amount) /
                      selectedCurrency?.rate_multiplier,
                    time: new Date()?.getTime(),
                    currency: selectedCurrency?.name,
                  },
                ],
                edited: true,
                isNew: false,
                isDeleted: false,
              },
            ])
          );

          setActivityObj({
            amount: "",
            time: "",
            note: "",
          });
        }
      } else if (floatFunction === "minus" && currentFloat) {
        if (localData()) {
          //Save local
          window.localStorage.setItem(
            "cash_float",
            JSON.stringify([
              ...localData().filter(
                (data: any) => data.id_two !== currentFloat?.id_two
              ),
              {
                ...currentFloat,
                total:
                  parseFloat(currentFloat?.total) -
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                expenses:
                  currentFloat?.expenses +
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                activities: [
                  ...currentFloat?.activities,
                  {
                    ...activityObj,
                    amount:
                      "-" +
                      Number(activityObj?.amount) /
                        selectedCurrency?.rate_multiplier,
                    time: new Date()?.getTime(),
                    currency: selectedCurrency?.name,
                  },
                ],
                edited: true,
                isNew: false,
                isDeleted: false,
              },
            ])
          );

          dispatch(
            updateFloat([
              ...localData().filter(
                (data: any) => data.id_two !== currentFloat?.id_two
              ),
              {
                ...currentFloat,
                total:
                  parseFloat(currentFloat?.total) -
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                expenses:
                  currentFloat?.expenses +
                  Number(activityObj?.amount) /
                    selectedCurrency?.rate_multiplier,
                activities: [
                  ...currentFloat?.activities,
                  {
                    ...activityObj,
                    amount:
                      "-" +
                      Number(activityObj?.amount) /
                        selectedCurrency?.rate_multiplier,
                    time: new Date()?.getTime(),
                    currency: selectedCurrency?.name,
                  },
                ],
                edited: true,
                isNew: false,
                isDeleted: false,
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
    }
    dispatch(changeFloatDate(cash_float_date));
  };

  //Component
  //console.log(new Blob([JSON.stringify(activeFloat)]).size)

  //Component
  return (
    <>
      <div
        className={`fixed print:hidden print:-right-4 ${
          openFloat ? "bottom-0 top-0" : "bottom-[200%]"
        } left-0 right-0 transition-all bg-slate-200 print:bg-white no-scrollbar no-scrollbar::webkit-scrollbar
        flex flex-col items-center p-6 overflow-hidden overflow-y-scroll print:overflow-hidden print:h-fit z-[99999]`}
      >
        <div
          className="container max-w-[60rem] print:max-w-screen flex flex-col items-center space-y-6 overflow-hidden overflow-y-scroll
       no-scrollbar no-scrollbar::-webkit-scrollbar h-fit"
        >
          <div className="w-full h-10 print:hidden flex justify-between">
            <div className="flex items-center justify-between space-x-4 h-full w-[48.85%]">
              <DatePicker
                openDatePicker={openDatePicker}
                setDateOpen={setDateOpen}
                dates={cash_float_date}
                additionalStyles={`h-10 w-[14rem] bg-white rounded border ${
                  openDatePicker ? "border-cyan-750" : "border-slate-300"
                } text-xs text-slate-600`}
                localName="cash_float_date"
                changeDate={changeFloatDate}
                parentWidth="w-fit"
              />

              <div
                className="rounded h-full w-[calc(100%-15rem)] bg-white relative 
             border border-slate-300 hover:border-cyan-750 transition-all
              hidden lg:flex items-center justify-between px-3 text-[0.65rem] text-slate-600 font-medium cursor-pointer group"
              >
                <span className="uppercase [0.65rem]">
                  {logsType?.filter((data: any) => data?.active)[0]?.name}
                </span>
                <TbFilter className="text-lg group-hover:-rotate-180 transition-all" />
                <div
                  className="absolute bg-slate-50 border border-slate-300
            left-0 right-0 top-[2.45rem] rounded shadow-xl w-full h-fit p-2 z-[99] hidden group-hover:flex flex-col"
                >
                  {logsType?.map((opt: any) => {
                    return (
                      <button
                        key={opt?.name}
                        onClick={() => {
                          setType((prev: any) => [
                            ...prev
                              ?.filter((data: any) => data?.name !== opt?.name)
                              ?.map((data: any) => ({
                                ...data,
                                active: false,
                              })),
                            { ...opt, active: true },
                          ]);
                        }}
                        className="w-full h-8 outline-none focus:outline-none px-1 text-xs text-slate-500 font-medium
              hover:transition-all hover:bg-white last:border-0 border-b border-slate-300 text-left capitalize"
                      >
                        {opt?.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/**Close Float Btn */}
            <button
              onClick={() => {
                setFloatOpen(false);
              }}
              className="h-10 w-10 rounded bg-slate-50 outline-none text-base uppercase
           text-slate-600 font-medium hover:bg-red-50 transition-all border border-slate-300"
            >
              &times;
            </button>
            {/**Close Float Btn */}
          </div>

          <div className="flex justify-between w-full h-fit space-x-6">
            <div className="w-1/2 h-fit print:hidden flex flex-col space-y-6">
              <div className="w-full h-fit rounded bg-white border border-slate-300 p-4">
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className="h-fit print-hidden grid grid-cols-2 gap-2 overflow-hidden"
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
                          amount: e.target.value,
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
                      (data: any) =>
                        data?.status?.toLowerCase() === "open" &&
                        data?.user?.email === user?.email
                    )?.length >= 1 ? (
                      <>
                        <button
                          onClick={() => {
                            setFunction("add");
                          }}
                          type="submit"
                          className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-[0.65rem] uppercase font-semibold"
                        >
                          add
                        </button>
                        <button
                          onClick={() => {
                            setFunction("minus");
                          }}
                          type="submit"
                          className="h-full w-[47%] rounded-sm focus:outline-none
                 bg-cyan-750 hover:bg-cyan-800 transition-all text-white text-[0.65rem] uppercase font-semibold"
                        >
                          remove
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
                        new float
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
                    className="col-span-2 h-[5rem] rounded-sm border-2 border-dashed border-slate-200 text-xs
                 hover:border-ccyan-750 transition-all resize-none text-slate-600 placeholder:text-slate-400
                  focus:ring-0 focus:border-cyan-750 bg-slate-50"
                  ></textarea>
                </form>
              </div>

              {/**List Of Floats Registered */}
              <div className="rounded min-h-[20rem] bg-white border border-slate-300 p-4">
                {cash_float?.length >= 1 && (
                  <span
                    className="mt-4 text-xs uppercase font-semibold
             text-slate-600 w-full h-5 whitespace-nowrap overflow-hidden"
                  >
                    Floats list
                  </span>
                )}
                <div
                  className="mt-2 w-full h-[calc(100%-11rem)] overflow-hidden overflow-y-scroll space-y-3
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
                        No cash floats added yet, either add one above or change
                        the date to see floats for specific dates.
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
                            key={float?.id ?? float?.id_two}
                            className={`w-full h-16 ${
                              float?.id_two === activeFloat?.id_two
                                ? "border-cyan-750"
                                : "border-slate-300"
                            } border  p-2 px-3 rounded bg-white
                       flex flex-col justify-center space-y-1 cursor-pointer select-none`}
                          >
                            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium">
                              <span className="w-[60%] font-semibold whitespace-nowrap overflow-hidden text-ellipsis uppercase">
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
                              <span className="w-[70%] whitespace-nowrap overflow-hidden text-ellipsis text-xs text-slate-400">
                                {
                                  new Date(float?.date)
                                    .toString()
                                    ?.split("(")[0]
                                }
                              </span>
                              {float?.status === "open" ? (
                                <button
                                  onClick={() => {
                                    dispatch(
                                      updateFloat([
                                        ...cash_float.filter(
                                          (data: any) =>
                                            data.id_two !== float?.id_two
                                        ),
                                        {
                                          ...float,
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
                                            data.id_two !== float?.id_two
                                        ),
                                        {
                                          ...float,
                                          status: "closed",
                                          edited: true,
                                        },
                                      ])
                                    );
                                  }}
                                  className="h-5 px-3 text-[0.6rem] focus:outline-none
                         border border-slate-200 bg-slate-100 rounded-sm uppercase"
                                >
                                  close
                                </button>
                              ) : (
                                <TbPrinter
                                  onClick={() => {
                                    setActiveFloat(float);
                                    window.print();
                                  }}
                                  className="text-sm text-slate-600"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            <div className="w-1/2 print:w-full h-full print:h-fit flex flex-col">
              {/**List Of Activitirs and Stats */}
              <div
                className="w-full h-fit print:h-fit flex flex-col space-y-6 items-center justify-between
             print:border-0 border-l border-slate-200"
              >
                <div className="w-full h-40 print:hidden grid grid-cols-3 gap-2">
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.opening
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.opening)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      opening
                    </span>
                  </div>
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.expenses
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.expenses)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      Expenses
                    </span>
                  </div>
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.sales
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.sales)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      Sales
                    </span>
                  </div>
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.refunds
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.refunds)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      refunds
                    </span>
                  </div>
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.additional
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.additional)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      added
                    </span>
                  </div>
                  <div
                    className="h-full col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-center space-y-1 print:space-y-3 overflow-hidden"
                  >
                    <span
                      className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                    >
                      {selectedCurrency?.symbol}&nbsp;
                      {activeFloat?.total
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              parseFloat(activeFloat?.total)
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                    <span
                      className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
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
                    className="mt-4 w-full h-fit min-h-[20rem] border print:border-0 border-slate-300 bg-white rounded p-4 
             flex flex-col space-y-2 print:space-y-4 print:bg-white print:!p-6
             print:absolute print:-left-2 print:-right-2 print:z-[999999] "
                  >
                    <span
                      className="mb-4 text-xs font-semibold
             text-slate-600 w-full h-5 whitespace-nowrap
              overflow-hidden hidden print:flex items-center justify-between capitalize"
                    >
                      <span className="uppercase">
                        {activeFloat?.user?.name} Cash Float
                      </span>
                      <span>{new Date(activeFloat?.date)?.toDateString()}</span>
                    </span>
                    <div className="w-full h-32 print:h-fit hidden print:grid grid-cols-3 gap-2">
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.opening
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.opening)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          opening
                        </span>
                      </div>
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.expenses
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.expenses)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          Expenses
                        </span>
                      </div>
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.sales
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.sales)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          Sales
                        </span>
                      </div>
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.refunds
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.refunds)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          refunds
                        </span>
                      </div>
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.additional
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.additional)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          added amount
                        </span>
                      </div>
                      <div
                        className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
                      >
                        <span
                          className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          {selectedCurrency?.symbol}&nbsp;
                          {activeFloat?.total
                            ? numberWithSpaces(
                                (
                                  selectedCurrency?.rate_multiplier *
                                  parseFloat(activeFloat?.total)
                                ).toFixed(2)
                              )
                            : "0.00"}
                        </span>
                        <span
                          className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                        >
                          Total
                        </span>
                      </div>
                    </div>
                    {[...activeFloat?.activities]
                      ?.filter((log: any) =>
                        log[
                          logsType?.filter((data: any) => data?.active)[0]
                            ?.field
                        ]
                          ?.toString()
                          ?.includes(
                            logsType
                              ?.filter((data: any) => data?.active)[0]
                              ?.value?.toString()
                          )
                      )
                      ?.sort((a: any, b: any) => b.time - a.time)
                      ?.map((log: any, index: number) => {
                        return (
                          <li
                            key={index + log?.time}
                            className="w-full h-14 flex flex-col justify-center space-y-0.5 border-b first:border-t border-slate-100 px-1 py-2"
                          >
                            <div className="flex items-center justify-between w-full h-fit">
                              <span
                                className="text-xs capitalize text-slate-500 font-semibold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis cursor-default"
                              >
                                <abbr title={log?.note}>{log?.note}</abbr>
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
                                        parseFloat(log?.amount)
                                      ).toFixed(2)
                                    )
                                  : "0.00"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span
                                className="text-xs capitalize text-slate-400 font-medium w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                              >
                                {new Date(log?.time).toString()?.split("(")[0]}
                              </span>
                              <span
                                className="text-xs text-end uppercase text-slate-400 font-medium w-[40%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                              >
                                {log?.currency}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                ) : (
                  <div
                    className="mt-4 w-full min-h-[20rem] border border-slate-300 bg-white rounded 
            overflow-hidden print:hidden flex flex-col space-y-4 items-center justify-center pb-10"
                  >
                    <img
                      src={float_no_activity}
                      alt="no_float"
                      className="w-12 h-12 overflow-hidden object-center object-contain opacity-80"
                    />
                    <span className="text-xs font-medium text-slate-400 text-center px-4">
                      Activities list is empty, select the float you want to
                      view on your left.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeFloat &&
        activeFloat?.activities?.length >= 1 &&
        cash_float?.length >= 1 && (
          <ul
            className="w-screen h-fit min-h-[20rem] print:border-0 bg-white
            hidden print:flex flex-col print:space-y-4 print:bg-white p-6
             print:absolute print:z-[999999] top-0 bottom-0"
          >
            <span
              className="mb-4 text-xs font-semibold
             text-slate-600 w-full h-5 whitespace-nowrap
              overflow-hidden hidden print:flex items-center justify-between capitalize"
            >
              <span className="uppercase">
                {activeFloat?.user?.name} Cash Float
              </span>
              <span>{new Date(activeFloat?.date)?.toDateString()}</span>
            </span>
            <div className="w-full h-32 print:h-fit hidden print:grid grid-cols-3 gap-2">
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.opening
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.opening)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  opening
                </span>
              </div>
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.expenses
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.expenses)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  Expenses
                </span>
              </div>
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.sales
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.sales)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  Sales
                </span>
              </div>
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.refunds
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.refunds)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  refunds
                </span>
              </div>
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.additional
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.additional)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  added amount
                </span>
              </div>
              <div
                className="h-20 col-span-1 border border-slate-300 bg-white p-4 rounded
              flex flex-col justify-between space-y-2 overflow-hidden"
              >
                <span
                  className="text-sm text-center px-1 font-bold text-slate-600 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  {selectedCurrency?.symbol}&nbsp;
                  {activeFloat?.total
                    ? numberWithSpaces(
                        (
                          selectedCurrency?.rate_multiplier *
                          parseFloat(activeFloat?.total)
                        ).toFixed(2)
                      )
                    : "0.00"}
                </span>
                <span
                  className="text-[0.7rem] text-center px-1 uppercase font-semibold text-slate-500 w-full whitespace-nowrap overflow-hidden
                text-ellipsis"
                >
                  Total
                </span>
              </div>
            </div>
            {[...activeFloat?.activities]
              ?.sort((a: any, b: any) => b.time - a.time)
              ?.map((log: any, index: number) => {
                return (
                  <li
                    key={index + log?.time}
                    className="w-full h-14 flex flex-col justify-center space-y-0.5 border-b first:border-t border-slate-100 px-1 py-2"
                  >
                    <div className="flex items-center justify-between w-full h-fit">
                      <span
                        className="text-xs capitalize text-slate-500 font-semibold w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis cursor-default"
                      >
                        <abbr title={log?.note}>{log?.note}</abbr>
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
                                parseFloat(log?.amount)
                              ).toFixed(2)
                            )
                          : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className="text-xs capitalize text-slate-400 font-medium w-[60%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        {new Date(log?.time).toString()?.split("(")[0]}
                      </span>
                      <span
                        className="text-xs text-end uppercase text-slate-400 font-medium w-[40%]
                 overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        {log?.currency}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
    </>
  );
};

export default CashFloat;
