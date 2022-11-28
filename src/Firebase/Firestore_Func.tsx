import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
//Firestore ===================
import {
  initializeFirestore,
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  runTransaction,
  updateDoc,
  arrayUnion,
  arrayRemove,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  where,
  query,
} from "firebase/firestore";

//Config Firebase ==================================
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: "stall-d635a",
  storageBucket: "stall-d635a.appspot.com",
  messagingSenderId: process.env.REACT_APP_MS_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: "G-4PJ9S2MJP4",
};

// Initialize Firebase for auth======================
initializeApp(firebaseConfig);

// init services for firestore =========================
export const db = initializeFirestore(initializeApp(firebaseConfig), {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});

// Subsequent queries will use persistence, if it was enabled successfully
enableIndexedDbPersistence(db);
export let org = localStorage
  .getItem("current_workspace")
  ?.replace(/\s/gim, "")
  ?.toLocaleLowerCase();

// collection ref
let usersRef: any = org && collection(db, `companies/${org}/users`);
let inventoryRef: any =
  org && collection(db, `companies/${org}/inventory_data`);
let queueRef: any = org && collection(db, `companies/${org}/queue`);
let contactsRef: any = org && collection(db, `companies/${org}/contacts`);
let settingsRef: any = org && collection(db, `companies/${org}/settings`);
let publicCannedResRef: any =
  org && collection(db, `companies/${org}/cannedResponses`);
let emailAccountsRef: any =
  org && collection(db, `companies/${org}/email_accounts`);
// let email_TemplatesRef: any =
//   org &&
//   collection(db, `companies/${org}/settings/all_settings/email_templates`);
let categoriesRef: any =
  org && collection(db, `companies/${org}/settings/all_settings/categories`);
let customFieldsRef: any =
  org && collection(db, `companies/${org}/settings/all_settings/custom_fields`);
let companyDetailsRef: any =
  org &&
  collection(db, `companies/${org}/settings/all_settings/company_details`);
//Custom categories

//=================================== Update and to Invetory ===========================================
export const addStock = (obj:any) => {
  addDoc(contactsRef, {
    id: obj?.id,
    name: obj?.name,
    product_id: "",
    category: "",
    description: "",
    price_in_usd: 0,
    in_stock: 0,
    customization_option: [],
    gallery: [],
    best_before: "",
  });
};

//Component ==================================
const TicketsnUserData: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser: any | null = getAuth().currentUser;
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );

  return <></>;
};

export default TicketsnUserData;
