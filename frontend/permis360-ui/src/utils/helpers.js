// Small functional helpers shared across the app.

export const makeId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const addDays = (isoDate, days) => {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const formatDate = (isoDate) => {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (isoDate, time) => `${formatDate(isoDate)}${time ? ` · ${time}` : ''}`;

export const formatMAD = (amount) =>
  `${Number(amount || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} MAD`;

export const isPast = (isoDate, time = '23:59') => {
  if (!isoDate) return false;
  return new Date(`${isoDate}T${time}`).getTime() < Date.now();
};

export const hoursUntil = (isoDate, time = '00:00') => {
  if (!isoDate) return Infinity;
  const target = new Date(`${isoDate}T${time}`).getTime();
  return (target - Date.now()) / (1000 * 60 * 60);
};

export const calcAge = (isoDob) => {
  if (!isoDob) return null;
  const dob = new Date(isoDob);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
};

export const MIN_AGE_BY_CATEGORY = {
  A1: 16,
  A: 18,
  B: 18,
  C: 21,
  D: 24,
  EB: 18,
};

export const PERMIT_CATEGORIES = ['A1', 'A', 'B', 'C', 'D', 'EB'];
