import { useCallback } from 'react';
import { CashFlow } from 'rodolfohiok-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import * as ExpenseActions from '../store/Expense.slice';
import * as RevenueActions from '../store/Revenue.slice';
import { Key } from 'antd/lib/table/interface';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

export default function useCashFlow(type: CashFlowEntryType) {
  const dispatch = useDispatch<AppDispatch>();

  const query = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.query
      : state.cashFlow.revenue.query
  );
  const entries = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.list
      : state.cashFlow.revenue.list
  );
  const selected = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.selected
      : state.cashFlow.revenue.selected
  );
  const fetching = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.fetching
      : state.cashFlow.revenue.fetching
  );

  const fetchEntries = useCallback(() => {
    return dispatch(
      type === 'EXPENSE'
        ? ExpenseActions.getExpenses()
        : RevenueActions.getRevenues()
    ).unwrap();
  }, [dispatch, type]);

  const removeEntriesInBatch = useCallback(
    async (entriesIds: number[]) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.deleteEntriesInBatch(entriesIds)
          : RevenueActions.deleteEntriesInBatch(entriesIds)
      );
    },
    [dispatch, type]
  );

  const setSelected = useCallback(
    async (keys: Key[]) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.setSelectedExpenses(keys)
          : RevenueActions.setSelectedRevenues(keys)
      );
    },
    [dispatch, type]
  );

  const setQuery = useCallback(
    async (query: Partial<CashFlow.Query>) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.setQuery(query)
          : RevenueActions.setQuery(query)
      );
    },
    [dispatch, type]
  );

  const createEntry = useCallback(
    async (entry: CashFlow.EntryInput) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.createExpense(entry)
          : RevenueActions.createRevenue(entry)
      ).unwrap();
    },
    [dispatch, type]
  );

  const updateEntry = useCallback(
    async (entryId: number, entry: CashFlow.EntryInput) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.updateExpense({ entryId, entry })
          : RevenueActions.updateRevenue({ entryId, entry })
      ).unwrap();
    },
    [dispatch, type]
  );

  const deleteEntry = useCallback(
    async (entryId: number) => {
      await dispatch(
        type === 'EXPENSE'
          ? ExpenseActions.deleteExpense(entryId)
          : RevenueActions.deleteRevenue(entryId)
      ).unwrap();
    },
    [dispatch, type]
  );

  return {
    entries,
    query,
    selected,
    fetching,
    fetchEntries,
    removeEntriesInBatch,
    setQuery,
    setSelected,
    createEntry,
    updateEntry,
    deleteEntry,
  };
}
