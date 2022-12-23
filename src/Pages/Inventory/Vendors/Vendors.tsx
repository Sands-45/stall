import { FC, useMemo, useState } from "react";
import { TbSearch, TbDotsVertical, TbTrash, TbEdit } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/store";
import CrudVendor from "./CrudVendor";
import no_wendor from "../../../Assets/no-vendor.png";
import { addVendors } from "../../../Redux/Slices/InventorySlice";

type Props = {};

const Vendors: FC<Props> = () => {
  const [search, setSearchValue] = useState<any>("");
  const fetched_vendors_data = useSelector(
    (state: RootState) => state.Inventory.vendors
  );
  const vendors = useMemo(() => {
    return fetched_vendors_data?.length >= 1
      ? [...fetched_vendors_data]
          ?.filter(
            (data: any) =>
              !data?.isDeleted &&
              (data?.name
                ?.toLowerCase()
                ?.replace(/\s/gim, "")
                ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.notes
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.email
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")) ||
                data?.phone
                  ?.toLowerCase()
                  ?.replace(/\s/gim, "")
                  ?.includes(search?.toLowerCase()?.replace(/\s/gim, "")))
          )
          ?.sort((a: any, b: any) => (b.name - a.name ? -1 : 1))
      : [];
  }, [fetched_vendors_data, search]);
  const [actionType, setAction] = useState<string>("new");
  const [crudOpen, setOpenCrud] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [vendorObject, setVendorObject] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  //Component
  return (
    <>
      <div className="w-full h-full rounded bg-white border border-slate-200 p-4 flex flex-col justify-between space-y-6">
        <div className="h-9 w-full overflow-hidden flex justify-between items-center">
          <span className="text-lg font-bold text-slate-700">Vendors</span>
          <div className="flex items-center space-x-4">
            <label htmlFor="filterOrders" className="relative w-fit h-fit">
              <TbSearch className="absolute right-2 top-2.5 text-base text-slate-500" />
              <input
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                value={search}
                type="search"
                name="filterOrders"
                id="filterOrders"
                placeholder="Quick Search ..."
                className="w-[15rem] h-9 rounded-sm border-slate-300 bg-inherit
           text-xs text-slate-500 placeholder:text-slate-500 px-2 pr-8 focus:ring-0 focus:border-cyan-750"
              />
            </label>
            <button
              onClick={() => {
                setAction("new");
                setOpenCrud(true);
              }}
              className="h-9 w-32 flex items-center justify-center rounded-sm
      space-x-2 font-semibold uppercase text-[0.65rem] text-white bg-cyan-750 outline-none 
      focus:outline-none hover:bg-cyan-800 transition-all"
            >
              <span>new vendor</span>
            </button>
          </div>
        </div>

        <div className="w-full h-[calc(100%-4rem)] flex flex-col space-y-2">
          {vendors.length >= 1 ? (
            vendors?.map((vendor: any) => {
              return (
                <div
                  key={vendor?.id_two}
                  className="w-full h-14 bg-slate-50 rounded border border-slate-200
             flex justify-between items-center p-2"
                >
                  <div
                    className="h-10 w-10 rounded bg-cyan-800 flex items-center
               justify-center text-white text-xl font-semibold capitalize"
                  >
                    {vendor?.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col justify-center h-full w-[calc(100%-3rem)] relative">
                    <span className="text-xs capitalize text-slate-600 font-semibold">
                      {vendor?.name}
                    </span>
                    <span className="text-xs lowercase text-slate-500">
                      {vendor?.email}
                    </span>
                    <div
                      className="h-8 w-8 flex items-center justify-center group
                 text-slate-600 absolute right-2 top-0.5 cursor-default"
                    >
                      <TbDotsVertical />

                      <div
                        className="absolute top-6 right-0 w-44 h-fit z-[99] rounded hidden group-hover:flex flex-col
                   bg-white border border-slate-200 shadow-lg p-2 overflow-hidden"
                      >
                        <div
                          onClick={() => {
                            dispatch(
                              addVendors([
                                ...fetched_vendors_data?.filter(
                                  (data: any) => data?.id_two !== vendor?.id_two
                                ),
                                { ...vendor, isDeleted: true },
                              ])
                            );
                            window.localStorage.setItem(
                              "vendors",
                              JSON.stringify([
                                ...fetched_vendors_data?.filter(
                                  (data: any) => data?.id_two !== vendor?.id_two
                                ),
                                {
                                  ...vendor,
                                  isDeleted: true,
                                  isNew: false,
                                  edited: false,
                                },
                              ])
                            );
                          }}
                          className="border-b border-slate-100 flex items-center justify-between
                     text-slate-500 w-full h-9 px-1 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <span className="text-xs font-semibold capitalize">
                            Delete
                          </span>
                          <TbTrash />
                        </div>
                        <div
                          onClick={() => {
                            setVendorObject(vendor);
                            setAction("edit");
                            setOpenCrud(true);
                          }}
                          className="flex items-center justify-between cursor-pointer
                     text-slate-500 w-full h-9 px-1 hover:bg-slate-50 transition-all"
                        >
                          <span className="text-xs font-semibold capitalize">
                            update
                          </span>
                          <TbEdit />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <img
                src={no_wendor}
                alt="no_vendor"
                className="w-20 h-20 opacity-80 object-center object-contain"
              />
              <p className="text-slate-400 text-sm font-medium text-center w-[50%]">
                There is currently no vendor found,
                <br />
                Please add one above
              </p>
            </div>
          )}
        </div>
      </div>

      {/**Crud Form */}
      <CrudVendor
        actionType={actionType}
        setAction={setAction}
        crudOpen={crudOpen}
        setOpenCrud={setOpenCrud}
        vendorObject={vendorObject}
        setVendorObject={setVendorObject}
      />
    </>
  );
};

export default Vendors;
