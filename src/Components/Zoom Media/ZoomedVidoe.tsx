import { FC } from "react";
import useOnClickOutside from "../../Custom-Hooks/useOnClickOutsideRef";
import { TbCloudDownload } from "react-icons/tb";

type Props = {
  zoomVd: any;
  setZoomed: any;
};

const ZoomedVideo: FC<Props> = ({ zoomVd, setZoomed }) => {
  const modalRef = useOnClickOutside(() => {
    setZoomed((prev: any) => ({ ...prev, open: false, scr: "" }));
    document.body.style.overflow = "";
  });

  //Component ==========
  return (
    <div
      className={`fixed left-0 right-0 top-0 bottom-0 z-[9999] bg-[#030d27b7] ${
        zoomVd?.open ? "" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className={`m-auto mt-[5vh] drop-shadow-2xl bg-slate-50 dark:bg-slate-800 rounded object-center h-[90vh] w-[90vw] min-h-[10rem] border border-slate-500 dark:border-slate-600 transition-all duration-300 z-[999] p-6 relative`}
      >
        {/**Close Modal Btn */}
        <button
          type="button"
          onClick={() => {
            setZoomed((prev: any) => ({ ...prev, open: false, scr: "" }));
            document.body.style.overflow = "";
          }}
          className="absolute  -top-2 -right-2 h-6 w-6 pt-[0.1rem] rounded flex items-center justify-center dark:bg-slate-500  bg-slate-300 transition-all outline-none focus:outline-none dark:text-white text-slate-700 text-lg"
        >
          <span>&times;</span>
        </button>
        {/**Close Modal Btn */}

        {/**Video Options =================== */}
        <div className="absolute bottom-2 z-[9999] h-10 w-full flex justify-center items-center space-x-2 rounded bg-transparent select-none">
          <a
            href={zoomVd?.src}
            download="dndhelp-desk"
            target="_blank"
            rel="noreferrer"
            className="rounded bg-slate-900/90  focus:outline-none h-9 w-9 text-white text-lg flex items-center justify-center font-light"
          >
            <TbCloudDownload />
          </a>
          {/**Save Video ====================== */}
        </div>
        {/**Zoom Video =================== */}
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <video className="h-[90%] aspect-video" controls>
            <source src={zoomVd?.src} type="video/webm" />
            <source src={zoomVd?.src} type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
      </div>
    </div>
  );
};

export default ZoomedVideo;
