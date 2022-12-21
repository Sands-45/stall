import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const localInventory_data = localStorage.getItem("inventory_data");
const localInventory_changes_data = localStorage.getItem(
  "inventory_changes_data"
);
const local_changelog_inventory_data = localStorage.getItem(
  "inventory_changelog_data"
);
const localStock_orders = localStorage.getItem("stock_orders");
const localStock_orders_changes = localStorage.getItem("stock_orders_changes");

interface InitialStateType {
  inventory_data: any[];
  inventory_changes_data: any[];
  inventory_changelog_data: any[];
  stock_orders: any[];
  stock_orders_changes: any[];
}

const initialState: InitialStateType = {
  inventory_data: localInventory_data ? JSON.parse(localInventory_data) : [],
  inventory_changes_data: localInventory_changes_data
    ? JSON.parse(localInventory_changes_data)
    : [],
  inventory_changelog_data: local_changelog_inventory_data
    ? JSON.parse(local_changelog_inventory_data)
    : [],
  stock_orders: localStock_orders ? JSON.parse(localStock_orders) : [],
  stock_orders_changes: localStock_orders_changes
    ? JSON.parse(localStock_orders_changes)
    : [],
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
    addStock_Orders: (state, action: PayloadAction<any[]>) => {
      state.stock_orders = action.payload;
    },
    addStock_OrdersLocal: (state, action: PayloadAction<any[]>) => {
      state.stock_orders_changes = action.payload;
    },
  },
});

export const {
  loadInventoryData,
  updateLocalInventory_Changes,
  updateLocalInventory_ChangeLogs,
  addStock_Orders,
  addStock_OrdersLocal,
} = InventorySlice.actions;

export default InventorySlice.reducer;
