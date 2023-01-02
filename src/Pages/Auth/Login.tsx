import React, { FC, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logIn_background from "../../Assets/logIn_background.jpg";
import reportsDemoImg from "../../Assets/Hero_reports.png";
import logo from "../../Assets/Full Logo Tranparent Short.png";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../Firebase/Firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
//Firestore ===================
import {
  getFirestore,
  collection,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  saveWorkSpaces,
  setCurrent_workspace,
  updateUserData,
} from "../../Redux/Slices/UserSlice";
import { AppDispatch, RootState } from "../../Redux/store";
import { crypt } from "../../Custom Functions/Functions";
import { TbSearch } from "react-icons/tb";

// Initialize Firebase for auth======================
initializeApp(firebaseConfig);

//Initialize Services ======
const auth = getAuth();
// init services for firestore =========================
const db = getFirestore(initializeApp(firebaseConfig));

type Props = {};

const Login: FC<Props> = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const saved_workspaces = useSelector(
    (state: RootState) => state.UserInfo.saved_workspaces
  );
  const user = useSelector((state: RootState) => state.UserInfo.user);
  const [incorrectWarning, setWarning] = useState<boolean>(false);
  const [showOverlay, setOverlay] = useState<boolean>(false);
  const [logging, setLogging] = useState<boolean>(false);
  const [searchValue, setSearch] = useState<string>("");
  const [logValues, setValues] = useState<any>({
    email: "",
    passwd: "",
  });

  //Log In
  const handleLogIn = (e: React.SyntheticEvent) => {
    setLogging(true);
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, logValues.email, logValues.passwd)
        .then((currentUser: any) => {
          //Check All Workspaces where User is available ===============
          let workspacesRef: any = query(
            collection(db, "all_users"),
            where(
              "email",
              "==",
              currentUser.user.email?.replace(/\s/g, "")?.toLowerCase()
            )
          );

          getDocs(workspacesRef).then((snapshot) => {
            dispatch(
              saveWorkSpaces(
                snapshot.docs.map((doc: any) => ({
                  ...doc.data(),
                  id: doc.id,
                }))
              )
            );
            dispatch(
              updateUserData(
                snapshot.docs.map((doc: any) => ({
                  ...doc.data(),
                  id: doc.id,
                }))[0]
              )
            );
            window.localStorage.setItem(
              "bs-sessions-persit",
              JSON.stringify(
                snapshot.docs.map((doc: any) => ({
                  ...doc.data(),
                  id: doc.id,
                }))[0]
              )
            );
            window.localStorage.setItem(
              "saved_workspces",
              JSON.stringify(
                snapshot.docs.map((doc: any) => ({
                  ...doc.data(),
                  id: doc.id,
                }))
              )
            );
            setLogging(false);
            setOverlay(true);
            setValues({
              email: "",
              passwd: "",
            });
          });
        })
        .catch(() => {
          setLogging(false);
          setOverlay(false);
          setWarning(true);
          setTimeout(() => {
            setWarning(false);
          }, 5000);
        });
    });
  };

  //Check If User Is Logged
  useEffect(() => {
    if (user && window.localStorage.getItem("current_workspace")) {
      navigate("/portal");
    } else if (user && !window.localStorage.getItem("current_workspace")) {
      setOverlay(true);
    }
  }, [navigate, user]);

  //component
  return (
    <>
      {!window.localStorage.getItem("current_workspace") && !showOverlay && (
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
              <h1 className="text-white font-bold text-[2rem]">
                Hey, Let's Get You Back In
              </h1>
              <form
                onSubmit={(e) => handleLogIn(e)}
                className="flex flex-col items-center justify-center"
              >
                <label htmlFor="email">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`w-[20rem] h-11 text-xs text-cyan-50 placeholder:text-slate-300 rounded outline-none focus:ring-0 ${
                      incorrectWarning ? "border-red-600" : "border-slate-300"
                    } focus:border-cyan-50 focus:outline-none p-2 px-4 bg-cyan-800/80 login_input`}
                    placeholder="Enter email ..."
                    value={logValues?.email}
                    onChange={(e) =>
                      setValues((prev: any) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </label>
                <label htmlFor="password">
                  <input
                    autoComplete="off"
                    type="password"
                    name="password"
                    id="password"
                    className={`mt-4 w-[20rem] h-11 text-xs text-cyan-50 placeholder:text-slate-300 rounded outline-none focus:ring-0 ${
                      incorrectWarning ? "border-red-600" : "border-slate-300"
                    } focus:border-cyan-50 focus:outline-none p-2 px-4 bg-cyan-800/80 login_input`}
                    placeholder="Enter password ..."
                    value={logValues?.passwd}
                    onChange={(e) =>
                      setValues((prev: any) => ({
                        ...prev,
                        passwd: e.target.value,
                      }))
                    }
                  />
                </label>
                <span
                  className={`mt-4 text-xs text-red-500 font-medium ${
                    incorrectWarning ? "" : "hidden"
                  }`}
                >
                  &#9888; Incorrect password or email
                </span>
                <div className="mt-8 h-fit w-[20rem] flex items-center justify-between">
                  <button
                    disabled={logging}
                    type="submit"
                    className="h-10 w-[47%] bg-cyan-750 text-sm text-white font-semibold rounded flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    {!logging ? (
                      <span>Log In</span>
                    ) : (
                      <div className="h-5 w-5 border-4 border-cyan-50 border-l-cyan-400 animate-spin rounded-full"></div>
                    )}
                  </button>
                  <button
                    type="button"
                    className="h-10 w-[47%] border-2 border-cyan-500 text-sm text-cyan-500 font-semibold rounded"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="text-xs text-center text-slate-300 font-medium">
                © Stall {new Date().getFullYear()}. All rights reserved. <br />
                Contact developer or support at{" "}
                <span className="text-cyan-400">sandsqa@hotmail.com</span>
              </p>

              {/**Logo */}
              <Link to="/">
                <div className="h-14 w-20 rounded-sm bg-transparent absolute top-4 left-4 p-1 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="logo"
                    className="h-12 w-16 object-cover object-center"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/**Chose WorkSpace Overlay */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-cyan-50 ${
          saved_workspaces?.length >= 1 && showOverlay
            ? "w-screen left-0  z-[999]"
            : "w-0 -left-[200%]  -z-[999]"
        } transition-all duration-300 flex flex-col justify-center items-center space-y-6`}
      >
        <h1 className="text-cyan-900 text-3xl font-bold">
          Select The Workspace
        </h1>
        <div className="w-fit h-fit relative">
          <label htmlFor="search_workspace">
            <input
              type="search"
              name="search"
              id="search"
              value={searchValue}
              autoComplete="off"
              placeholder="Quick Search ..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="h-11 w-[27rem] p-2 px-4 text-xs text-slate-700 placeholder:text-slate-400
              rounded-full bg-white border border-cyan-900/50 focus:border-cyan-900/80 focus:ring-0 focus:outline-none"
            />
          </label>
          <TbSearch className="absolute right-4 top-3 text-slate-500 text-lg" />
        </div>
        <ul className="h-[20rem] w-[27rem] p-2 space-y-3 overflow-hidden overflow-y-scroll no-scrollbar no-scrollbar::-webkit-scrollbar">
          {saved_workspaces?.length >= 1 &&
            [...saved_workspaces]
              ?.filter((data: any) =>
                data?.workspace_name
                  ?.toLowerCase()
                  ?.replace(/\s/gi, "")
                  ?.includes(searchValue?.toLowerCase()?.replace(/\s/gi, ""))
              )
              ?.sort((a: any, b: any) =>
                a.workspace_name < b.workspace_name ? -1 : 1
              )
              ?.map((space: any) => {
                return (
                  <li
                    key={space?.id}
                    className="w-full h-14 rounded border border-slate-300 bg-white p-2 flex items-center space-x-2"
                  >
                    <div className="h-full w-10 rounded-sm bg-cyan-900 uppercase text-lg text-white font-bold flex items-center justify-center">
                      {space?.workspace_name?.charAt(0)}
                    </div>
                    <div className="h-full w-[calc(100%-2.75rem)] flex items-center justify-between">
                      <span className="w-[60%] overflow-hidden whitespace-nowrap text-ellipsis text-sm capitalize font-bold text-cyan-900">
                        {space?.workspace_name}
                      </span>
                      <button
                        onClick={() => {
                          dispatch(setCurrent_workspace(space));
                          dispatch(
                            updateUserData(
                              crypt("savedLocal", JSON.stringify(user))
                            )
                          );
                          window.localStorage.setItem(
                            "current_workspace",
                            JSON.stringify(space?.workspace_name)
                          );
                          window.localStorage.setItem(
                            "bs-sessions-persit",
                            JSON.stringify(
                              crypt("savedLocal", JSON.stringify(user))
                            )
                          );
                          window.localStorage.setItem("dataSynced", "true");
                          window.location.reload();
                          setOverlay(false);
                          navigate("/portal");
                        }}
                        className="px-6 h-8 text-xs text-cyan-750 font-semibold border-2 border-cyan-800/90 bg-cyan-50 rounded hover:opacity-80 transition-all"
                      >
                        Select
                      </button>
                    </div>
                  </li>
                );
              })}
        </ul>
      </div>
      {/**Chose WorkSpace Overlay */}
    </>
  );
};

export default Login;
