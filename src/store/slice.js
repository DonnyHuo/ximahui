import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  stakingContractAddress: "0xa455eC378b07B734BAdAC122824b2e98f8E7c126",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  adminAddress: [
    "0x2a32b1623a7f6431697f7d7643d629aa41db5181",
    "0xa744118af77e66a193601ea1456d7afb27dc7b5c",
    "0x5f8406AaBCD255Bc1A6047DAE400d0ad108C462b",
    "0x1797b93c52C3BC8b614f2c9f9B07BF8cbfc2ef6D",
    "0x379E200099dB27D7D401680bAD81347754f9629f"
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
