import { FC, useState } from "react";
import { TbChevronRight, TbUser, TbEdit, TbLock } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../Redux/store";
import { updateAlert } from "../../../Redux/Slices/NotificationsSlice";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../../Firebase/Firebase";

type Props = {
  setTab: any;
};

const ProfleSettings: FC<Props> = ({ setTab }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const alerts = useSelector(
    (state: RootState) => state.NotificationsData.alerts
  );
  const [name, setName] = useState<string>(user?.name);
  const [passwordObj, setPassObj] = useState<any>({
    old_pass: "",
    new_pass: "",
  });

  console.log(auth)
  //Set New Password ===========================
  const newPassword = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (auth.currentUser?.email && auth.currentUser) {
      let credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        passwordObj.old_pass
      );
      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, passwordObj.new_pass)
            .then(() => {
              dispatch(
                updateAlert([
                  ...alerts,
                  {
                    message: "Password Update Successfully",
                    color: "bg-green-200",
                    id: new Date().getTime(),
                  },
                ])
              );
              setPassObj({
                old_pass: "",
                new_pass: "",
              });
            })
            .catch((error) => {
              dispatch(
                updateAlert([
                  ...alerts,
                  {
                    message: error.message,
                    color: "bg-red-200",
                    id: new Date().getTime(),
                  },
                ])
              );
            });
        })
        .catch((error) => {
          console.log(error.message);
          dispatch(
            updateAlert([
              ...alerts,
              {
                message: error.message,
                color: "bg-red-200",
                id: new Date().getTime(),
              },
            ])
          );
        });
    }
  };

  //Component
  return (
    <div
      className="w-full h-full max-w-[83rem] m-auto flex flex-col justify-between overflow-hidden
     overflow-y-scroll no-scrollbar no-scrolbar::-webkit-scrollbar"
    >
      <div className="h-8 flex items-center space-x-0 whitespace-nowrap overflow-hidden">
        <span
          onClick={() => {
            setTab(null);
          }}
          className="text-cyan-750 text-xs font-semibold capitalize cursor-pointer select-none"
        >
          settings
        </span>
        <TbChevronRight className="text-base text-slate-600 stroke-[2]" />
        <span className="text-slate-600 text-xs font-semibold capitalize cursor-pointer select-none">
          Profile Settings
        </span>
      </div>

      <div
        className="w-full h-[calc(100%-2.5rem)] grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden
     overflow-y-scroll no-scrollbar no-scrolbar::-webkit-scrollbar"
      >
        <form className="h-fit col-span-1 rounded bg-white border border-slate-200 p-6 oveflow-hidden">
          <div className="w-full flex space-x-2 items-center border-b border-slate-200 h-fit pb-4">
            <div className="h-10 w-10 rounded-sm bg-cyan-750/20 flex items-center justify-center text-xl text-cyan-800">
              <TbUser />
            </div>
            <span className="text-base text-slate-600 font-bold">
              Profile Settings
            </span>
          </div>

          <ul className="w-full mt-4 space-y-4">
            <div className="flex flex-col space-y-1 bg-slate-50 rounded border border-slate-200 p-4 relative">
              <span className="text-slate-600 text-sm font-semibold capitalize">
                name
              </span>
              <input
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                type="text"
                name="user_name"
                id="user_name"
                placeholder="Name"
                className="h-8 px-0 bg-inherit border-0  border-slate-100 focus:border-cyan-750/30 
                focus:ring-0 transtion-all text-xs plceholder:text-slate-500 text-slate-600 font-medium"
              />
              <TbEdit className="absolute right-4 bottom-6 text-slate-500 pointer-events-none" />
            </div>
            <div className="flex flex-col space-y-1 bg-slate-50 rounded border border-slate-200 p-4 relative">
              <span className="text-slate-600 text-sm font-semibold capitalize">
                email
              </span>
              <div className="h-8 flex items-center text-xs text-slate-600 lowercase font-medium">
                {user?.email}
              </div>
            </div>
          </ul>

          <div className="mt-4 w-full flex justify-end">
            <button
              type="submit"
              className="bg-cyan-750 text-white text-xs font-semibold h-9 w-36 rounded-sm px-4"
            >
              Save changes
            </button>
          </div>
        </form>

        <form
          onSubmit={(e) => newPassword(e)}
          className="h-fit col-span-1 rounded bg-white border border-slate-200 p-6 oveflow-hidden"
        >
          <div className="w-full flex space-x-2 items-center border-b border-slate-200 h-fit pb-4">
            <div className="h-10 w-10 rounded-sm bg-cyan-750/20 flex items-center justify-center text-xl text-cyan-800">
              <TbLock />
            </div>
            <span className="text-base text-slate-600 font-bold">
              Change Password
            </span>
          </div>

          <ul className="w-full mt-4 space-y-4">
            <div className="flex flex-col space-y-1 bg-slate-50 rounded border border-slate-200 p-4 relative">
              <span className="text-slate-600 text-sm font-semibold capitalize">
                Old Password
              </span>
              <input
                onChange={(e) => {
                  setPassObj((prev: any) => ({
                    ...prev,
                    old_pass: e.target.value,
                  }));
                }}
                autoComplete="off"
                required
                value={passwordObj?.old_pass}
                type="password"
                name="old_password"
                id="old_password"
                placeholder="**** **** ****"
                className="h-8 px-0 bg-inherit border-0  border-slate-100 focus:border-cyan-750/30 
                focus:ring-0 transtion-all text-xs plceholder:text-slate-500 text-slate-600"
              />
              <TbEdit className="absolute right-4 bottom-6 text-slate-500 pointer-events-none" />
            </div>
            <div className="flex flex-col space-y-1 bg-slate-50 rounded border border-slate-200 p-4 relative">
              <span className="text-slate-600 text-sm font-semibold capitalize">
                New Password
              </span>
              <input
                onChange={(e) => {
                  setPassObj((prev: any) => ({
                    ...prev,
                    new_pass: e.target.value,
                  }));
                }}
                autoComplete="off"
                required
                value={passwordObj?.new_pass}
                type="password"
                name="new_password"
                id="new_password"
                placeholder="**** **** ****"
                className="h-8 px-0 bg-inherit border-0  border-slate-100 focus:border-cyan-750/30 
                focus:ring-0 transtion-all text-xs plceholder:text-slate-500 text-slate-600"
              />
              <TbEdit className="absolute right-4 bottom-6 text-slate-500 pointer-events-none" />
            </div>
          </ul>

          <div className="mt-4 w-full flex justify-end">
            <button className="bg-cyan-750 text-white text-xs font-semibold h-9 w-36 rounded-sm px-4">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfleSettings;
