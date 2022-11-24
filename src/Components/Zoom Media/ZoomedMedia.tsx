import { FC, useState } from "react";
import useOnClickOutside from "../../Custom-Hooks/useOnClickOutsideRef";
import { TbArrowsDiagonalMinimize2, TbCloudDownload } from "react-icons/tb";

type Props = {
  zoomMed: any;
  setZoomed: any;
  type: any;
};

const ZoomedMed: FC<Props> = ({ zoomMed, setZoomed, type }) => {
  const modalRef = useOnClickOutside(() => {
    setZoomed((prev: any) => ({ ...prev, open: false, scr: "" }));
    document.body.style.overflow = "";
  });
  const [zoomValue, setValue] = useState<any>(1.0);

  //Component ==========
  return (
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 z-[9999] bg-[#030d27b7] ${
        zoomMed?.open ? type : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className={`m-auto mt-[5vh] drop-shadow-2xl bg-slate-50 dark:bg-slate-800 rounded object-center h-[90vh] w-[90vw] min-h-[10rem] border-2 border-slate-300 dark:border-slate-600 transition-all duration-300 z-[999] p-6 relative`}
      >
        {/**Close Modal Btn */}
        <button
          type="button"
          onClick={() => {
            setZoomed((prev: any) => ({ ...prev, open: false, scr: "" }));
            setValue(1);
            document.body.style.overflow = "";
          }}
          className="absolute  -top-2 -right-2 h-6 w-6 pt-[0.1rem] rounded flex items-center justify-center dark:bg-slate-500  bg-slate-750 transition-all outline-none focus:outline-none dark:text-white text-slate-100 text-lg"
        >
          <span>&times;</span>
        </button>
        {/**Close Modal Btn */}

        {/**Media Options =================== */}
        <div className="absolute bottom-2 z-[9999] h-10 w-full flex justify-center items-center space-x-2 rounded bg-transparent select-none">
          {/**Reset Zoom ====================== */}
          <button
            type="button"
            onClick={() => {
              setValue(1.0);
            }}
            className="rounded bg-slate-900/90  focus:outline-none h-9 w-9 text-white text-lg flex items-center justify-center font-light"
          >
            <TbArrowsDiagonalMinimize2 />
          </button>
          {/**Reset Zoom ====================== */}
          <div className="w-48 h-9 rounded bg-slate-900/90 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => {
                setValue((prev: any) => {
                  return parseFloat(prev) > 0.5 ? parseFloat(prev) - 0.5 : prev;
                });
              }}
              className="bg-transparent focus:outline-none h-full w-10 px-2 text-white text-2xl font-light"
            >
              -
            </button>
            <input
              onChange={(e) => {
                setValue(e.target.value);
              }}
              type="range"
              name="zoom"
              id="zoom"
              min={0.5}
              max={2}
              step={0.05}
              value={zoomValue}
              className="zoomRange w-[calc(100%-5rem)]"
            />
            <button
              type="button"
              onClick={() => {
                setValue((prev: any) => {
                  return parseFloat(prev) < 2 ? parseFloat(prev) + 0.5 : prev;
                });
              }}
              className="bg-transparent focus:outline-none h-full w-10 text-white text-xl font-light"
            >
              +
            </button>
          </div>
          {/**Save Media ====================== */}
          <a
            href={zoomMed?.src}
            download="dndhelp-desk"
            target="_blank"
            rel="noreferrer"
            className="rounded bg-slate-900/90  focus:outline-none h-9 w-9 text-white text-lg flex items-center justify-center font-light"
          >
            <TbCloudDownload />
          </a>
          {/**Save Media ====================== */}
        </div>
        {/**Zoom Media =================== */}
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <img
            style={{ transform: `scale(${zoomValue})` }}
            src={zoomMed?.src}
            alt="zoomedImg"
            className={`object-center object-scale-down h-full cursor-default rounded-sm scale-150 transition-all duration-200`}
          />
        </div>
      </div>
    </div>
  );
};

export default ZoomedMed;
