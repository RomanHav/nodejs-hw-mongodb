export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_MONTH = 24 * 60 * 60 * 1000 * 30;

export const SMTP = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
};
