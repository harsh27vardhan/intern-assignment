import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  stocks: [],
  durations: [],
  graphData: [],
  loading: false,
  error: null,
};

export const fetchStocks = createAsyncThunk("stocks/fetchStocks", async () => {
  const response = await axios.get("http://localhost:3000/api/stocks");
  return response.data;
});

export const fetchGraphData = createAsyncThunk(
  "stocks/fetchGraphData",
  async ({ selectedStock, duration }) => {
    let allEntries = [];
    let page = 1;

    // while (true) {
    const response = await axios.post(
      `http://localhost:3000/api/stocks/${selectedStock}?page=${page}`,
      {
        duration,
      }
    );
    allEntries = [...allEntries, ...response.data.data];
    // console.log(response.data.data);
    sessionStorage.setItem("data", JSON.stringify(response.data.data));

    //   if (response.data.entries.length === 0) break;
    //   page++;
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    // }

    return allEntries;
  }
);

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setDurations(state, action) {
      state.durations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.loading = false;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchGraphData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        state.graphData = action.payload;
        state.loading = false;
      })
      .addCase(fetchGraphData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { setDurations } = stocksSlice.actions;

export default stocksSlice.reducer;
