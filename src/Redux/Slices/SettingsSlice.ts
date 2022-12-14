import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const selectedCurrrenyInitialState =
  window.localStorage.getItem("selectedCurrency");
const currenciesInitialState = window.localStorage.getItem("currencies");
const atLocal = window.localStorage.getItem("atLocal");

interface InitialStateType {
  currencies: any[];
  selectedCurrency: any;
  local_ref: string;
}

const initialState: InitialStateType = {
  local_ref: atLocal ? JSON.parse(atLocal) : "58595859",
  currencies: currenciesInitialState
    ? JSON.parse(currenciesInitialState)
    : [
        { name: "usd", symbol: "$", rate_multiplier: 1 },
        { name: "zar", symbol: "R", rate_multiplier: 17.09 },
      ],
  selectedCurrency: selectedCurrrenyInitialState
    ? JSON.parse(selectedCurrrenyInitialState)
    : {
        name: "usd",
        symbol: "$",
        rate_multiplier: 1,
      },
};

export const SettingsSlice = createSlice({
  name: "SettingsData",
  initialState,
  reducers: {
    loadCurrencies: (state, action: PayloadAction<any[]>) => {
      state.currencies = action.payload;
    },
    setCurrency: (state, action: PayloadAction<any[]>) => {
      state.selectedCurrency = action.payload;
    },
    updateLocalRef: (state, action: PayloadAction<string>) => {
      state.local_ref = action.payload;
    },
  },
});

export const { loadCurrencies, setCurrency, updateLocalRef } =
  SettingsSlice.actions;

export default SettingsSlice.reducer;
