import { FC, useState } from "react";
import {
  TbUser,
  TbChevronRight,
  TbUsers,
  TbShieldLock,
  TbSwitchVertical,
  TbBuildingStore,
  TbCreditCard,
  TbTruckDelivery,
  TbBusinessplan,
} from "react-icons/tb";

type Props = {};

const Settings: FC<Props> = () => {
  const menuList = [
    {
      id: 1,
      name: "profile settings",
      description: "manage your account passwords and more",
    },
    {
      id: 2,
      name: "team",
      description: "team members, access level and more",
    },
    {
      id: 3,
      name: "permissions",
      description: "control activities and permissions of you team",
    },
    {
      id: 4,
      name: "currencies",
      description: "add multi currencies to easily handle your funds",
    },
    {
      id: 5,
      name: "workspace details",
      description: "add company details like address and contacts",
    },
    {
      id: 6,
      name: "payments",
      description: "select available payments methods and intergrations",
    },
    {
      id: 7,
      name: "services",
      description: "manage shipping, delivery and collection services",
    },
    {
      id: 8,
      name: "billing & plans",
      description: "upgrade your plans and manage subscription",
    },
  ];
  const [activetab, setTab] = useState<any>();

  //Component
  return (
    <div className="w-full h-full px-[2.5%] py-4">
      <div
        className="w-full h-full p-2 px-0 overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar
         grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-2 auto-rows-min"
      >
        {menuList?.map((item: any) => {
          return (
            <div
              onClick={() => {
                setTab(item);
              }}
              key={item?.id}
              className="bg-white rounded col-span-1 h-24 border border-slate-300 p-3 grid gap-4 grid-cols-12
        hover:border-cyan-750 transition-all cursor-pointer select-none"
            >
              <div className="col-span-2 h-full flex items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-cyan-750/20 flex items-center justify-center text-xl text-cyan-800">
                  {item?.name === "profile settings" ? (
                    <TbUser />
                  ) : item?.name === "team" ? (
                    <TbUsers />
                  ) : item?.name === "permissions" ? (
                    <TbShieldLock />
                  ) : item?.name === "currencies" ? (
                    <TbSwitchVertical />
                  ) : item?.name === "workspace details" ? (
                    <TbBuildingStore />
                  ) : item?.name === "payments" ? (
                    <TbCreditCard />
                  ) : item?.name === "services" ? (
                    <TbTruckDelivery />
                  ) : (
                    <TbBusinessplan />
                  )}
                </div>
              </div>
              <div className="col-span-8 h-full flex flex-col justify-center space-y-1 overflow-hidden">
                <span
                  className="text-sm font-semibold text-slate-600 capitalize overflow-hidden whitespace-nowrap
            text-ellipsis"
                >
                  {item?.name}
                </span>
                <span
                  className="text-xs font-medium text-slate-500 capitalize w-full overflow-hidden whitespace-nowrap
            text-ellipsis"
                >
                  {item?.description}
                </span>
              </div>
              <div className="col-span-2 h-full flex items-center justify-center text-slate-600 text-xl">
                <TbChevronRight />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
