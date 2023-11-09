import { Area, AreaConfig } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { MetricService } from 'rodolfohiok-sdk';
import transformDataIntoAntdChart from '../../core/utils/transformDataIntoAntdChart';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { ForbiddenError } from 'rodolfohiok-sdk/dist/errors';
import Forbidden from '../components/Forbidden';
import { parseISO } from 'date-fns';

export default function CompanyMetrics() {
  const [data, setData] = useState<
    {
      yearMonth: string;
      value: number;
      category: 'totalRevenues' | 'totalExpenses';
    }[]
  >([]);

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    MetricService.getMonthlyRevenuesExpenses('')
      .then(transformDataIntoAntdChart)
      .then(setData)
      .catch((error) => {
        if (error instanceof ForbiddenError) {
          setForbidden(true);
          return;
        }
        throw error;
      });
  }, []);

  if (forbidden) return <Forbidden minHeight={256} />;

  const config: AreaConfig = {
    data,
    height: 256,
    color: ['#0099FF', '#274060'],
    areaStyle: { fillOpacity: 1 },
    xField: 'yearMonth',
    yField: 'value',
    seriesField: 'category',
    tooltip: {
      title(title) {
        return format(parseISO(title), 'MMMM yyyy', { locale: ptBR });
      },
      formatter(data) {
        return {
          name: data.category === 'totalRevenues' ? 'Receitas' : 'Despesas',
          value: (data.value as number).toLocaleString('pt-BR', {
            currency: 'BRL',
            style: 'currency',
            maximumFractionDigits: 2,
          }),
        };
      },
    },
    xAxis: {
      label: {
        formatter(item) {
          return format(parseISO(item), 'MM/yyyy');
        },
      },
    },
    yAxis: false,
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
