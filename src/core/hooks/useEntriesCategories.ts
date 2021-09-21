import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CashFlow } from 'rodolfohiok-sdk';
import { AppDispatch, RootState } from '../store';
import * as CategoryActions from '../store/EntriesCategory.slice';

export default function useEntriesCategories() {
  const dispatch = useDispatch<AppDispatch>();

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

  const createCategory = useCallback(
    async (category: CashFlow.CategoryInput) => {
      await dispatch(CategoryActions.createCategory(category)).unwrap();
    },
    [dispatch]
  );

  const deleteCategory = useCallback(
    (categoryId: number) => {
      dispatch(CategoryActions.deleteCategory(categoryId)).unwrap();
    },
    [dispatch]
  );

  return {
    expenses,
    revenues,
    fetching,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
}
