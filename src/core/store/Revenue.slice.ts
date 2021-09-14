import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'antd/lib/table/interface';
import moment from 'moment';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import { RootState } from '../store';
import getThunkStatus from '../utils/getThunkStatus';

interface RevenueState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const initialState: RevenueState = {
  list: [],
  fetching: false,
  query: {
    type: 'REVENUE',
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getRevenues = createAsyncThunk(
  'cash-flow/revenues/getRevenues',
  async (_, { getState, dispatch }) => {
    const { query } = (getState() as RootState).revenue;
    const revenues = await CashFlowService.getAllEntries(query);
    await dispatch(storeList(revenues));
  }
);

export const deleteEntriesInBatch = createAsyncThunk(
  'cash-flow/revenues/deleteEntriesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getRevenues());
  }
);

const revenueSlice = createSlice({
  initialState,
  name: 'cash-flow/revenues',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    setQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    setSelectedRevenues(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getRevenues,
      deleteEntriesInBatch,
    ]);
    builder
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      });
  },
});

export const { storeList, setQuery, setSelectedRevenues, setFetching } =
  revenueSlice.actions;

const RevenueReducer = revenueSlice.reducer;
export default RevenueReducer;
