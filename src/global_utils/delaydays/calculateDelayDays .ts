export const calculateDelayDays = (dueDate?: Date | null): number => {
  if (!dueDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diff = today.getTime() - due.getTime();

  return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
};
