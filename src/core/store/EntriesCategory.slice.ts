import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import getThunkStatus from '../utils/getThunkStatus';

interface EntriesCategoryState {
  fetching: boolean;
  expenses: CashFlow.CategorySummary[];
  revenues: CashFlow.CategorySummary[];
}

const initialState: EntriesCategoryState = {
  fetching: false,
  expenses: [],
  revenues: [],
};

export const getCategories = createAsyncThunk(
  'cash-flow/categories/getCategories',
  async (_, { dispatch }) => {
    const categories = await CashFlowService.getAllCategories({
      sort: ['id', 'desc'],
    });

    /**
     * utilizando filtro local porque a API não prove uma form de recuperar as
     * categorias separadamente por tipo
     * @todo: melhorar isso assim que a API prover um endpoint
     */
    const expensesCategories = categories.filter(
      (category) => category.type === 'EXPENSE'
    );
    const revenuesCategories = categories.filter(
      (category) => category.type === 'REVENUE'
    );

    await dispatch(storeExpenses(expensesCategories));
    await dispatch(storeRevenues(revenuesCategories));
  }
);

export const createCategory = createAsyncThunk(
  'cash-flow/categories/createCategory',
  async (category: CashFlow.CategoryInput, { dispatch }) => {
    await CashFlowService.insertNewCategory(category);
    await dispatch(getCategories());
  }
);

const entriesCategorySlice = createSlice({
  initialState,
  name: 'cash-flow/categories',
  reducers: {
    storeExpenses(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.expenses = action.payload;
    },
    storeRevenues(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.revenues = action.payload;
    },
    storeFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getCategories,
      createCategory,
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

export const { storeExpenses, storeRevenues, storeFetching } =
  entriesCategorySlice.actions;

const entriesCategoryReducer = entriesCategorySlice.reducer;
export default entriesCategoryReducer;
