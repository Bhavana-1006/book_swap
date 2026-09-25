/**
 * Utility functions for Indian Rupee (₹) price and listing type formatting.
 */

export const formatPrice = (price, listingType) => {
  const type = (listingType || '').toUpperCase();
  if (type === 'DONATE') {
    return 'Free';
  }
  if (type === 'SWAP') {
    return 'Swap';
  }
  if (price === undefined || price === null || price === '' || isNaN(Number(price))) {
    return '₹0';
  }
  const num = Number(price);
  if (num === 0) {
    return 'Free';
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '' || isNaN(Number(amount))) {
    return '₹0';
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};
