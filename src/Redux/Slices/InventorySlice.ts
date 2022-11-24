import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const localInventory_data = localStorage.getItem("inventory_data");
const localInventory_changes_data = localStorage.getItem(
  "inventory_changes_data"
);
const local_changelog_inventory_data = localStorage.getItem(
  "inventory_changelog_data"
);

interface InitialStateType {
  inventory_data: any[];
  inventory_changes_data: any[];
  inventory_changelog_data: any[];
}

const initialState: InitialStateType = {
  inventory_data: localInventory_data ? JSON.parse(localInventory_data) : null,
  inventory_changes_data: localInventory_changes_data
    ? JSON.parse(localInventory_changes_data)
    : null,
  inventory_changelog_data: local_changelog_inventory_data
    ? JSON.parse(local_changelog_inventory_data)
    : null,
};

export const InventorySlice = createSlice({
  name: "Inventory",
  initialState,
  reducers: {
    loadInventoryData: (state, action: PayloadAction<any[]>) => {
      state.inventory_data = action.payload;
    },
    updateLocalInventory_Changes: (state, action: PayloadAction<any[]>) => {
      state.inventory_changes_data = action.payload;
    },
    updateLocalInventory_ChangeLogs: (state, action: PayloadAction<any[]>) => {
      state.inventory_changelog_data = action.payload;
    },
  },
});

export const {
  loadInventoryData,
  updateLocalInventory_Changes,
  updateLocalInventory_ChangeLogs,
} = InventorySlice.actions;

export default InventorySlice.reducer;
