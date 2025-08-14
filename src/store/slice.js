import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  stakingContractAddress: "0x068D9AF31E43A2dF5d54BCa12ceba14BbC83adf3",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  stakingContractAddressV2: "0xc521983923625E14D0a45a7cDeA9C384fA1DEF13",
  stakingContractAddressV3: "0xf465B506B0535eFAfb2136347EBDf83463b9ad99",
  version: 3,
  adminAddress: [
    "0x2a32b1623a7f6431697f7d7643d629aa41db5181",
    "0xa744118af77e66a193601ea1456d7afb27dc7b5c",
    "0x5f8406AaBCD255Bc1A6047DAE400d0ad108C462b",
    "0x1797b93c52C3BC8b614f2c9f9B07BF8cbfc2ef6D"
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
