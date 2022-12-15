import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const localParkedSales = localStorage.getItem("parked_sales");
const localSales = localStorage.getItem("completed_sales");
const localTransactions_Archieve = localStorage.getItem("transactions_archieve");
const cash_float = localStorage.getItem("cash_float");

interface InitialStateType {
  parked_sales: any[];
  completed_sales: any[];
  transactions_archieve: any[];
  cash_float:any[];
}

const initialState: InitialStateType = {
  parked_sales: localParkedSales ? JSON.parse(localParkedSales) : [],
  completed_sales: localSales ? JSON.parse(localSales) : [],
  transactions_archieve: localTransactions_Archieve ? JSON.parse(localTransactions_Archieve) : [],
  cash_float: cash_float ? JSON.parse(cash_float) : [],
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
    archieveSale: (state, action: PayloadAction<any[]>) => {
      state.transactions_archieve = action.payload;
    },
    updateFloat:(state,action:PayloadAction<any[]>)=>{
      state.cash_float = action.payload
    }
  },
});

export const { parkSales, addSales,archieveSale,updateFloat} = SalesSlices.actions;

export default SalesSlices.reducer;
