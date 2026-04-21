export const formatDate = (date: string, long = false) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: long ? "long" : "short",
    year: "numeric",
  });
