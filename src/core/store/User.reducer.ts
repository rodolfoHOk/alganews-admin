import {
  createAsyncThunk,
  createReducer,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { notification } from 'antd';
import { User, UserService } from 'rodolfohiok-sdk';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';

interface UserState {
  list: User.Summary[];
  fetching: boolean;
}

const initialState: UserState = {
  list: [],
  fetching: false,
};

export const getAllUsers = createAsyncThunk(
  '/user/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await UserService.getAllUsers();
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  '/user/toggleUserStatus',
  async (user: User.Summary | User.Detailed) => {
    user.active
      ? await UserService.deactivateExistingUser(user.id)
      : await UserService.activateExistingUser(user.id);

    return user;
  }
);

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getAllUsers, toggleUserStatus);
  const error = isRejected(getAllUsers, toggleUserStatus);
  const loading = isPending(getAllUsers, toggleUserStatus);

  builder
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    })
    .addMatcher(success, (state) => {
      state.fetching = false;
    })
    .addMatcher(error, (state, action: PayloadAction<CustomError>) => {
      state.fetching = false;
      notification.error({
        message: action.payload.data?.userMessage,
        description: action.payload.data?.detail,
      });
    })
    .addMatcher(loading, (state) => {
      state.fetching = true;
    });
});
