import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import * as CategoryActions from '../store/EntriesCategory.slice';

export default function useEntriesCategories() {
  const dispatch = useDispatch();

  const expenses = useSelector(
    (state: RootState) => state.cashFlow.category.expenses
  );
  const revenues = useSelector(
    (state: RootState) => state.cashFlow.category.revenues
  );
  const fetching = useSelector(
    (state: RootState) => state.cashFlow.category.fetching
  );

  const fetchCategories = useCallback(() => {
    dispatch(CategoryActions.getCategories());
  }, [dispatch]);

  return {
    expenses,
    revenues,
    fetching,
    fetchCategories,
  };
}
