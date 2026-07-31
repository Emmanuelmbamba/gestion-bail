const generateContractNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9000) + 1000);
  return `CT-${year}${month}-${random}`;
};

const calculateDurationInMonths = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return months > 0 ? months : 0;
};

const getContractStatus = (startDate, endDate, referenceDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(referenceDate);

  if (current < start) return 'actif';
  if (current > end) return 'expire';
  return 'actif';
};

module.exports = {
  generateContractNumber,
  calculateDurationInMonths,
  getContractStatus
};
