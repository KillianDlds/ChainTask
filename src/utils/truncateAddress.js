export const truncateAddress = (address) => {
  if (!address) return "";
  const start = address.slice(0, 6); // 0x + 4 premiers caractères
  const end = address.slice(-4);    // 4 derniers caractères
  return `${start}...${end}`;
};