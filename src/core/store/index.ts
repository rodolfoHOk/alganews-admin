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

const observeActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    notification.error({
      message: action.error.message,
    });
  }

  next(action);
};

const cashFlowReducer = combineReducers({
  expense: ExpenseReducer,
  revenue: RevenueReducer,
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
