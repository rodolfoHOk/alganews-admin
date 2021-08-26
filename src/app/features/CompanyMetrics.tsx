import { Line } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { MetricService } from 'rodolfohiok-sdk';
import transformDataIntoAntdChart from '../../core/utils/transformDataIntoAntdChart';

export default function CompanyMetrics() {
  const [data, setData] = useState<
    {
      yearMonth: string;
      value: number;
      category: 'totalRevenues' | 'totalExpenses';
    }[]
  >([]);

  useEffect(() => {
    MetricService.getMonthlyRevenuesExpenses('2021-08')
      .then(transformDataIntoAntdChart)
      .then(setData);
  }, []);

  const config = {
    data,
    height: 400,
    xField: 'yearMonth',
    yField: 'value',
    seriesField: 'category',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return <Line {...config} />;
}
