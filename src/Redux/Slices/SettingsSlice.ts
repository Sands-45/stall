import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//Get Theme From Local Storage ==============
const selectedCurrrenyInitialState =
window.localStorage.getItem("selectedCurrency");
const currenciesInitialState = window.localStorage.getItem("currencies");

interface InitialStateType {
    currencies: any[];
    selectedCurrency: any;
}

const initialState: InitialStateType = {
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
    setCurrency:(state,action: PayloadAction<any[]>) => {
        state.selectedCurrency = action.payload
    }
  },
});

export const {
    loadCurrencies,setCurrency
} = SettingsSlice.actions;

export default SettingsSlice.reducer;
