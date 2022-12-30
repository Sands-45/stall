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
const stock_orders_date = localStorage.getItem("stock_orders_date")
const vendorsLocal = localStorage.getItem("vendors");

interface InitialStateType {
  inventory_data: any[];
  inventory_changes_data: any[];
  inventory_changelog_data: any[];
  stock_orders: any[];
  vendors: any[];
  stock_orders_date: any;
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
    vendors: vendorsLocal
    ? JSON.parse(vendorsLocal)
    : [],
    stock_orders_date:stock_orders_date
    ? JSON.parse(stock_orders_date)
    : { start: new Date().getTime() - 86400000, end: new Date().getTime() },
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
    addVendors: (state, action: PayloadAction<any[]>) => {
      state.vendors = action.payload;
    },
    changeStockOrder: (state, action: PayloadAction<any>) => {
      state.stock_orders_date = action.payload;
    }
  },
});

export const {
  loadInventoryData,
  updateLocalInventory_Changes,
  updateLocalInventory_ChangeLogs,
  addStock_Orders,
  addVendors,changeStockOrder
} = InventorySlice.actions;

export default InventorySlice.reducer;
