import { FC, useState } from "react";
import { Link } from "react-router-dom";
import logIn_background from "../../Assets/logIn_background.jpg";
import reportsDemoImg from "../../Assets/Hero_reports.png";
import logo from "../../Assets/Full Logo Tranparent Short.png";

type Props = {};

const Login: FC<Props> = () => {
  const [logValues, setValues] = useState<any>({
    email: "",
    passwd: "",
  });

  //component
  return (
    <div
      style={{ background: `url(${logIn_background})` }}
      className="w-screeen min-h-screen bg-contain bg-fixed bg-no-repeat bg-center bg-cyan-900 relative overflow-hidden"
    >
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center overflow-hidden">
        <img
          src={reportsDemoImg}
          alt="background"
          className="w-[60%] h-fit object-cover object-center"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-900 to-cyan-750/80 space-y-6">
          <h1 className="text-white font-semibold text-[2rem]">
            Hey, Let's Get You In
          </h1>
          <form className="flex flex-col items-center justify-center">
            <label htmlFor="email">
              <input
                type="email"
                name="email"
                id="email"
                className="w-[20rem] h-11 text-xs text-cyan-50 placeholder:text-slate-300 rounded outline-none focus:ring-0 border-slate-300 focus:border-cyan-50 focus:outline-none p-2 px-4 bg-cyan-800/80"
                placeholder="Enter email ..."
                value={logValues?.email}
                onChange={(e) =>
                  setValues((prev: any) => ({ ...prev, email: e.target.value }))
                }
              />
            </label>
            <label htmlFor="password">
              <input
                type="password"
                name="password"
                id="password"
                className="w-[20rem] h-11 mt-4 text-xs text-cyan-50 placeholder:text-slate-300 rounded outline-none focus:ring-0 border-slate-300 focus:border-cyan-50 focus:outline-none p-2 px-4 bg-cyan-800/80"
                placeholder="Enter password ..."
                value={logValues?.passwd}
                onChange={(e) =>
                  setValues((prev: any) => ({ ...prev, passwd: e.target.value }))
                }
              />
            </label>
            <div className="mt-8 h-fit w-[20rem] flex items-center justify-between">
              <button
                type="submit"
                className="h-10 w-[47%] bg-cyan-750 text-sm text-white font-medium rounded"
              >
                Log In
              </button>
              <button
                type="button"
                className="h-10 w-[47%] border-2 border-cyan-500 text-sm text-cyan-500 font-medium rounded"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="text-xs text-center text-slate-300 font-medium">
            © Stall {new Date().getFullYear()}. All rights reserved. <br />
            Please refer to our Privacy Policy for more details.
          </p>

          {/**Logo */}
          <Link to="/">
            <div className="h-10 w-11 rounded-sm shadow-2xl drop-shadow-2xl bg-cyan-100 absolute top-4 left-4 p-1 flex items-center justify-center">
              <img
                src={logo}
                alt="logo"
                className="w-full h-fit object-cover object-center"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
