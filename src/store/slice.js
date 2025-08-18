import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  stakingContractAddress: "0xa455eC378b07B734BAdAC122824b2e98f8E7c126",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  adminAddress: [
    "0x2a32b1623a7f6431697f7d7643d629aa41db5181",
    "0xee65B3d959942010575a09cA844282204415ffd6",
    "0xD09633B9ACBef204583Cc465ba6B4B6a12b5Ab25",
    "0x1bAE1Fb93DbA027FdFF15E410453534eF3b7dACB"
  ]
};

const slice = createSlice({
  name: "init",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setVersion: (state, action) => {
      state.version = action.payload;
    }
  }
});

export const { setAddress, setVersion } = slice.actions;

export default slice.reducer;
