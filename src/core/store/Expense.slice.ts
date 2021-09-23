import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'antd/lib/table/interface';
import moment from 'moment';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import { RootState } from '../store';
import getThunkStatus from '../utils/getThunkStatus';

interface ExpenseState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const params = new URLSearchParams(window.location.search);
const yearMonth = params.get('yearMonth');

const initialState: ExpenseState = {
  list: [],
  fetching: false,
  query: {
    type: 'EXPENSE',
    sort: ['transactedOn', 'desc'],
    yearMonth: yearMonth || moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getExpenses = createAsyncThunk(
  'cash-flow/expenses/getExpenses',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { query } = (getState() as RootState).cashFlow.expense;
      const expenses = await CashFlowService.getAllEntries(query);
      await dispatch(storeList(expenses));
    } catch (err) {
      //@ts-ignore
      return rejectWithValue({ ...err });
    }
  }
);

export const deleteEntriesInBatch = createAsyncThunk(
  'cash-flow/expenses/deleteEntriesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getExpenses());
  }
);

export const setQuery = createAsyncThunk(
  'cash-flow/expenses/setQuery',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getExpenses());
  }
);

export const createExpense = createAsyncThunk(
  'cash-flow/expenses/createExpense',
  async (expense: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(expense);
      await dispatch(getExpenses());
    } catch (error) {
      //@ts-ignore
      return rejectWithValue({ ...error });
    }
  }
);

export const updateExpense = createAsyncThunk(
  'cash-flow/expenses/updateExpense',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);
      await dispatch(getExpenses());
    } catch (error) {
      //@ts-ignore
      return rejectWithValue({ ...error });
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'cash-flow/expenses/deleteExpense',
  async (expenseId: number, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.removeExistingEntry(expenseId);
      await dispatch(getExpenses());
    } catch (err) {
      //@ts-ignore
      return rejectWithValue({ ...err });
    }
  }
);

const expenseSlice = createSlice({
  initialState,
  name: 'cash-flow/expenses',
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
    setSelectedExpenses(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getExpenses,
      deleteEntriesInBatch,
      createExpense,
      updateExpense,
      deleteExpense,
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

export const { storeList, storeQuery, setSelectedExpenses, setFetching } =
  expenseSlice.actions;

const ExpenseReducer = expenseSlice.reducer;
export default ExpenseReducer;
