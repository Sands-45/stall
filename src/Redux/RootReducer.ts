import UserSlice from "./Slices/UserSlice";
import InventorySlice from "./Slices/InventorySlice";
import SettingsSlice from "./Slices/SettingsSlice";
import NotificationsSlice from "./Slices/NotificationsSlice";
import SalesSlice from "./Slices/SalesSlice";

const rootReducer = {
  UserInfo: UserSlice,
  Inventory:InventorySlice,
  SettingsData:SettingsSlice,
  NotificationsData: NotificationsSlice,
  Sales: SalesSlice
};

export default rootReducer;
