import { FC } from "react";
import { Link } from "react-router-dom";
import Logo from "../../Assets/Full Logo Tranparent Short.png";
import landing_reports from "../../Assets/landing_reports.jpeg";
import reports_data from "../../Assets/offline.jpg";
import data_rep from "../../Assets/data_rep.png";
import Hero_reports from "../../Assets/Hero_reports.png";
import ear_products from "../../Assets/Deme Products/Earphones.png";
import lap_products from "../../Assets/Deme Products/Dell XPS 360.png";
import {
  HiCalculator,
  HiClipboardList,
  HiShoppingBag,
  HiSpeakerphone,
  HiArrowCircleUp,
} from "react-icons/hi";
import Footer from "./Footer";

type Props = {};

const Landing: FC<Props> = () => {
  return (
    <div className="min-h-screen w-screen bg-slate-50 overflow-hidden overflow-y-scroll">
      <header className="w-full h-fit px-[5%]">
        <nav className="w-full h-16 pt-8 p-2 flex items-center justify-between space-x-6">
          <div className="h-full w-60 flex items-center">
            <img
              src={Logo}
              alt="logo"
              className="h-12 w-16 object-fit object-center"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8 hover:opacity-80 transition-all">
            <Link
              to=""
              className="text-base font-semibold tracking-wider text-cyan-900"
            >
              Features
            </Link>
            <Link
              to=""
              className="text-base font-semibold tracking-wider text-cyan-900"
            >
              Pricing
            </Link>
            <Link
              to=""
              className="text-base font-semibold tracking-wider text-cyan-900"
            >
              Company
            </Link>
            <Link
              to=""
              className="text-base font-semibold tracking-wider text-cyan-900"
            >
              Resources
            </Link>
            <Link
              to=""
              className="text-base font-semibold tracking-wider text-cyan-900"
            >
              Contact
            </Link>
          </div>
          <div className="h-full w-fit flex items-center space-x-4">
            <Link
              to="/login"
              className="outline-none h-9 w-fit rounded-full bg-inherit hover:opacity-80 transition-all text-xs text-cyan-750 font-bold uppercase tracking-wide"
            >
              <div className="pt-0.5 h-9 w-fit flex items-center justify-center whitespace-nowrap px-6 rounded-full border-2 border-cyan-750 select-none">
                Log In
              </div>
            </Link>
            <button className="outline-none h-9 px-4 rounded-full bg-cyan-750 hover:opacity-80 transition-all text-xs text-white font-bold uppercase tracking-wider whitespace-nowrap">
              Get Started
            </button>
          </div>
        </nav>
      </header>
      {/**Hero ================= */}
      <div className="w-full h-fit py-12 px-[5%] space-y-4">
        <h1 className="text-cyan-900 font-bold text-2xl md:text-[2.75rem] leading-[3rem] text-center">
          Your Go To All-In-One Store <br />
          Encompassing All Your Needs
        </h1>
        <p className="text-xs md:text-sm text-center text-cyan-800 font-medium">
          Stall is your all In-One Store with features ranging from POS,
          <br /> Inventory, Online Store, CRM, Sales and Advanced Reports with
          full offline support
        </p>
        <form className="flex items-center justify-center relaive w-full">
          <div className="w-fit h-fit relative">
            <label htmlFor="email_start" className="w-fit h-fit relative">
              <input
                type="email"
                name="email_start"
                id="email_start"
                placeholder="Enter your email ..."
                className="w-[20rem] md:w-[30rem] h-12 rounded-full border-cyan-600/30 placeholder:text-xs text-xs  text-slate-700 placeholder:text-slate-400 pl-4 pr-32 focus:ring-0 focus:border-cyan-750 focus:outline-none"
              />
            </label>
            <button className="h-10 px-4 rounded-full bg-cyan-750 absolute top-1 right-1 text-sm font-semibold capitalize text-white">
              Get Started
            </button>
          </div>
        </form>
      </div>

      <div className="w-full h-fit pt-6 px-[5%] flex justify-center">
        <div className="w-[70%] h-[30rem] relative border-l-[0.75rem] border-r-[0.75rem] border-t-[0.75rem] border-slate-800 rounded-t-[2rem] overflow-hidden">
          <img
            src={Hero_reports}
            alt="reports"
            className="object-fit object-center w-full"
          />
        </div>
      </div>
      {/**Hero ================= */}

      <div className="w-full h-fit px-[5%] py-8 pb-4 bg-white flex justify-center items-center">
        <div className="max-w-[75%] w-fit h-fit rounded-2xl p-4 space-y-2">
          <h2 className="text-2xl font-bold text-cyan-900 text-center">
            Over 1000 business trust Stall Platform
          </h2>
          <p className="text-sm font-medium text-cyan-800 text-center">
            Boost revenue, redefine the in-store and online shopping experience
            with a Modern POS. <br /> Gain insights that help you scale and grow
            faster.
          </p>
        </div>
      </div>

      {/**Features ================= */}
      <div className="w-full h-fit bg-white py-12 px-[5%] flex flex-col items-center justify-center space-y-4">
        <div className="h-8 px-4 rounded-full bg-cyan-750/50 text-cyan-900 text-xs font-medium flex items-center justify-center">
          Features
        </div>
        <h3 className="text-2xl font-bold text-cyan-900 text-center">
          Top must have features
        </h3>
        <p className="text-sm font-medium text-cyan-800 text-center">
          <b>Stall</b> is modern digital store management system geared towards
          <br />
          Simplifying how businness is coduct without a hustle
        </p>
        <div className="h-fit w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="col-span-1 min-h-[8rem] bg-cyan-750/10 rounded-md p-6 space-y-2 flex flex-col items-center">
            <div className="flex justify-center items-center h-10 w-10 rounded bg-orange-600 text-white text-xl">
              <HiCalculator />
            </div>
            <p className="text-base font-bold text-center text-cyan-900">
              Point of Sale
            </p>
            <p className="text-sm font-medium text-center text-cyan-700">
              Offer a fast, and frictionless service that reduces wait times and
              creates a smooth experience for all.
            </p>
          </div>

          <div className="col-span-1 min-h-[8rem] bg-cyan-750/10 rounded-md p-6 space-y-2 flex flex-col items-center">
            <div className="flex justify-center items-center h-10 w-10 rounded bg-sky-600 text-white text-xl">
              <HiClipboardList />
            </div>
            <p className="text-base font-bold text-center text-cyan-900">
              Inventory
            </p>
            <p className="text-sm font-medium text-center text-cyan-700">
              Do stock counting and keep track of all your products, with live
              notifications before running out of stock.
            </p>
          </div>

          <div className="col-span-1 min-h-[8rem] bg-cyan-750/10 rounded-md p-6 space-y-2 flex flex-col items-center">
            <div className="flex justify-center items-center h-10 w-10 rounded bg-indigo-600 text-white text-xl">
              <HiShoppingBag />
            </div>
            <p className="text-sm font-bold text-center text-cyan-900">
              Online Store
            </p>
            <p className="text-sm font-medium text-center text-cyan-700">
              Provide your customers with an omni-channel service giving you an
              additional methods to advertise and sell.
            </p>
          </div>

          <div className="col-span-1 min-h-[8rem] bg-cyan-750/10 rounded-md p-6 space-y-2 flex flex-col items-center">
            <div className="flex justify-center items-center h-10 w-10 rounded bg-red-600 text-white text-xl">
              <HiSpeakerphone />
            </div>
            <p className="text-sm font-bold text-center text-cyan-900">
              Campaigns
            </p>
            <p className="text-sm font-medium text-center text-cyan-700">
              Keep your brand on top of your customer's mind and familiar with
              the brand and stay on top of competitors
            </p>
          </div>
        </div>
      </div>
      {/**Features ================= */}

      <div className="w-full px-[16.5%] py-12 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        <div className="col-span-1 flex flex-col justify-center">
          <div className="h-8 w-fit px-4 rounded-full bg-cyan-750/50 text-cyan-900 text-xs font-medium flex items-center justify-center">
            Detailed Inventory
          </div>
          <div className="text-base text-cyan-900 font-semibold mt-4">
            When you can automatically track how much stock you have and exactly
            where it is, the process of managing your inventory transforms from
            a challenging, manual process to a core part of your business growth
            strategy.
          </div>
          <p className="text-sm font-medium text-cyan-800 mt-4">
            Managing inventory also helps you make informed decisions, forecast
            buying trends, and even prevent employee theft.
          </p>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <div className="relative w-fit h-fit overflow-hidden rounded-2xl">
            <img
              src={landing_reports}
              alt="reports"
              className="h-[25rem] w-[25rem] rounded-2xl object-fit object-center object-cover"
            />
            <div className="absolute top-0 left-0 righ-0 bottom-0 flex flex-col items-center pt-10 h-[30rem] w-[25rem] rounded overflow-hidden bg-cyan-750/40 z-[999]">
              <div className="shadow-2xl drop-shadow-2xl h-14 w-[80%] flex items-center justify-between rounded-full bg-white p-1 space-x-2">
                <div className="h-full flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full saturate-200 relative after:rounded-full after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 after:bg-cyan-750/20 after:z-[999]">
                    <img
                      src={ear_products}
                      alt="product"
                      className="h-12 w-12 rounded-full object-fit object-center border border-cyan-800"
                    />
                  </div>
                  <div className="h-full flex flex-col space-y-0 justify-center">
                    <span className="text-[0.65rem] text-slate-700 font-semibold">
                      Earbuds GH34
                    </span>
                    <span className="text-[0.65rem] text-slate-500 font-medium">
                      PROD-345TKO1
                    </span>
                  </div>
                </div>
                <div className="h-7 px-3 p-0.5 flex items-center justify-center rounded-full bg-green-500/50 text-[0.65rem] text-green-600">
                  Best Seller
                </div>
                <HiArrowCircleUp className="text-3xl text-green-600" />
              </div>

              <div className="mt-4 opacity-60 h-14 w-[80%] flex items-center justify-between rounded-full bg-white p-1 space-x-2">
                <div className="h-full flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full saturate-200 relative after:rounded-full after:absolute after:top-0 after:left-0 after:bottom-0 after:right-0 after:bg-cyan-750/20 after:z-[999]">
                    <img
                      src={lap_products}
                      alt="product"
                      className="h-12 w-12 rounded-full object-fit object-center border border-cyan-800"
                    />
                  </div>
                  <div className="h-full flex flex-col space-y-0 justify-center">
                    <span className="text-[0.65rem] text-slate-700 font-semibold">
                      Black Laptop
                    </span>
                    <span className="text-[0.65rem] text-slate-500 font-medium">
                      LAP-907TKO4
                    </span>
                  </div>
                </div>
                <HiArrowCircleUp className="text-3xl text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-[16.5%] py-12 pb-28 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        <div className="col-span-1 flex items-center justify-start">
          <div className="relative w-full h-fit overflow-hidden rounded-2xl">
            <img
              src={reports_data}
              alt="offline"
              className="h-[25rem] w-full rounded-2xl overflow-hidden object-fit object-center object-cover drop-shadow-2xl shadow-2xl"
            />
            <div className="absolute top-0 left-0 righ-0 bottom-0 flex flex-col items-center pt-32 h-[30rem] w-[25rem] rounded-2xl overflow-hidden bg-blue-600/30 z-[999]">
              <div className="shadow-2xl drop-shadow-2xl h-20 w-[90%] flex items-center justify-between rounded-2xl bg-transparent p-1 space-x-2">
                <img
                  src={data_rep}
                  alt="data"
                  className="w-full object-center object-fit drop-shadow-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-center items-end">
          <div className="h-8 w-fit px-4 rounded-full bg-blue-500/50 text-blue-600 text-xs font-medium flex items-center justify-center">
            Powerful Reports
          </div>
          <div className="text-base text-cyan-900 font-semibold text-right mt-4">
            Reports are important detail that can be used to help develop future
            forecasts, marketing plans, guide budget planning and improve
            decision-making.
          </div>
          <p className="text-sm font-medium text-cyan-800 text-right mt-4">
            Self-service data analytics and reports that lets you create
            visually appealing data visualizations and insightful reports in
            minutes.
          </p>
        </div>
      </div>

      {/**Footer ================= */}
      <Footer />
      {/**Footer ================= */}
    </div>
  );
};

export default Landing;
