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
    const { query } = (getState() as RootState).cashFlow.revenue;
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

export const setQuery = createAsyncThunk(
  'cash-flow/revenues/setQuery',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getRevenues());
  }
);

export const createRevenue = createAsyncThunk(
  'cash-flow/revenues/createRevenue',
  async (revenue: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(revenue);
      await dispatch(getRevenues());
    } catch (error) {
      //@ts-ignore
      return rejectWithValue({ ...error });
    }
  }
);

export const updateRevenue = createAsyncThunk(
  'cash-flow/revenues/updateRevenue',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);
      await dispatch(getRevenues());
    } catch (error) {
      //@ts-ignore
      return rejectWithValue({ ...error });
    }
  }
);

const revenueSlice = createSlice({
  initialState,
  name: 'cash-flow/revenues',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    storeQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
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
      createRevenue,
      updateRevenue,
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

export const { storeList, storeQuery, setSelectedRevenues, setFetching } =
  revenueSlice.actions;

const RevenueReducer = revenueSlice.reducer;
export default RevenueReducer;
