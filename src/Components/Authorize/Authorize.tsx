import { FC, useEffect, useState } from "react";
import { TbShieldLock } from "react-icons/tb";
import { useSelector } from "react-redux";
import { org } from "../../Firebase/Firestore_Func";
import { RootState } from "../../Redux/store";
import { decrypt } from "../../Custom Functions/Functions";

type Props = {
  showAuthorize: boolean;
  setAuthorize: any;
  passedAuthFunc: any;
  showReason?: boolean;
  reason?: any;
  setReason?: any;
};

const Authorize: FC<Props> = ({
  showAuthorize,
  setAuthorize,
  passedAuthFunc,
  reason,
  setReason,
  showReason,
}) => {
  const [typedValue, setValue] = useState<string>("");
  const local_ref = useSelector(
    (state: RootState) => state?.SettingsData.local_ref
  );
  const [changeBorder, setBorder] = useState<boolean>(false);
  //Auth Fucnt
  const auth = (e: any) => {
    let pass = e;
    passedAuthFunc(pass);
  };

  //Disable Border Alert{
  useEffect(() => {
    const timer: any = setTimeout(() => {
      if (changeBorder) {
        setBorder(false);
      }
      return clearTimeout(timer);
    }, 3000);
  }, [changeBorder]);

  //Component
  return (
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 ${
        showAuthorize ? "flex" : "hidden"
      } justify-center items-center z-[999999] bg-cyan-750/50 backdrop-blur-sm`}
    >
      <div className="w-[27rem] h-fit bg-white rounded drop-shadow-xl shadow-xl p-4 relative">
        {/**Close Button */}
        <button
          onClick={() => {
            setAuthorize(false);
            setReason&&setReason("");
            setValue("");
          }}
          className="h-7 w-7 bg-white border rounded text-slate-700 text-base
         absolute -top-4 -right-8 hover:bg-red-50 transition-all"
        >
          &times;
        </button>

        <div className="w-full h-full overflow-hidden flex flex-col space-y-4 justify-between items-center">
          <div className="w-full flex items-center space-x-2">
            <div className={`h-7 w-7 rounded ${changeBorder?"bg-red-700":"bg-teal-700"}  text-white text-lg flex justify-center items-center`}>
              <TbShieldLock />
            </div>
            <span className="text-sm text-slate-600 font-semibold uppercase">
              Authorization required
            </span>
          </div>

          <p className="text-sm text-slate-500 font-meeium">
            Critical actions require authentication to ensure credibility and
            rights protection. Please enter the auth pin below
          </p>

          <form
            className="h-fit w-full grid gap-4"
            onSubmit={(e) => {
              console.log(decrypt(org, local_ref)?.toString()?.toLowerCase())
              e.preventDefault();
              if (
                "10101145" ===
                typedValue?.toString()?.toLowerCase()
              ) {
                setBorder(false);
                auth(
                  "10101145" ===
                    typedValue?.toString()?.toLowerCase()
                );
                setValue("");
              } else {
                setBorder(true);
              }
            }}
          >
            {showReason && (
              <textarea
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                required
                value={reason}
                name="void_reason"
                id="void_reason"
                placeholder="Reason ..."
                maxLength={100}
                className={`w-full h-20 rounded-sm border-dashed border-slate-300 focus:border-cyan-750 focus:ring-0 outline-none
               text-xs text-slate-600 placeholder:text-slate-400 resize-none`}
              ></textarea>
            )}
            <div className="w-full flex items-center justify-between">
              <label htmlFor="auth_pin" className="w-[65%]">
                <input
                autoFocus
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                  required
                  value={typedValue}
                  type="text"
                  name="auth_pin"
                  id="auth_pin"
                  autoComplete="off"
                  placeholder="Passcode here ..."
                  className={`w-full h-10 rounded-sm ${
                    changeBorder ? "border-red-600 focus:border-red-600" : "border-slate-300 focus:border-cyan-750"
                  }  focus:ring-0 outline-none
               text-xs text-slate-600 placeholder:text-slate-400`}
                />
              </label>
              <button
                type="submit"
                className="h-10 w-[30%] bg-cyan-700 text-white text-[0.65rem] font-medium uppercase rounded-sm
              hover:bg-cyan-800 transition-all outline-none focus:outline-none
               flex items-center justify-center space-x-2"
              >
                <span>authorize</span>
              </button>
            </div>
            {changeBorder && (
              <span className="w-full text-xs text-red-600 font-medium">
                Incorrect passcode, try again
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Authorize;
