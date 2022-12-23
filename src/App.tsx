import { FC, lazy, Suspense } from "react";
import animatedLogo from "./Assets/Anim.gif";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Login from "./Pages/Auth/Login";
//Lazy Loading Components
const Portal = lazy(() => import("./Pages/Portal/Portal"));
const AppShell = lazy(() => import("./Pages/App Shell/AppShell"));
const PointOfSell = lazy(() => import("./Pages/POS/PointOfSell"));
const Sales = lazy(() => import("./Pages/Sales/Sales"));
const Campaigns = lazy(() => import("./Pages/Campaigns/Campaigns"));
const Reports = lazy(() => import("./Pages/Reports/Reports"));
const Customers = lazy(() => import("./Pages/Customers/Customers"));
const Inventory = lazy(() => import("./Pages/Inventory/Inventory"));
const OnlineStore = lazy(() => import("./Pages/Online Store/OnlineStore"));
const Settings = lazy(() => import("./Pages/Settings/Settings"));
const Products = lazy(() => import("./Pages/Inventory/Products/Products"));
const StockOrder = lazy(() => import("./Pages/Inventory/Stock Orders/StockOrder"));
const Vendors = lazy(() => import("./Pages/Inventory/Vendors/Vendors"));

const App: FC = () => {
  //Component || App
  return (
    <div className="overflow-hidden">
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center overflow-hidden">
              <img
                src={animatedLogo}
                alt="animatedLogo"
                className="w-28 object-cover object-center"
              />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/logIn" element={<Login />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/app" element={<AppShell />}>
              <Route path="" element={<PointOfSell />} />
              <Route path="sales" element={<Sales />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="reports" element={<Reports />} />
              <Route path="customers" element={<Customers />} />
              <Route path="inventory" element={<Inventory />}>
                <Route path="" element={<Products />} />
                <Route path="stock-orders" element={<StockOrder />} />
                <Route path="vendors" element={<Vendors />} />
              </Route>
              <Route path="online-store" element={<OnlineStore />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
};

export default App;
