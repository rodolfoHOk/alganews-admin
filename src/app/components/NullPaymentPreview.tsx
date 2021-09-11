import { Card, Row, Typography } from 'antd';
import taxImage from '../../assets/tax.svg';

export default function NullPaymentPreview() {
  return (
    <Card>
      <Row justify="center">
        <img src={taxImage} alt="Payment" width={200} />
        <Typography.Title level={3}>
          Selecione um editor e um período
        </Typography.Title>
        <Typography.Text style={{ textAlign: 'center' }}>
          Para podermos gerar uma prévia do pagamento, por favor, selecione e
          preencha os campos "Editor" e "Período"
        </Typography.Text>
      </Row>
    </Card>
  );
}
