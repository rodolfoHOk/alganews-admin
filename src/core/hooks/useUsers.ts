import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'rodolfohiok-sdk';
import { AppDispatch, RootState } from '../store';
import * as UserActions from '../store/User.reducer';

export default function useUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list);
  const editors = useSelector((state: RootState) =>
    state.user.list.filter((user) => {
      return user.role === 'EDITOR';
    })
  );
  const fetching = useSelector((state: RootState) => state.user.fetching);

  const fetchUsers = useCallback(() => {
    return dispatch(UserActions.getAllUsers()).unwrap();
  }, [dispatch]);

  const toggleUserStatus = useCallback(
    async (user: User.Summary | User.Detailed) => {
      await dispatch(UserActions.toggleUserStatus(user));
      dispatch(UserActions.getAllUsers());
    },
    [dispatch]
  );

  return {
    users,
    editors,
    fetching,
    fetchUsers,
    toggleUserStatus,
  };
}
