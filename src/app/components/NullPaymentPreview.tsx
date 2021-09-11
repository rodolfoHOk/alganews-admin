import { Card, Row, Typography } from 'antd';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';
import taxImage from '../../assets/tax.svg';
import confusingImage from '../../assets/confusing.svg';

interface NullPaymentPreviewProps {
  error?: CustomError;
}

export default function NullPaymentPreview(props: NullPaymentPreviewProps) {
  return (
    <Card>
      <Row justify="center" style={{ textAlign: 'center' }}>
        <img
          key={props.error ? 'errorImg' : 'img'}
          src={props.error ? confusingImage : taxImage}
          alt="Payment Preview"
          width={240}
        />
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
