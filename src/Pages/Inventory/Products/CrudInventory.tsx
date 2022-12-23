import React, { FC, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Redux/store";
import { TbTrash, TbColorSwatch } from "react-icons/tb";
import no_gallery from "../../../Assets/no_gallery.png";
import ZoomedMed from "../../../Components/Zoom Media/ZoomedMedia";
import {
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../../../Redux/Slices/InventorySlice";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { org } from "../../../Firebase/Firestore_Func";

type Props = {
  onlineStatus: boolean;
  crudOpen: boolean;
  setCrud: any;
  editAction: boolean;
  setEdit: any;
  stockObj: any;
  setStockObj: any;
  inventory_data: any;
};

const CrudInventory: FC<Props> = ({
  crudOpen,
  setCrud,
  editAction,
  setEdit,
  stockObj,
  setStockObj,
  onlineStatus,
  inventory_data,
}) => {
  const currencies = useSelector(
    (state: RootState) => state.SettingsData.currencies
  );
  const [amountCurrency, setAmountCurrency] = useState<any>({
    name: "usd",
    symbol: "$",
    rate_multiplier: 1,
  });
  const [amountBuyingCurrency, setAmountBuyingCurrency] = useState<any>({
    name: "usd",
    symbol: "$",
    rate_multiplier: 1,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [zoomMed, setZoomed] = useState({
    open: false,
    src: "",
  });
  const [zoomType, setType] = useState(null);
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const dispatch: AppDispatch = useDispatch();

  //Close and Clear Funct
  const closeNClear = () => {
    setCrud(false);
    setEdit(false);
    setStockObj({
      id_two: "",
      name: "",
      product_id: "",
      category: "",
      description: "",
      price_in_usd: "",
      buying_price_in_usd: "",
      in_stock: 0,
      customization_option: [],
      gallery: [],
      best_before: "",
    });
    formRef && formRef.current?.reset();
    setAmountCurrency({
      name: "usd",
      symbol: "$",
      rate_multiplier: 1,
    });
  };

  //Zoom Media ========================
  const zoomElement = (e: any) => {
    setType(e.target?.tagName);
    if (e.target?.tagName === "IMG") {
      setZoomed((prev) => ({ ...prev, open: true, src: e.target?.src }));
      document.body.style.overflow = "hidden";
    }
  };

  //Add Or Edit Inventory Func ========================
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    //Generate Unique ID
    let uniqueID = () => {
      let name = stockObj?.name?.replace(/[^a-zA-Z]|\s/gi, "");
      let combined = `#${
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

    if (editAction) {
      //Save Local
      window.localStorage.setItem(
        "inventory_data",
        JSON.stringify([
          ...inventory_data?.filter(
            (data: any) => data?.id_two !== stockObj?.id_two
          ),
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      window.localStorage.setItem(
        "inventory_changes_data",
        JSON.stringify([
          ...inventory_data_queue?.filter(
            (data: any) => data?.id_two !== stockObj?.id_two
          ),
          {
            ...stockObj,
            edit: true,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      //Update Redux
      dispatch(
        loadInventoryData([
          ...inventory_data?.filter(
            (data: any) => data?.id_two !== stockObj?.id_two
          ),
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      dispatch(
        updateLocalInventory_Changes([
          ...inventory_data_queue?.filter(
            (data: any) => data?.id_two !== stockObj?.id_two
          ),
          {
            ...stockObj,
            edit: true,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            last_editedAt: new Date().getTime(),
          },
        ])
      );
    } else {
      //Save Local
      window.localStorage.setItem(
        "inventory_data",
        JSON.stringify([
          ...inventory_data,
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            id_two: uniqueID(),
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      window.localStorage.setItem(
        "inventory_changes_data",
        JSON.stringify([
          ...inventory_data_queue,
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            id_two: uniqueID(),
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      //Update Redux
      dispatch(
        loadInventoryData([
          ...inventory_data,
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            id_two: uniqueID(),
            last_editedAt: new Date().getTime(),
          },
        ])
      );
      dispatch(
        updateLocalInventory_Changes([
          ...inventory_data_queue,
          {
            ...stockObj,
            price_in_usd:
              amountCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.price_in_usd,
            buying_price_in_usd:
              amountBuyingCurrency?.name?.toLowerCase() !== "usd"
                ? Number(stockObj?.buying_price_in_usd) /
                  currencies?.filter(
                    (currrency: any) =>
                      currrency?.name?.toLowerCase() ===
                      amountBuyingCurrency?.name?.toLowerCase()
                  )[0]?.rate_multiplier
                : stockObj?.buying_price_in_usd,
            id_two: uniqueID(),
            last_editedAt: new Date().getTime(),
          },
        ])
      );
    }
    closeNClear();
  };

  //Component
  return (
    <div
      className={`fixed top-0 bottom-0 ${
        crudOpen ? "left-0 right-0" : "left-[200%] -right-[200%]"
      }
     transition-all duration-1500 w-screen h-screen z-[999] bg-cyan-750/50 overflow-hidden flex justify-end`}
    >
      <form
        onSubmit={(e) => handleSubmit(e)}
        ref={formRef}
        autoComplete="off"
        className="h-full w-[30rem] bg-white relative"
      >
        <div
          className={`h-full w-full ${
            crudOpen ? "flex" : "hidden"
          } flex-col justify-between`}
        >
          {/**Close Button */}
          <button
            type="button"
            onClick={() => {
              closeNClear();
            }}
            className="h-6 w-6 border border-r-0 border-white rounded-bl-md
             absolute top-0 -left-6 bg-red-600 text-xs text-white hover:opacity-80 transition-all"
          >
            &times;
          </button>
          {/**Input Form  */}
          <div className="w-full h-[calc(100%-4.25rem)] p-6 space-y-3 flex flex-col overflow-hidden overflow-y-scroll">
            <div className="text-lg text-slate-600 font-semibold capitalize">
              Product
            </div>
            <p className="text-xs text-slate-500">
              Leverage all the customizations option to provide better choices
              for your customers like expiry date, color pickers and more.
            </p>

            <label htmlFor="product_name">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Product Name
              </span>
              <input
                required
                type="text"
                name="product_name"
                id="product_name"
                placeholder="Product name ..."
                className="inventory_input"
                value={stockObj?.name}
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    name: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="product_id">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Product UID/SKU
              </span>
              <input
                required
                type="text"
                name="product_id"
                id="product_id"
                placeholder="Product UID e.g serial number ..."
                className="inventory_input"
                value={stockObj?.product_id}
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    product_id: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="Category">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Category
              </span>
              <input
                required
                type="text"
                name="Category"
                id="Category"
                placeholder="Category ..."
                className="inventory_input"
                value={stockObj?.category}
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    category: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="Description">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Description
              </span>
              <textarea
                required
                name="Description"
                id="Description"
                placeholder="Enter Description ..."
                className="w-full h-20 rounded border border-slate-300  
                focus:outline-none focus:border-cyan-750 focus:ring-0 text-xs text-slate-600
                 placeholder:text-slate-400 resize-none"
                maxLength={500}
                value={stockObj?.description}
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    description: e.target?.value,
                  }));
                }}
              ></textarea>
            </label>
            <label htmlFor="In-Stock">
              <span className="text-xs text-slate-500 font-medium uppercase">
                In-Stock
              </span>
              <input
                required
                type="number"
                name="In-Stock"
                id="In-Stock"
                placeholder="In-Stock ..."
                className="inventory_input"
                value={stockObj?.in_stock}
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    in_stock: e.target?.value,
                  }));
                }}
              />
            </label>
            <label htmlFor="Expiry Date">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Expiry Date
              </span>
              <input
                type="date"
                name="Expiry Date"
                id="Expiry Date"
                placeholder="Expiry Date ..."
                className="inventory_input"
                onChange={(e) => {
                  setStockObj((prev: any) => ({
                    ...prev,
                    best_before: new Date(e.target?.value).getTime(),
                  }));
                }}
              />
            </label>

            <label htmlFor="buying_price">
              <div className="flex items-end justify-between w-full space-x-2">
                <div className="w-[70%]">
                  <span className="text-xs text-slate-500 font-medium uppercase">
                    Buying Price
                  </span>
                  <input
                    required
                    type="number"
                    name="buying_price"
                    id="buying_price"
                    placeholder="Amount ..."
                    className="inventory_input"
                    value={stockObj?.buying_price_in_usd}
                    onChange={(e) => {
                      setStockObj((prev: any) => ({
                        ...prev,
                        buying_price_in_usd: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="h-12 w-[25%] px-1 bg-white border border-slate-200 rounded">
                  <select
                    onChange={(e) => {
                      setAmountBuyingCurrency(JSON.parse(e.target.value));
                    }}
                    required
                    name="payment_currency"
                    id="payment_currency"
                    className="w-full h-full flex items-center justify-center pt-1 text-xs 
                    border-0 focus:border-0 focus:ring-0 focus:outline-none uppercase text-slate-700"
                  >
                    {currencies?.map((currence: any) => {
                      return (
                        <option
                          key={currence.name}
                          value={JSON.stringify(currence)}
                        >
                          {currence.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </label>

            <label htmlFor="Price">
              <div className="flex items-end justify-between w-full space-x-2">
                <div className="w-[70%]">
                  <span className="text-xs text-slate-500 font-medium uppercase">
                    Selling Price
                  </span>
                  <input
                    required
                    type="number"
                    name="Price"
                    id="Price"
                    placeholder="Price ..."
                    className="inventory_input"
                    value={stockObj?.price_in_usd}
                    onChange={(e) => {
                      setStockObj((prev: any) => ({
                        ...prev,
                        price_in_usd: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="h-12 w-[25%] px-1 bg-white border border-slate-200 rounded">
                  <select
                    onChange={(e) => {
                      setAmountCurrency(JSON.parse(e.target.value));
                    }}
                    required
                    name="payment_currency"
                    id="payment_currency"
                    className="w-full h-full flex items-center justify-center pt-1 text-xs 
                    border-0 focus:border-0 focus:ring-0 focus:outline-none uppercase text-slate-700"
                  >
                    {currencies?.map((currence: any) => {
                      return (
                        <option
                          key={currence.name}
                          value={JSON.stringify(currence)}
                        >
                          {currence.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </label>

            {/**Customization */}
            <hr />
            <div className="w-full h-fit flex items-center justify-between py-2">
              <span className="text-xs text-slate-500 font-medium uppercase">
                Customization
              </span>
              <div className="w-fit h-fit flex space-x-4 items-center">
                <button
                  onClick={() => {
                    setStockObj((prev: any) => ({
                      ...prev,
                      customization_option: [
                        ...prev?.customization_option,
                        {
                          id:
                            prev?.customization_option?.length +
                            new Date().getTime(),
                          name: "",
                          type: "",
                          options: [
                            {
                              id: 8000 + new Date().getTime(),
                              name: "",
                              quantity: "",
                            },
                          ],
                        },
                      ],
                    }));
                  }}
                  type="button"
                  className="h-8 w-20
                 bg-cyan-900 rounded-sm text-xs text-white font-medium uppercase flex items-center justify-center space-x-1"
                >
                  <span>Add</span>
                  <TbColorSwatch className="text-base" />
                </button>
              </div>
            </div>
            <div className="w-full h-fit m-auto space-y-4">
              {stockObj?.customization_option?.length >= 1 &&
                [...stockObj?.customization_option]
                  ?.sort((a: any, b: any) => a.id - b.id)
                  ?.map((data: any, index: any) => {
                    return (
                      <details
                        key={index + "opt"}
                        className="open:bg-slate-50 border border-slate-300 hover:border-cyan-750
                     hover:shadow-lg open:p-6 transition-all rounded w-full"
                        open
                      >
                        <summary
                          className="text-xs capitalize leading-6 text-slate-600
                     font-medium select-none w-full cursor-pointer 
                     flex items-center justify-between border border-slate-200
                      rounded bg-slate-100 p-2"
                        >
                          <div className="flex items-center space-x-2">
                            <span>{data?.name}</span>
                            <small className="text-[0.65rem] text-slate-500 italic font-light">
                              ( Click here to close and open )
                            </small>
                          </div>{" "}
                          <button
                            onClick={() => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                customization_option: [
                                  ...prev?.customization_option?.filter(
                                    (custom: any) => custom?.id !== data?.id
                                  ),
                                ],
                              }));
                            }}
                            className="h-7 w-7 rounded border border-red-600
                         text-sm text-red-600 flex items-center justify-center bg-red-50 hover:bg-red-100 transition-all"
                          >
                            <TbTrash />
                          </button>
                        </summary>
                        <div
                          className="mt-1 text-sm capitalize leading-6 text-slate-600
                       dark:text-slate-400 flex flex-col space-y-2"
                        >
                          <span className="text-xs text-slate-500 font-medium uppercase">
                            Name
                          </span>
                          <input
                            required
                            type="text"
                            placeholder="Name..."
                            className="inventory_input capitalize"
                            value={data?.name}
                            onChange={(e) => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                customization_option: [
                                  ...prev?.customization_option?.filter(
                                    (custom: any) => custom?.id !== data?.id
                                  ),
                                  {
                                    ...prev?.customization_option?.filter(
                                      (custom: any) => custom?.id === data?.id
                                    )[0],
                                    name: e.target.value,
                                  },
                                ],
                              }));
                            }}
                          />
                          <div className="w-full h-fit flex items-center justify-between py-2">
                            <span className="text-xs text-slate-500 font-medium uppercase">
                              Options
                            </span>
                            <div className="w-fit h-fit flex space-x-4 items-center">
                              <button
                                onClick={() => {
                                  setStockObj((prev: any) => ({
                                    ...prev,
                                    customization_option: [
                                      ...prev?.customization_option?.filter(
                                        (custom: any) => custom?.id !== data?.id
                                      ),
                                      {
                                        ...prev?.customization_option?.filter(
                                          (custom: any) =>
                                            custom?.id === data?.id
                                        )[0],
                                        options: [
                                          ...prev?.customization_option?.filter(
                                            (custom: any) =>
                                              custom?.id === data?.id
                                          )[0]?.options,
                                          {
                                            id:
                                              prev?.customization_option?.filter(
                                                (custom: any) =>
                                                  custom?.id === data?.id
                                              )[0]?.options?.length +
                                              new Date().getTime(),
                                            name: "",
                                            quantity: "",
                                          },
                                        ],
                                      },
                                    ],
                                  }));
                                }}
                                type="button"
                                className="h-7 w-12 border-cyan-750  border rounded
                               text-sm text-cyan-750 font-medium uppercase"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          {data?.options.length >= 1 &&
                            [...data?.options]
                              ?.sort((a: any, b: any) => a.id - b.id)
                              ?.map((option: any, index: any) => {
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between w-full h-fit"
                                  >
                                    <input
                                      type="text"
                                      className="h-8 w-[40%] bg-white border border-slate-300
                                     text-[0.65rem] placeholder:text-slate-400 text-slate-500 
                                     focus:outline-none focus:border-cyan-750 focus:ring-0 rounded p-2 capitalize"
                                      placeholder="Name e.g 1-10 ..."
                                      required
                                      value={option.name}
                                      onChange={(e) => {
                                        setStockObj((prev: any) => ({
                                          ...prev,
                                          customization_option: [
                                            ...prev?.customization_option?.filter(
                                              (custom: any) =>
                                                custom?.id !== data?.id
                                            ),
                                            {
                                              ...prev?.customization_option?.filter(
                                                (custom: any) =>
                                                  custom?.id === data?.id
                                              )[0],
                                              options: [
                                                ...prev?.customization_option
                                                  ?.filter(
                                                    (custom: any) =>
                                                      custom?.id === data?.id
                                                  )[0]
                                                  ?.options?.filter(
                                                    (opt: any) =>
                                                      opt?.id !== option?.id
                                                  ),
                                                {
                                                  ...prev?.customization_option
                                                    ?.filter(
                                                      (custom: any) =>
                                                        custom?.id === data?.id
                                                    )[0]
                                                    ?.options?.filter(
                                                      (opt: any) =>
                                                        opt?.id === option?.id
                                                    )[0],
                                                  name: e.target.value,
                                                },
                                              ],
                                            },
                                          ],
                                        }));
                                      }}
                                    />
                                    <input
                                      type="text"
                                      className="h-8 w-[40%] bg-white border border-slate-300
                                     text-[0.65rem] placeholder:text-slate-400 text-slate-500 
                                     focus:outline-none focus:border-cyan-750 focus:ring-0 rounded p-2 capitalize"
                                      placeholder="Quantity ..."
                                      required
                                      value={option.quantity}
                                      onChange={(e) => {
                                        setStockObj((prev: any) => ({
                                          ...prev,
                                          customization_option: [
                                            ...prev?.customization_option?.filter(
                                              (custom: any) =>
                                                custom?.id !== data?.id
                                            ),
                                            {
                                              ...prev?.customization_option?.filter(
                                                (custom: any) =>
                                                  custom?.id === data?.id
                                              )[0],
                                              options: [
                                                ...prev?.customization_option
                                                  ?.filter(
                                                    (custom: any) =>
                                                      custom?.id === data?.id
                                                  )[0]
                                                  ?.options?.filter(
                                                    (opt: any) =>
                                                      opt?.id !== option?.id
                                                  ),
                                                {
                                                  ...prev?.customization_option
                                                    ?.filter(
                                                      (custom: any) =>
                                                        custom?.id === data?.id
                                                    )[0]
                                                    ?.options?.filter(
                                                      (opt: any) =>
                                                        opt?.id === option?.id
                                                    )[0],
                                                  quantity: e.target.value,
                                                },
                                              ],
                                            },
                                          ],
                                        }));
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        setStockObj((prev: any) => ({
                                          ...prev,
                                          customization_option: [
                                            ...prev?.customization_option?.filter(
                                              (custom: any) =>
                                                custom?.id !== data?.id
                                            ),
                                            {
                                              ...prev?.customization_option?.filter(
                                                (custom: any) =>
                                                  custom?.id === data?.id
                                              )[0],
                                              options: [
                                                ...prev?.customization_option
                                                  ?.filter(
                                                    (custom: any) =>
                                                      custom?.id === data?.id
                                                  )[0]
                                                  ?.options?.filter(
                                                    (opt: any) =>
                                                      opt?.id !== option?.id
                                                  ),
                                              ],
                                            },
                                          ],
                                        }));
                                      }}
                                      className={`h-7 w-7 rounded border border-red-600 text-sm text-red-600
                                   ${
                                     data?.options?.length >= 2
                                       ? "flex"
                                       : "hidden"
                                   } items-center justify-center bg-red-50 hover:bg-red-100 transition-all`}
                                    >
                                      <TbTrash />
                                    </button>
                                  </div>
                                );
                              })}
                        </div>
                      </details>
                    );
                  })}
            </div>

            {/**Gallery */}
            <hr />
            <span className="text-xs text-slate-500 font-medium uppercase">
              Product Images
            </span>
            <div
              onClick={(e) => zoomElement(e)}
              className="flex items-center space-x-6 w-full h-fit"
            >
              <div className="w-fit h-fit flex flex-col space-y-2">
                <img
                  onError={(e) => {
                    e.currentTarget.src = no_gallery;
                  }}
                  src={stockObj?.gallery[0]?.url ?? ""}
                  alt="product_showcase"
                  className="h-16 w-16 cursor-zoom-in
                 rounded p-1 object-cover object-center overflow-hidden border-2 border-slate-200"
                />
                <label htmlFor="change_image_one">
                  <input
                    disabled={!onlineStatus}
                    type="file"
                    name="change_image_one"
                    id="change_image_one"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      let target: any = e.target; //<-- This (any) will tell compiler to shut up!
                      let content: any = target.files[0];
                      //Upload File if there is one
                      const storage = getStorage();
                      const storageRef = ref(
                        storage,
                        `/${org}/${content.name}`
                      );
                      const uploadTask = uploadBytesResumable(
                        storageRef,
                        content
                      );
                      uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                          // const progress =
                          //   (snapshot.bytesTransferred / snapshot.totalBytes) *
                          //   100;
                        },
                        (error) => {
                          console.log(error);
                        },
                        () => {
                          // Upload completed successfully, now we can get the download URL
                          getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                gallery: [
                                  ...prev?.gallery,
                                  {
                                    id: new Date().getTime(),
                                    url: downloadURL,
                                  },
                                ],
                              }));
                            }
                          );
                        }
                      );
                    }}
                  />
                  <div
                    className="w-full h-7 flex items-center justify-center p-1 
                    disabled:opacity-80 disabled:cursor-not-allowed
                   rounded-sm bg-cyan-900 text-[0.6rem] text-white uppercase cursor-pointer
                    hover:opacity-80 transition-all"
                  >
                    upload
                  </div>
                </label>
              </div>
              <div className="w-fit h-fit flex flex-col space-y-2">
                <img
                  onError={(e) => {
                    e.currentTarget.src = no_gallery;
                  }}
                  src={stockObj?.gallery[1]?.url ?? ""}
                  alt="product_showcase"
                  className="h-16 w-16 cursor-zoom-in
                 rounded p-1 object-cover object-center overflow-hidden border-2 border-slate-200"
                />
                <label htmlFor="change_image_two">
                  <input
                    disabled={!onlineStatus}
                    type="file"
                    name="change_image_two"
                    id="change_image_two"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      let target: any = e.target; //<-- This (any) will tell compiler to shut up!
                      let content: any = target.files[0];
                      //Upload File if there is one
                      const storage = getStorage();
                      const storageRef = ref(
                        storage,
                        `/${org}/${content.name}`
                      );
                      const uploadTask = uploadBytesResumable(
                        storageRef,
                        content
                      );
                      uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                          // const progress =
                          //   (snapshot.bytesTransferred / snapshot.totalBytes) *
                          //   100;
                        },
                        (error) => {
                          console.log(error);
                        },
                        () => {
                          // Upload completed successfully, now we can get the download URL
                          getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                gallery: [
                                  ...prev?.gallery,
                                  {
                                    id: new Date().getTime(),
                                    url: downloadURL,
                                  },
                                ],
                              }));
                            }
                          );
                        }
                      );
                    }}
                  />
                  <div
                    className="w-full h-7 flex items-center justify-center p-1 disabled:opacity-80 disabled:cursor-not-allowed
                   rounded-sm bg-cyan-900 text-[0.6rem] text-white uppercase cursor-pointer hover:opacity-80 transition-all"
                  >
                    upload
                  </div>
                </label>
              </div>
              <div className="w-fit h-fit flex flex-col space-y-2">
                <img
                  onError={(e) => {
                    e.currentTarget.src = no_gallery;
                  }}
                  src={stockObj?.gallery[2]?.url ?? ""}
                  alt="product_showcase"
                  className="h-16 w-16 cursor-zoom-in
                 rounded p-1 object-cover object-center overflow-hidden border-2 border-slate-200"
                />
                <label htmlFor="change_image_three">
                  <input
                    disabled={!onlineStatus}
                    type="file"
                    name="change_image_three"
                    id="change_image_three"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      let target: any = e.target; //<-- This (any) will tell compiler to shut up!
                      let content: any = target.files[0];
                      //Upload File if there is one
                      const storage = getStorage();
                      const storageRef = ref(
                        storage,
                        `/${org}/${content.name}`
                      );
                      const uploadTask = uploadBytesResumable(
                        storageRef,
                        content
                      );
                      uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                          // const progress =
                          //   (snapshot.bytesTransferred / snapshot.totalBytes) *
                          //   100;
                        },
                        (error) => {
                          console.log(error);
                        },
                        () => {
                          // Upload completed successfully, now we can get the download URL
                          getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                gallery: [
                                  ...prev?.gallery,
                                  {
                                    id: new Date().getTime(),
                                    url: downloadURL,
                                  },
                                ],
                              }));
                            }
                          );
                        }
                      );
                    }}
                  />
                  <div
                    className="w-full h-7 flex items-center justify-center p-1 disabled:opacity-80 disabled:cursor-not-allowed
                   rounded-sm bg-cyan-900 text-[0.6rem] text-white uppercase cursor-pointer hover:opacity-80 transition-all"
                  >
                    upload
                  </div>
                </label>
              </div>
              <div className="w-fit h-fit flex flex-col space-y-2">
                <img
                  onError={(e) => {
                    e.currentTarget.src = no_gallery;
                  }}
                  src={stockObj?.gallery[3]?.url ?? ""}
                  alt="product_showcase"
                  className="h-16 w-16 cursor-zoom-in
                 rounded p-1 object-cover object-center overflow-hidden border-2 border-slate-200"
                />
                <label htmlFor="change_image_four">
                  <input
                    disabled={!onlineStatus}
                    type="file"
                    name="change_image_four"
                    id="change_image_four"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      let target: any = e.target; //<-- This (any) will tell compiler to shut up!
                      let content: any = target.files[0];
                      //Upload File if there is one
                      const storage = getStorage();
                      const storageRef = ref(
                        storage,
                        `/${org}/${content.name}`
                      );
                      const uploadTask = uploadBytesResumable(
                        storageRef,
                        content
                      );
                      uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                          // const progress =
                          //   (snapshot.bytesTransferred / snapshot.totalBytes) *
                          //   100;
                        },
                        (error) => {
                          console.log(error);
                        },
                        () => {
                          // Upload completed successfully, now we can get the download URL
                          getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL) => {
                              setStockObj((prev: any) => ({
                                ...prev,
                                gallery: [
                                  ...prev?.gallery,
                                  {
                                    id: new Date().getTime(),
                                    url: downloadURL,
                                  },
                                ],
                              }));
                            }
                          );
                        }
                      );
                    }}
                  />
                  <div
                    className="w-full h-7 flex items-center justify-center p-1 disabled:opacity-80 disabled:cursor-not-allowed
                   rounded-sm bg-cyan-900 text-[0.6rem] text-white uppercase cursor-pointer hover:opacity-80 transition-all"
                  >
                    upload
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/**Submit Options  */}
          <div
            className="w-full h-16 bg-slate-100 border-t
           border-slate-200 flex items-center justify-between p-4"
          >
            <button
              onClick={() => {
                closeNClear();
              }}
              type="button"
              className="h-10 w-[45%] flex items-center justify-center 
          space-x-2 rounded-sm border border-cyan-750 bg-white font-semibold 
          uppercase text-xs text-cyan-750 outline-none focus:outline-none hover:opacity-80 hover:bg-cyan-50 transition-all"
            >
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="h-10 w-[45%] flex items-center justify-center 
          space-x-2 rounded-sm bg-cyan-750 font-semibold uppercase text-xs text-white outline-none focus:outline-none 
          hover:opacity-80 hover:bg-cyan-700 transition-all"
            >
              <span>{editAction ? "edit item" : "add new"}</span>
            </button>
          </div>
        </div>
      </form>

      {/**Zoom Galery */}
      <ZoomedMed zoomMed={zoomMed} setZoomed={setZoomed} type={zoomType} />
    </div>
  );
};

export default CrudInventory;
