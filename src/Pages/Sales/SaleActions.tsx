import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { numberWithSpaces } from "../../Reusable Functions/Functions";
import { QRCode } from "react-qrcode-logo";
import Barcode from "react-barcode";
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
                total: (
                  Number(openFloat?.total) - currentSale?.total
                ),
                gross: (
                  Number(openFloat?.gross) - currentSale?.total
                ),
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

          //Save Cash Float Local local
          window.localStorage.setItem(
            "cash_float",
            JSON.stringify([
              ...cash_float.filter(
                (data: any) => data.id_two !== openFloat?.id_two
              ),
              {
                ...openFloat,
                total: (
                  Number(openFloat?.total) - currentSale?.total
                ),
                gross: (
                  Number(openFloat?.gross) - currentSale?.total
                ),
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
              onClick={() => {
                setAuthorize(true);
              }}
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm
               "
            >
              void
            </button>
            <button
              onClick={() => {
                openRefund(true);
              }}
              className="h-8 w-20 bg-cyan-750 hover:bg-cyan-800 text-[0.65rem] uppercase
               font-medium text-white rounded-sm
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
            className="w-full h-[calc(100%-2.5rem)] flex items-center justify-between 
        overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar"
          >
            {/**Slip Preview */}
            <div
              className="w-[27rem] print:max-w-full print:w-full min-h-full h-fit flex flex-col justify-between overflow-hidden 
            overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar
           border border-slate-200 rounded-sm p-6 bg-white print:border-none
            print:fixed print:top-0 print:left-0 print:bottom-0 print:right-0 prirnt:z-[9999] print:rounded-none"
            >
              <div className="w-full h-fit">
                <div className="flex justify-between items-center py-2 pb-4 border-b border-dashed border-slate-300">
                  <div className="w-[60%] h-fit overflow-hidden text-slate-600 space-y-1">
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
                      <span className="uppercase">Served by :</span> sands
                      tester
                    </p>
                    <p className="text-xs capitalize font-medium w-full whitespace-nowrap overflow-hidden text-ellipsis">
                      {new Date(currentSale?.date)?.toString()?.split("(")[0]}
                    </p>
                  </div>
                  <div className="w-[40%] flex justify-end max-h-[5.5rem] overflow-hidden">
                    {showActions && currentSale?.transact_id?.length > 4 && (
                      <QRCode
                        value={currentSale?.transact_id ?? "none"}
                        size={70}
                      />
                    )}
                  </div>
                </div>
                <ul className="mt-4 w-full flex flex-col space-y-1">
                  {currentSale?.products?.length >= 1 &&
                    currentSale?.products?.map((prod: any) => {
                      return (
                        <li
                          key={prod?.prod_cart_uid}
                          className="w-full flex justify-between items-center uppercase text-xs text-slate-600"
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
                </ul>
              </div>

              {/**Totals */}
              <div className="w-full flex flex-col space-y-2">
                <ul className="mt-4 w-full h-fit flex flex-col py-2 space-y-1 border-dashed border-y border-slate-300">
                  <li className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      Tip ({currentSale?.tip_percent??0}%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                    {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1 && currentSale?.tip_amount
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.tip_amount
                          ).toFixed(2)
                        )
                      : "0.00"}
                    </span>
                  </li>
                  <li className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      Discount ({currentSale?.discount_percent??0}%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedCurrency?.symbol}&nbsp;
                    {currentSale?.products?.length >= 1 && currentSale?.discount_amount
                      ? numberWithSpaces(
                          (
                            selectedCurrency?.rate_multiplier *
                            currentSale?.discount_amount
                          ).toFixed(2)
                        )
                      : "0.00"}
                    </span>
                  </li>
                  <li className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      VAT ({currentSale?.tax_percentage}%)
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
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
                  <li className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">
                      Total
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
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
                <div className="w-full flex items-center justify-center">
                  {showActions && currentSale?.transact_id?.length > 4 && (
                    <Barcode
                      value={currentSale?.transact_id ?? "none"}
                      height={25}
                      width={1.5}
                      fontSize={14}
                    />
                  )}
                </div>
              </div>
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
      />
    </>
  );
};

export default SaleActions;
