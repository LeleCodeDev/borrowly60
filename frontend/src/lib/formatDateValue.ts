export const formatDateValue = (date?: string | null) => {
  if (!date) return null;
  return date.split("T")[0];
};
