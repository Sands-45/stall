import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import Authorize from "../../Components/Authorize/Authorize";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../Redux/Slices/InventorySlice";
import { addSales, archieveSale } from "../../Redux/Slices/SalesSlice";
import { updateAlert } from "../../Redux/Slices/NotificationsSlice";
import Refund from "./Refund";
import { updateFloat } from "../../Redux/Slices/SalesSlice";

type Props = {
  showActions: boolean;
  setActions: any;
  setCurrentSale: any;
  currentSale: any;
};

const SaleActions: FC<Props> = ({
  showActions,
  setActions,
  setCurrentSale,
  currentSale,
}) => {
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );
  const selectedCurrency = useSelector(
    (state: RootState) => state.SettingsData.selectedCurrency
  );
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);
  const [showAuthorize, setAuthorize] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const completed_sales = useSelector(
    (state: RootState) => state.Sales.completed_sales
  );
  const transactions_archieve = useSelector(
    (state: RootState) => state.Sales.transactions_archieve
  );
  const [showRefund, openRefund] = useState<boolean>(false);

  //Prompt For Voids Authorization
  const voidTrans = (verify: any) => {
    if (new Date()?.getTime() - currentSale?.date < 86400000) {
      if (verify) {
        //Update State
        dispatch(
          addSales([
            ...(completed_sales?.length >= 1
              ? completed_sales?.filter(
                  (record: any) =>
                    record?.transact_id !== currentSale.transact_id
                )
              : []),
          ])
        );
        //Save Data Locally
        window.localStorage.setItem(
          "completed_sales",
          JSON.stringify([
            ...(completed_sales?.length >= 1
              ? completed_sales?.filter(
                  (record: any) =>
                    record?.transact_id !== currentSale.transact_id
                )
              : []),
          ])
        );

        //Archive Sale For Tracking
        window.localStorage.setItem(
          "transactions_archieve",
          JSON.stringify([
            ...transactions_archieve,
            {
              ...currentSale,
              reason: reason,
              archieve_date: new Date()?.getTime(),
            },
          ])
        );
        dispatch(
          archieveSale([
            ...transactions_archieve,
            {
              ...currentSale,
              reason: reason,
              archieve_date: new Date()?.getTime(),
            },
          ])
        );

        //Update Cash Float
        let openFloat =
          cash_float?.filter((data: any) => data.status === "open")[0] ?? null;
        if (openFloat && currentSale?.payment_method === "cash") {
          dispatch(
            updateFloat([
              ...cash_float.filter(
                (data: any) => data.id_two !== openFloat?.id_two
              ),
              {
                ...openFloat,
                total: Number(openFloat?.total) - currentSale?.total,
                refunds: Number(openFloat?.refunds) + currentSale?.total,
                activities: [
                  ...openFloat?.activities,
                  {
                    note: "Voided Transaction",
                    amount: "-" + currentSale?.total,
                    time: new Date()?.getTime(),
                    currency: selectedCurrency?.name,
                  },
                ],
                edited: true,
              },
            ])
          );

          //Save Cash Float Local local
          window.localStorage.setItem(
            "cash_float",
            JSON.stringify([
              ...cash_float.filter(
                (data: any) => data.id_two !== openFloat?.id_two
              ),
              {
                ...openFloat,
                total: Number(openFloat?.total) - currentSale?.total,
                gross: Number(openFloat?.gross) - currentSale?.total,
                activities: [
                  ...openFloat?.activities,
                  {
                    note: "Voided Transaction",
                    amount: "-" + currentSale?.total,
                    time: new Date()?.getTime(),
                  },
                ],
                edited: true,
              },
            ])
          );
        }

        //Deduct Stock From Inventory
        currentSale.products?.forEach((prod: any) => {
          window.localStorage.setItem(
            "inventory_data",
            JSON.stringify([
              ...inventory_data?.filter(
                (data: any) => data?.id_two !== prod?.prod_obj?.id_two
              ),
              {
                ...prod?.prod_obj,
                in_stock:
                  Number(
                    [...inventory_data]?.filter(
                      (data: any) => data?.id_two === prod?.prod_obj?.id_two
                    )[0]?.in_stock
                  ) + Number(prod?.quantity) ?? 0,
                last_editedAt: new Date().getTime(),
              },
            ])
          );

          window.localStorage.setItem(
            "inventory_changes_data",
            JSON.stringify([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== prod?.prod_obj?.id_two
              ),
              {
                ...prod?.prod_obj,
                in_stock:
                  Number(
                    [...inventory_data]?.filter(
                      (data: any) => data?.id_two === prod?.prod_obj?.id_two
                    )[0]?.in_stock
                  ) + Number(prod?.quantity) ?? 0,
                last_editedAt: new Date().getTime(),
                edit: true,
              },
            ])
          );

          dispatch(
            loadInventoryData([
              ...inventory_data?.filter(
                (data: any) => data?.id_two !== prod?.prod_obj?.id_two
              ),
              {
                ...prod?.prod_obj,
                in_stock:
                  Number(
                    [...inventory_data]?.filter(
                      (data: any) => data?.id_two === prod?.prod_obj?.id_two
                    )[0]?.in_stock
                  ) + Number(prod?.quantity) ?? 0,
                last_editedAt: new Date().getTime(),
              },
            ])
          );

          dispatch(
            updateLocalInventory_Changes([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== prod?.prod_obj?.id_two
              ),
              {
                ...prod?.prod_obj,
                in_stock:
                  Number(
                    [...inventory_data]?.filter(
                      (data: any) => data?.id_two === prod?.prod_obj?.id_two
                    )[0]?.in_stock
                  ) + Number(prod?.quantity) ?? 0,
                last_editedAt: new Date().getTime(),
                edit: true,
              },
            ])
          );
        });
        setReason("");
        setAuthorize(false);
        setActions(false);
        setCurrentSale(null);
      } else {
        dispatch(
          updateAlert([
            ...alerts,
            {
              message: "You can't void this sale, try a refund",
              id: new Date().getTime(),
              color: "bg-red-200",
            },
          ])
        );
      }
    } else {
      dispatch(
        updateAlert([
          ...alerts,
          {
            message: "You can't void this sale, try a refund",
            id: new Date().getTime(),
            color: "bg-red-200",
          },
        ])
      );
    }
  };

  //Component =======
  return (
    <>
      <div
        className={`h-full fixed top-0 bottom-0 bg-cyan-750/40 z-[999] drop-shadow-lg ${
          showActions ? "right-0 w-full" : "w-0 -right-[50%]"
        } transition-all flex justify-end`}
      >
        {/**Close button */}
        <button
          onClick={() => {
            setActions(false);
            setCurrentSale("");
          }}
          className="absolute top-0 right-[30rem] h-8 w-8 bg-white rounded-bl-sm text-slate-500 font-medium text-xl
      hover:bg-red-100 hover:transition-all border border-slate-300 border-r-0 border-t-0"
        >
          &times;
        </button>
        {/**Close button */}

        <div
          className={`w-[30rem] print:w-full h-full bg-white drop-shadow-2xl p-6 space-y-4`}
        >
          <div className="h-8 w-full flex items-center justify-between print:hidden">
            <button
              disabled={currentSale?.not_eligable_for_refund}
              onClick={() => {
                setAuthorize(true);
              }}
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm disabled:cursor-not-allowed disabled:opacity-80
               "
            >
              void
            </button>
            <button
              disabled={currentSale?.not_eligable_for_refund}
              onClick={() => {
                openRefund(true);
              }}
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm disabled:cursor-not-allowed disabled:opacity-80
               "
            >
              Refund
            </button>
            <button
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm
               "
            >
              Exchange
            </button>
            <button
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm
               "
            >
              Email
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm
               "
            >
              Print
            </button>
          </div>

          <div
            className="w-full h-[calc(100%-2.5rem)] flex flex-col items-center 
        overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar space-y-6"
          >
            <div className="w-full h-fit px-2 print:hidden">
              <div className="text-lg font-semibold text-slate-700 flex items-center justify-between w-full">
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">
                  Total
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">
                  {selectedCurrency?.symbol}&nbsp;
                  {numberWithSpaces(
                    (
                      currentSale?.total * selectedCurrency?.rate_multiplier
                    )?.toFixed(2)
                  )}
                </span>
              </div>
              <span className="text-xs text-slate-600 w-full whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                {new Date(currentSale?.date)?.toString()?.split("(")[0]}
              </span>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full border-t border-slate-200 pt-2 mt-1"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Customer's Name
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">
                  {currentSale?.customers_details?.name ?? "Unknown"}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Customer's Email
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis lowercase">
                  {currentSale?.customers_details?.email
                    ? currentSale?.customers_details?.email
                    : "none"}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full pb-1"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Customer's Address
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">
                  {currentSale?.customers_details?.address
                    ? currentSale?.customers_details?.address
                    : "No Address"}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full border-t border-slate-200 pt-2 py-0.5 mt-1"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Payment Method
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                  {currentSale?.payment_method}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Payment Status
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                  {currentSale?.status}
                </span>
              </div>
              {currentSale?.refund_amount && (
                <div
                  className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
                >
                  <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                    Refund Amount
                  </span>
                  <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                    {selectedCurrency?.symbol}&nbsp;
                    {numberWithSpaces(
                      (
                        currentSale?.refund_amount *
                        selectedCurrency?.rate_multiplier
                      )?.toFixed(2)
                    )}
                  </span>
                </div>
              )}

              {currentSale?.refund_date && (
                <div
                  className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
                >
                  <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                    Refund Date
                  </span>
                  <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                    {
                      new Date(currentSale?.refund_date)
                        ?.toString()
                        ?.split("(")[0]
                    }
                  </span>
                </div>
              )}
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Sale Channel
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                  {currentSale?.sale_channel}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Service Type
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                  {currentSale?.service}
                </span>
              </div>
              <div
                className="text-xs text-slate-600 flex items-center
               justify-between w-full py-0.5"
              >
                <span className="w-[50%] whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  Served By
                </span>
                <span className="text-end w-[50%] whitespace-nowrap overflow-hidden text-ellipsis capitalize">
                  {currentSale?.user?.name}
                </span>
              </div>
              {currentSale?.refund_reason && (
                <div className="text-xs text-slate-600 flex flex-col space-y-1 w-full py-0.5 pt-2 mt-2 border-t border-slate-300">
                  <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                    Refund Reason
                  </span>
                  <span className="w-full whitespace-wrap overflow-hidden text-ellipsis capitalize">
                    {currentSale?.refund_reason}
                  </span>
                </div>
              )}
              {currentSale?.note && (
                <div className="text-xs text-slate-600 flex flex-col space-y-1 w-full py-0.5 pt-2 mt-2 border-t border-slate-300">
                  <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                    Note
                  </span>
                  <span className="w-full whitespace-wrap overflow-hidden text-ellipsis capitalize">
                    {currentSale?.note}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-700 w-full">
              Invoice Preview
            </span>
            {/**Slip Preview */}
            <div
              className="w-[27rem] h-fit flex flex-col
           border border-slate-200 rounded-sm p-6 bg-slate-50 print:bg-white print:max-w-full print:w-full print:border-none
            print:fixed print:top-0 print:left-0 print:bottom-0 print:right-0 prirnt:z-[9999] print:rounded-none"
            >
              <div className="h-fit w-full pb-4 border-b border-dashed border-slate-300">
                <div className="w-full h-fit overflow-hidden text-slate-700 space-y-1">
                  <p className="text-xs uppercase font-bold w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    Test Shop
                  </p>
                  <p className="text-xs uppercase font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    146 Maddle Street Mulbaton 1456
                  </p>
                  <p className="text-xs uppercase font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    Phone : 088 890 6765
                  </p>
                  <p className="text-xs lowercase font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="uppercase">email :</span> shop@test.com
                  </p>
                  <p className="text-xs capitalize font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="uppercase">Served by :</span>{" "}
                    {currentSale?.user?.name}
                  </p>
                  <p className="text-xs capitalize font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    {new Date(currentSale?.date)?.toString()?.split("(")[0]}
                  </p>
                  <p className="text-xs uppercase font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                    RECEIPT #{currentSale?.transact_id}
                  </p>
                </div>
              </div>

              <ul className="w-full h-fit space-y-1 py-4 overflow-hidden">
                {currentSale?.products?.length >= 1 &&
                  currentSale?.products?.map((prod: any) => {
                    return (
                      <li
                        key={prod?.prod_cart_uid}
                        className="w-full h-5 flex justify-between items-center uppercase text-xs text-slate-700"
                      >
                        <span>
                          {prod?.prod_obj?.name}&nbsp;&nbsp;
                          <span className="lowercase">x</span> {prod?.quantity}
                        </span>
                        <span>
                          {selectedCurrency?.symbol}&nbsp;
                          {numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              Number(prod?.prod_obj?.price_in_usd) *
                              Number(prod?.quantity)
                            ).toFixed(2)
                          )}
                        </span>
                      </li>
                    );
                  })}
                {currentSale?.refunded_products?.length >= 1 && (
                  <>
                    <span
                      className="text-xs uppercase font-semibold
                     text-slate-600 w-full whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      Returned items
                    </span>
                    {currentSale?.refunded_products?.map((prod: any) => {
                      return (
                        <li
                          key={prod?.prod_cart_uid}
                          className="w-full h-5 flex justify-between items-center uppercase text-xs text-slate-700"
                        >
                          <span>
                            {prod?.prod_obj?.name}&nbsp;&nbsp;
                            <span className="lowercase">x</span>{" "}
                            {prod?.quantity}
                          </span>
                          <span>
                            {selectedCurrency?.symbol}&nbsp;
                            {numberWithSpaces(
                              (
                                selectedCurrency?.rate_multiplier *
                                Number(prod?.prod_obj?.price_in_usd) *
                                Number(prod?.quantity)
                              ).toFixed(2)
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </>
                )}
              </ul>

              {/**Totals */}
              <ul className="w-full h-fit overflow-hidden py-4 space-y-1 border-dashed border-y border-slate-300">
                <li className="w-full h-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    Tip ({currentSale?.tip_percent ?? 0}%)
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1 &&
                    currentSale?.tip_amount
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.tip_amount
                          ).toFixed(2)
                        )
                      : "0.00"}
                  </span>
                </li>
                <li className="w-full h-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    Discount ({currentSale?.discount_percent ?? 0}%)
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1 &&
                    currentSale?.discount_amount
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.discount_amount
                          ).toFixed(2)
                        )
                      : "0.00"}
                  </span>
                </li>
                <li className="w-full h-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    VAT ({currentSale?.tax_percentage}%)
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.tax_in_usd
                          ).toFixed(2)
                        )
                      : "0.00"}
                  </span>
                </li>
                {currentSale?.refund_amount && (
                  <li className="w-full h-4 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-semibold">
                      Refund Amount
                    </span>
                    <span className="text-xs text-slate-700 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                      {currentSale?.products?.length >= 1
                        ? numberWithSpaces(
                            (
                              selectedCurrency?.rate_multiplier *
                              currentSale?.refund_amount
                            ).toFixed(2)
                          )
                        : "0.00"}
                    </span>
                  </li>
                )}
                <li className="w-full h-4 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    Total
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.total
                          ).toFixed(2)
                        )
                      : "0.00"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/**Authorise dialog */}
      <Authorize
        showAuthorize={showAuthorize}
        setAuthorize={setAuthorize}
        passedAuthFunc={voidTrans}
        reason={reason}
        setReason={setReason}
        showReason={true}
      />

      {/**Refund Dialog */}
      <Refund
        showRefund={showRefund}
        openRefund={openRefund}
        currentSale={currentSale}
        setActions={setActions}
      />
    </>
  );
};

export default SaleActions;
