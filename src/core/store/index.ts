import {
  combineReducers,
  configureStore,
  isRejected,
  Middleware,
} from '@reduxjs/toolkit';
import { notification } from 'antd';
import PaymentReducer from './Payment.slice';
import UserReducer from './User.reducer';
import ExpenseReducer from './Expense.slice';
import RevenueReducer from './Revenue.slice';
import entriesCategoryReducer from './EntriesCategory.slice';

const observeActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const ignoredActions = [
      'cash-flow/categories/createCategory/rejected',
      'cash-flow/categories/deleteCategory/rejected',
      'cash-flow/expenses/createExpense/rejected',
      'cash-flow/revenues/createRevenue/rejected',
      'cash-flow/expenses/updateExpense/rejected',
      'cash-flow/revenues/updateRevenue/rejected',
      '/user/getAllUsers/rejected',
      'payment/getAllPayments/rejected',
      'cash-flow/categories/getCategories/rejected',
      'cash-flow/expenses/getExpenses/rejected',
      'cash-flow/revenues/getRevenues/rejected',
    ];

    const shouldNotify = !ignoredActions.includes(action.type);

    if (shouldNotify) {
      notification.error({
        message: action.error.message,
      });
    }
  }

  next(action);
};

const cashFlowReducer = combineReducers({
  expense: ExpenseReducer,
  revenue: RevenueReducer,
  category: entriesCategoryReducer,
});

export const store = configureStore({
  reducer: {
    user: UserReducer,
    payment: PaymentReducer,
    cashFlow: cashFlowReducer,
  },
  middleware: function (getDefaultMiddlewares) {
    return getDefaultMiddlewares().concat(observeActions);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
