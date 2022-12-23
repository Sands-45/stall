import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVendors } from "../../../Redux/Slices/InventorySlice";
import { RootState } from "../../../Redux/store";

type Props = {
  actionType: string;
  setAction: any;
  crudOpen: boolean;
  setOpenCrud: any;
  vendorObject: any;
  setVendorObject: any;
};

const CrudVendor: FC<Props> = ({
  actionType,
  setAction,
  crudOpen,
  setOpenCrud,
  vendorObject,
  setVendorObject,
}) => {
  const vendors = useSelector((state: RootState) => state.Inventory.vendors);
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    //Generate Unique ID
    let uniqueID = () => {
      let name = user?.name?.replace(/[^a-zA-Z]|\s/gi, "");
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
    if (actionType === "new") {
      dispatch(addVendors([...vendors, { ...vendorObject, id_two: uniqueID() ,isNew:true}]));
      window.localStorage.setItem(
        "vendors",
        JSON.stringify([...vendors, { ...vendorObject, id_two: uniqueID(),isNew:true }])
      );
      setAction("new");
      setOpenCrud(false);
      setVendorObject({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
      });
    } else if (actionType === "edit") {
      dispatch(
        addVendors([
          ...vendors?.filter(
            (data: any) => data?.id_two !== vendorObject?.id_two
          ),
          { ...vendorObject, id_two: uniqueID() ,isNew:false,edited:true},
        ])
      );
      window.localStorage.setItem(
        "vendors",
        JSON.stringify([
          ...vendors?.filter(
            (data: any) => data?.id_two !== vendorObject?.id_two
          ),
          { ...vendorObject, id_two: uniqueID(),isNew:false,edited:true },
        ])
      );
      setAction("new");
      setOpenCrud(false);
      setVendorObject({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
      });
    }
  };

  //Component
  return (
    <div
      className={`fixed top-0 left-0 right-0 bottom-0 z-[999]
     bg-cyan-750/50 backdrop-blur-sm ${
       crudOpen ? "flex" : "hidden"
     } justify-center pt-20`}
    >
      <div className="w-[35rem] h-[30rem] bg-white p-6 rounded relative">
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full h-full flex flex-col justify-between"
        >
          <div className="h-fit w-full flex flex-col space-y-4">
            <input
              onChange={(e) => {
                setVendorObject((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              value={vendorObject?.name}
              required
              type="text"
              name="vendorname"
              id="vendorname"
              autoComplete="off"
              placeholder="Vendor name ..."
              className="text-xs px-2 border-slate-300 focus:border-cyan-750 transition-all focus:ring-0
                 text-slate-600 placeholder:text-slate-400 w-full h-12 rounded bg-slate-50"
            />
            <input
              onChange={(e) => {
                setVendorObject((prev: any) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              value={vendorObject?.email}
              required
              type="email"
              name="vendoremail"
              id="vendoremail"
              autoComplete="off"
              placeholder="Vendor email ..."
              className="text-xs px-2 border-slate-300 focus:border-cyan-750 transition-all focus:ring-0
                 text-slate-600 placeholder:text-slate-400 w-full h-12 rounded bg-slate-50"
            />
            <input
              onChange={(e) => {
                setVendorObject((prev: any) => ({
                  ...prev,
                  phone: e.target.value,
                }));
              }}
              value={vendorObject?.phone}
              required
              type="text"
              name="vendorphone"
              id="vendorphone"
              autoComplete="off"
              placeholder="Vendor phone ..."
              className="text-xs px-2 border-slate-300 focus:border-cyan-750 transition-all focus:ring-0
                 text-slate-600 placeholder:text-slate-400 w-full h-12 rounded bg-slate-50"
            />
            <input
              onChange={(e) => {
                setVendorObject((prev: any) => ({
                  ...prev,
                  address: e.target.value,
                }));
              }}
              value={vendorObject?.address}
              required
              type="text"
              name="vendoraddress"
              id="vendoraddress"
              autoComplete="off"
              placeholder="Vendor address ..."
              className="text-xs px-2 border-slate-300 focus:border-cyan-750 transition-all focus:ring-0
                 text-slate-600 placeholder:text-slate-400 w-full h-12 rounded bg-slate-50"
            />
            <textarea
              onChange={(e) => {
                setVendorObject((prev: any) => ({
                  ...prev,
                  note: e.target.value,
                }));
              }}
              value={vendorObject?.note}
              required
              name="vendornote"
              id="vendornote"
              autoComplete="off"
              placeholder="Additional Notes ..."
              className="text-xs px-2 border-slate-300 focus:border-cyan-750 transition-all focus:ring-0
                 text-slate-600 placeholder:text-slate-400 w-full h-20 rounded bg-slate-50 resize-none"
            ></textarea>
          </div>

          <div className="h-10 w-full flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setAction("new");
                setOpenCrud(false);
              }}
              className="h-10 w-40 px-2 bg-slate-50 rounded-sm focus:outline-none 
        text-slate-500 font-medium text-xs uppercase border border-slate-200 hover:bg-slate-100 transition-all"
            >
              cancel
            </button>
            <button
              type="submit"
              className="h-10 w-40 px-2 bg-cyan-750 rounded-sm focus:outline-none 
        text-white font-medium text-xs uppercase border border-slate-200 hover:bg-cyan-800 transition-all"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrudVendor;
