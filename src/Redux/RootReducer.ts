import UserSlice from "./Slices/UserSlice";
import InventorySlice from "./Slices/InventorySlice";
import SettingsSlice from "./Slices/SettingsSlice";

const rootReducer = {
  UserInfo: UserSlice,
  Inventory:InventorySlice,
  SettingsData:SettingsSlice
};

export default rootReducer;
