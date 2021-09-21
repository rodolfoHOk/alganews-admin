import { Descriptions, Skeleton } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import formatToBrl from '../../core/utils/formatToBrl';

interface EntryDetailsProps {
  entryId: number;
}

export default function EntryDetails({ entryId }: EntryDetailsProps) {
  const [entry, setEntry] = useState<CashFlow.EntryDetailed>();
  const [loading, setLoading] = useState(false);

  const fetchEntry = useCallback(async (entryId: number) => {
    setLoading(true);
    CashFlowService.getExistingEntry(entryId)
      .then(setEntry)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEntry(entryId);
  }, [fetchEntry, entryId]);

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Descrição">
        {entry?.description}
      </Descriptions.Item>
      <Descriptions.Item label="Categoria">
        {entry?.category.name}
      </Descriptions.Item>
      <Descriptions.Item label="Data de entrada">
        {moment(entry?.transactedOn).format('DD/MM/YYYY')}
      </Descriptions.Item>
      <Descriptions.Item label="Valor">
        {formatToBrl(entry?.amount)}
      </Descriptions.Item>
      <Descriptions.Item label="Criado em">
        {moment(entry?.createdAt).format('DD/MM/YYYY')}
      </Descriptions.Item>
    </Descriptions>
  );
}
