import { Area, AreaConfig } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { MetricService } from 'rodolfohiok-sdk';
import transformDataIntoAntdChart from '../../core/utils/transformDataIntoAntdChart';
import { format } from 'date-fns';

export default function CompanyMetrics() {
  const [data, setData] = useState<
    {
      yearMonth: string;
      value: number;
      category: 'totalRevenues' | 'totalExpenses';
    }[]
  >([]);

  useEffect(() => {
    MetricService.getMonthlyRevenuesExpenses('')
      .then(transformDataIntoAntdChart)
      .then(setData);
  }, []);

  const config: AreaConfig = {
    data,
    height: 400,
    color: ['#0099FF', '#274060'],
    areaStyle: { fillOpacity: 1 },
    xField: 'yearMonth',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
      label: {
        formatter(item) {
          return format(new Date(item), 'MM/yyyy');
        },
      },
    },
    legend: {
      itemName: {
        formatter(legend) {
          return legend === 'totalRevenues' ? 'Receitas' : 'Despesas';
        },
      },
    },
    point: {
      size: 5,
      shape: 'circle',
    },
  };

  return <Area {...config} />;
}
