import {
  createAsyncThunk,
  createReducer,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
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

export const getAllUsers = createAsyncThunk('/user/getAllUsers', async () =>
  UserService.getAllUsers()
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
    })
    .addMatcher(loading, (state) => {
      state.fetching = true;
    });
});
