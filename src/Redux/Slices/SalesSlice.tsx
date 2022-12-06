import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const localParkedSales = localStorage.getItem("parked_sales");
const localSales = localStorage.getItem("completed_sales");

interface InitialStateType {
  parked_sales: any[];
  completed_sales: any[];
}

const initialState: InitialStateType = {
  parked_sales: localParkedSales ? JSON.parse(localParkedSales) : [],
  completed_sales: localSales ? JSON.parse(localSales) : [],
};

export const SalesSlices = createSlice({
  name: "Sales",
  initialState,
  reducers: {
    parkSales: (state, action: PayloadAction<any[]>) => {
      state.parked_sales = action.payload;
    },
    addSales: (state, action: PayloadAction<any[]>) => {
      state.completed_sales = action.payload;
    },
  },
});

export const { parkSales, addSales } = SalesSlices.actions;

export default SalesSlices.reducer;
