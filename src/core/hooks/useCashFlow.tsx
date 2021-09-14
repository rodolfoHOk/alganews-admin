import { useCallback, useState } from 'react';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import moment from 'moment';
import { Key } from 'antd/lib/table/interface';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

export default function useCashFlow(type: CashFlowEntryType) {
  const [entries, setEntries] = useState<CashFlow.EntrySummary[]>([]);
  const [query, setQuery] = useState<CashFlow.Query>({
    type,
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  });
  const [selected, setSelected] = useState<Key[]>([]);

  const [fetchingEntries, setFetchingEntries] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      setFetchingEntries(true);
      const newEntries = await CashFlowService.getAllEntries(query);
      setEntries(newEntries);
    } finally {
      setFetchingEntries(false);
    }
  }, [query]);

  return {
    entries,
    query,
    selected,
    fetchingEntries,
    fetchEntries,
    setQuery,
    setSelected,
  };
}
