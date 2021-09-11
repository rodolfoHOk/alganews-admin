export default function formatToBrl(amount?: number) {
  return amount?.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
}
