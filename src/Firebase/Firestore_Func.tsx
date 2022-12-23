import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
//Firestore ===================
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";
import {
  addStock_Orders,
  loadInventoryData,
  updateLocalInventory_Changes,
  addVendors,
} from "../Redux/Slices/InventorySlice";
import { addSales, updateFloat } from "../Redux/Slices/SalesSlice";

// init services for firestore =========================
export const db = getFirestore();

// Subsequent queries will use persistence, if it was enabled successfully
enableIndexedDbPersistence(db);
let workspace = localStorage.getItem("current_workspace");
export let org = workspace
  ? JSON.parse(workspace?.replace(/\s/gim, ""))
  : ""?.toLocaleLowerCase();

// collection ref
//let usersRef: any = org && collection(db, `companies/${org}/users`);
let inventoryRef: any =
  org && collection(db, `companies/${org}/inventory_data`);
let stockOrderRef: any = org && collection(db, `companies/${org}/stock_orders`);
let vendorsRef: any = org && collection(db, `companies/${org}/vendors`);
let salesRef: any = org && collection(db, `companies/${org}/completed_sales`);
let cash_floatRef: any = org && collection(db, `companies/${org}/cash_float`);

//=================================== Invetory ===========================================
export const addStock = async (obj: any) => {
  return await addDoc(inventoryRef, {
    id_two: obj?.id_two,
    name: obj?.name,
    product_id: obj?.product_id,
    category: obj?.category,
    description: obj?.description,
    price_in_usd: obj?.price_in_usd,
    buying_price_in_usd: obj?.buying_price_in_usd,
    in_stock: obj?.in_stock ?? 0,
    customization_option: obj?.customization_option,
    gallery: obj?.gallery,
    best_before: obj?.best_before,
  });
};

//Edit Stock
export const updateStock = async (obj: any) => {
  let docRef = doc(db, `companies/${org}/inventory_data`, obj?.id);
  return await updateDoc(docRef, {
    id_two: obj?.id_two,
    name: obj?.name,
    product_id: obj?.product_id,
    category: obj?.category,
    description: obj?.description,
    price_in_usd: obj?.price_in_usd,
    buying_price_in_usd: obj?.buying_price_in_usd,
    in_stock: obj?.in_stock ?? 0,
    customization_option: obj?.customization_option,
    gallery: obj?.gallery,
    best_before: obj?.best_before,
  });
};

// deleting Inventory
export const deleteStock = async (id: string) => {
  const docRef = doc(db, `companies/${org}/inventory_data`, id);
  return await deleteDoc(docRef);
};

//Adding Stock Order
export const addStockOrder = async (obj: any) => {
  return await addDoc(stockOrderRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Updating Stock Order
export const updateStockOrder = async (obj: any) => {
  let docRef = doc(db, `companies/${org}/stock_orders`, obj?.id);
  return await updateDoc(docRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Delete Stock Order
export const deleteStockOrder = async (id: string) => {
  const docRef = doc(db, `companies/${org}/stock_orders`, id);
  return await deleteDoc(docRef);
};

//Adding Vendor
export const addVendor = async (obj: any) => {
  return await addDoc(vendorsRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Updating Stock Order
export const updateVendor = async (obj: any) => {
  let docRef = doc(db, `companies/${org}/vendors`, obj?.id);
  return await updateDoc(docRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Delete Stock Order
export const deleteVendor = async (id: string) => {
  const docRef = doc(db, `companies/${org}/vendors`, id);
  return await deleteDoc(docRef);
};

//===================================Sales / Transactions ===========================================
//Adding Vendor
export const addSale = async (obj: any) => {
  return await addDoc(salesRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Updating Sales/Transactions
export const updateSale = async (obj: any) => {
  let docRef = doc(db, `companies/${org}/completed_sales`, obj?.id);
  return await updateDoc(docRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Delete Sales/Transactions
export const deleteSale = async (id: string) => {
  const docRef = doc(db, `companies/${org}/completed_sales`, id);
  return await deleteDoc(docRef);
};

//Add Cash Float
export const addFloat = async (obj: any) => {
  return await addDoc(cash_floatRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Updating Float
export const updateFloats = async (obj: any) => {
  let docRef = doc(db, `companies/${org}/cash_float`, obj?.id);
  return await updateDoc(docRef, {
    ...obj,
    isNew: false,
    isDeleted: false,
    edited: false,
  });
};

//Delete Float
export const deleteFloat = async (id: string) => {
  const docRef = doc(db, `companies/${org}/cash_float`, id);
  return await deleteDoc(docRef);
};

//Component ==================================
const FirestoreFunc: FC = () => {
  const [onlineStatus, isOnline] = useState<boolean>(navigator.onLine);
  const dispatch: AppDispatch = useDispatch();
  const inventory_data_queue = useSelector(
    (state: RootState) => state.Inventory.inventory_changes_data
  );
  const inventory_data = useSelector(
    (state: RootState) => state.Inventory.inventory_data
  );
  const stock_orders = useSelector(
    (state: RootState) => state.Inventory.stock_orders
  );
  const vendors = useSelector((state: RootState) => state.Inventory.vendors);
  const sales = useSelector((state: RootState) => state.Sales.completed_sales);
  const cash_float = useSelector((state: RootState) => state.Sales.cash_float);

  //Listen For Offline and Online Changes
  useEffect(() => {
    const setOnline = () => {
      isOnline(true);
    };
    const setOffline = () => {
      isOnline(false);
    };
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);

    // cleanup if we unmount
    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  //Add | Update | Delete Data To Inventory if online
  useEffect(() => {
    if (onlineStatus && inventory_data_queue.length >= 1) {
      inventory_data_queue?.forEach((stock: any) => {
        if (stock.edit && !stock.deleted && stock.id) {
          updateStock(stock).then(() => {
            window.localStorage.setItem(
              "inventory_changes_data",
              JSON.stringify([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
            dispatch(
              updateLocalInventory_Changes([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
          });
        } else if (
          stock.edit &&
          !stock.deleted &&
          !stock.id &&
          inventory_data?.filter(
            (data: any) => data?.id_two === stock?.id_two && data.id
          ).length <= 0
        ) {
          addStock(stock).then(() => {
            window.localStorage.setItem(
              "inventory_changes_data",
              JSON.stringify([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
            dispatch(
              updateLocalInventory_Changes([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
          });
        } else if (!stock.id && stock.deleted) {
          window.localStorage.setItem(
            "inventory_changes_data",
            JSON.stringify([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== stock?.id_two
              ),
            ])
          );
          dispatch(
            updateLocalInventory_Changes([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== stock?.id_two
              ),
            ])
          );
        } else if (stock?.deleted && stock?.id) {
          deleteStock(stock?.id).then(() => {
            window.localStorage.setItem(
              "inventory_changes_data",
              JSON.stringify([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
            dispatch(
              updateLocalInventory_Changes([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
          });
        } else if (
          (!stock.edit &&
            !stock.id &&
            inventory_data?.filter(
              (data: any) => data?.id_two === stock?.id_two && data.id
            ).length <= 0) ||
          (!stock.deleted &&
            !stock.id &&
            inventory_data?.filter(
              (data: any) => data?.id_two === stock?.id_two && data.id
            ).length <= 0)
        ) {
          addStock(stock).then(() => {
            window.localStorage.setItem(
              "inventory_changes_data",
              JSON.stringify([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
            dispatch(
              updateLocalInventory_Changes([
                ...inventory_data_queue?.filter(
                  (data: any) => data?.id_two !== stock?.id_two
                ),
              ])
            );
          });
        } else if (
          inventory_data?.filter(
            (data: any) => data?.id_two === stock?.id_two && data.id
          ).length === 1
        ) {
          window.localStorage.setItem(
            "inventory_changes_data",
            JSON.stringify([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== stock?.id_two
              ),
            ])
          );
          dispatch(
            updateLocalInventory_Changes([
              ...inventory_data_queue?.filter(
                (data: any) => data?.id_two !== stock?.id_two
              ),
            ])
          );
        }
      });
    }
  }, [dispatch, inventory_data_queue, inventory_data, onlineStatus]);

  //Add | Update | Delete Data Fromm Stock Order DB
  useEffect(() => {
    let dataQueue = [...stock_orders]?.filter(
      (data: any) => data?.isNew || data?.isDeleted || data?.edited
    );
    //Check if User Is Online
    if (onlineStatus && dataQueue?.length >= 1) {
      dataQueue?.forEach((item: any) => {
        let localStoredData = () => {
          let data = window.localStorage.getItem("stock_orders");
          return data ? JSON.parse(data) : null;
        };
        //Clean Function
        const cleanUp = (item: any, type?: any) => {
          if (type === "delete") {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.order_id !== item?.order_id
              ),
            ];
            dispatch(
              addStock_Orders([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.order_id !== item?.order_id
                    )
                  : []),
              ])
            );
            window.localStorage.setItem(
              "stock_orders",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.order_id !== item?.order_id
                    )
                  : []),
              ])
            );
          } else {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.order_id !== item?.order_id
              ),
            ];
            dispatch(
              addStock_Orders([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.order_id !== item?.order_id
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
            window.localStorage.setItem(
              "stock_orders",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.order_id !== item?.order_id
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
          }
        };

        if (item?.isDeleted && item?.id) {
          deleteStockOrder(item?.id).then(() => {
            cleanUp(item, "delete");
          });
        } else if (item?.isDeleted && !item?.id) {
          cleanUp(item, "delete");
        } else if (item?.edited && item?.id) {
          updateStockOrder(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.edited && !item?.id) {
          addStockOrder(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.isNew) {
          addStockOrder(item).then(() => {
            cleanUp(item);
          });
        }
      });
    }
  }, [onlineStatus, stock_orders, dispatch]);

  //Add | Update | Delete Data from Vendors Collection
  useEffect(() => {
    let dataQueue = [...vendors]?.filter(
      (data: any) => data?.isNew || data?.isDeleted || data?.edited
    );
    //Check if User Is Online
    if (onlineStatus && dataQueue?.length >= 1) {
      dataQueue?.forEach((item: any) => {
        let localStoredData = () => {
          let data = window.localStorage.getItem("vendors");
          return data ? JSON.parse(data) : null;
        };
        //Clean Function
        const cleanUp = (item: any, type?: any) => {
          if (type === "delete") {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.id_two !== item?.id_two
              ),
            ];
            dispatch(
              addVendors([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
              ])
            );
            window.localStorage.setItem(
              "vendors",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
              ])
            );
          } else {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.id_two !== item?.id_two
              ),
            ];
            dispatch(
              addVendors([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
            window.localStorage.setItem(
              "vendors",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
          }
        };

        if (item?.isDeleted && item?.id) {
          deleteVendor(item?.id).then(() => {
            cleanUp(item, "delete");
          });
        } else if (item?.isDeleted) {
          cleanUp(item, "delete");
        } else if (item?.edited && item?.id) {
          updateVendor(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.edited && !item?.id) {
          addVendor(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.isNew) {
          addVendor(item).then(() => {
            cleanUp(item);
          });
        }
      });
    }
  }, [onlineStatus, vendors, dispatch]);

  //Add | Update | Delete Data from Sales/Transactions Collection
  useEffect(() => {
    let dataQueue = [...sales]?.filter(
      (data: any) => data?.isNew || data?.isDeleted || data?.edited
    );
    //Check if User Is Online
    if (onlineStatus && dataQueue?.length >= 1) {
      dataQueue?.forEach((item: any) => {
        let localStoredData = () => {
          let data = window.localStorage.getItem("completed_sales");
          return data ? JSON.parse(data) : null;
        };
        //Clean Function
        const cleanUp = (item: any, type?: any) => {
          if (type === "delete") {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.transact_id !== item?.transact_id
              ),
            ];
            dispatch(
              addSales([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.transact_id !== item?.transact_id
                    )
                  : []),
              ])
            );
            window.localStorage.setItem(
              "completed_sales",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.transact_id !== item?.transact_id
                    )
                  : []),
              ])
            );
          } else {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.transact_id !== item?.transact_id
              ),
            ];
            dispatch(
              addSales([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.transact_id !== item?.transact_id
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
            window.localStorage.setItem(
              "completed_sales",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.transact_id !== item?.transact_id
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
          }
        };

        if (item?.isDeleted && item?.id) {
          deleteSale(item?.id).then(() => {
            cleanUp(item, "delete");
          });
        } else if (item?.isDeleted) {
          cleanUp(item, "delete");
        } else if (item?.edited && item?.id) {
          updateSale(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.edited && !item?.id) {
          addSale(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.isNew) {
          addSale(item).then(() => {
            cleanUp(item);
          });
        }
      });
    }
  }, [onlineStatus, sales, dispatch]);

  //Add | Update | Delete Data from Cash Float Collection
  useEffect(() => {
    let dataQueue = [...cash_float]?.filter(
      (data: any) => data?.isNew || data?.isDeleted || data?.edited
    );
    //Check if User Is Online
    if (onlineStatus && dataQueue?.length >= 1) {
      dataQueue?.forEach((item: any) => {
        let localStoredData = () => {
          let data = window.localStorage.getItem("cash_float");
          return data ? JSON.parse(data) : null;
        };
        //Clean Function
        const cleanUp = (item: any, type?: any) => {
          if (type === "delete") {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.id_two !== item?.id_two
              ),
            ];
            dispatch(
              updateFloat([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
              ])
            );
            window.localStorage.setItem(
              "cash_float",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
              ])
            );
          } else {
            dataQueue = [
              ...dataQueue?.filter(
                (data: any) => data?.id_two !== item?.id_two
              ),
            ];
            dispatch(
              updateFloat([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
            window.localStorage.setItem(
              "cash_float",
              JSON.stringify([
                ...(localStoredData()
                  ? localStoredData()?.filter(
                      (data: any) => data?.id_two !== item?.id_two
                    )
                  : []),
                { ...item, isNew: false, isDeleted: false, edited: false },
              ])
            );
          }
        };

        if (item?.isDeleted && item?.id) {
          deleteFloat(item?.id).then(() => {
            cleanUp(item, "delete");
          });
        } else if (item?.isDeleted) {
          cleanUp(item, "delete");
        } else if (item?.edited && item?.id) {
          updateFloats(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.edited && !item?.id) {
          addFloat(item).then(() => {
            cleanUp(item);
          });
        } else if (item?.isNew) {
          addFloat(item).then(() => {
            cleanUp(item);
          });
        }
      });
    }
  }, [onlineStatus, cash_float, dispatch]);

  //===================Fetch Data ============================

  //Fetch Inventory Data
  useEffect((): any => {
    return onSnapshot(inventoryRef, (snapshot: { docs: any[] }) => {
      if (onlineStatus) {
        dispatch(
          loadInventoryData(
            [
              ...snapshot.docs.map((doc: { data: () => any; id: any }) => ({
                ...doc.data(),
                id: doc.id,
              })),
            ]?.filter(
              (data: any) =>
                !inventory_data_queue?.find(
                  (inven: any) =>
                    inven?.id_two === data?.id_two && inven.deleted
                )
            )
          )
        );
        window.localStorage.setItem(
          "inventory_data",
          JSON.stringify(
            [
              ...snapshot.docs.map((doc: { data: () => any; id: any }) => ({
                ...doc.data(),
                id: doc.id,
              })),
            ]?.filter(
              (data: any) =>
                !inventory_data_queue?.find(
                  (inven: any) =>
                    inven?.id_two === data?.id_two && inven.deleted
                )
            )
          )
        );
      }
    });
  }, [dispatch, inventory_data_queue, onlineStatus]);

  //Fetch Stock Order Data
  useEffect((): any => {
    return onSnapshot(stockOrderRef, (snapshot: { docs: any[] }) => {
      if (onlineStatus) {
        dispatch(
          addStock_Orders(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
        window.localStorage.setItem(
          "stock_orders",
          JSON.stringify(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
      }
    });
  }, [dispatch, onlineStatus]);

  //Fetch Stock Order Data
  useEffect((): any => {
    return onSnapshot(vendorsRef, (snapshot: { docs: any[] }) => {
      if (onlineStatus) {
        dispatch(
          addVendors(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
        window.localStorage.setItem(
          "vendors",
          JSON.stringify(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
      }
    });
  }, [dispatch, onlineStatus]);

  //Fetch Sales Order Data
  useEffect((): any => {
    return onSnapshot(salesRef, (snapshot: { docs: any[] }) => {
      if (onlineStatus) {
        dispatch(
          addSales(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
        window.localStorage.setItem(
          "completed_sales",
          JSON.stringify(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
      }
    });
  }, [dispatch, onlineStatus]);

  //Fetch Cash Float Data
  useEffect((): any => {
    return onSnapshot(cash_floatRef, (snapshot: { docs: any[] }) => {
      if (onlineStatus) {
        dispatch(
          updateFloat(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
        window.localStorage.setItem(
          "cash_float",
          JSON.stringify(
            snapshot.docs.map((doc: { data: () => any; id: any }) => ({
              ...doc.data(),
              id: doc.id,
            }))
          )
        );
      }
    });
  }, [dispatch, onlineStatus]);

  return <></>;
};

export default FirestoreFunc;
