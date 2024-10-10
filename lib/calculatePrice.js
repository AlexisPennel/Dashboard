export const calculateFinalPrice = (price, discount) => {
  if (!price || !discount) return price;
  const discountValue = (price * Math.abs(discount)) / 100;
  return discount < 0 ? price - discountValue : price;
};
