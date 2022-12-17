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
  loadInventoryData,
  updateLocalInventory_Changes,
} from "../Redux/Slices/InventorySlice";

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
//Custom categories

//=================================== Update and to Invetory ===========================================
export const addStock = async (obj: any) => {
  return await addDoc(inventoryRef, {
    id_two: obj?.id_two,
    name: obj?.name,
    product_id: obj?.product_id,
    category: obj?.category,
    description: obj?.description,
    price_in_usd: obj?.price_in_usd,
    in_stock: obj?.in_stock,
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
    in_stock: obj?.in_stock,
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
          updateStock(stock)
            .then(() => {
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
            })
        } else if (
          stock.edit &&
          !stock.deleted &&
          !stock.id &&
          inventory_data?.filter(
            (data: any) => data?.id_two === stock?.id_two && data.id
          ).length <= 0
        ) {
          addStock(stock)
            .then(() => {
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
            })
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
          deleteStock(stock?.id)
            .then(() => {
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
            })
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
          addStock(stock)
            .then(() => {
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
            })
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
  }, [dispatch, inventory_data_queue,onlineStatus]);

  return <></>;
};

export default FirestoreFunc;
