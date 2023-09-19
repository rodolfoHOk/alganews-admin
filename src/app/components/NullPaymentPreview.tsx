import { Card, Row, Typography } from 'antd';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';
import { ConfusingSVG } from './ConfusingSVG';
import { TaxSVG } from './TaxSVG';

interface NullPaymentPreviewProps {
  error?: CustomError;
}

export default function NullPaymentPreview(props: NullPaymentPreviewProps) {
  return (
    <Card>
      <Row justify="center" style={{ textAlign: 'center' }}>
        {props.error ? <ConfusingSVG /> : <TaxSVG />}

        <Typography.Title level={4} style={{ maxWidth: 360 }}>
          {props.error
            ? props.error.message
            : 'Selecione um editor e um período'}
        </Typography.Title>
        <Typography.Text>
          Para podermos gerar uma prévia do pagamento, por favor, selecione e
          preencha os campos "Editor" e "Período"
        </Typography.Text>
      </Row>
    </Card>
  );
}
