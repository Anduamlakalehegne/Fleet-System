export const API_URL = import.meta.env.VITE_API_URL || 'https://myback.eifdda.org/api';

export const STATUS_OPTIONS = {
  ACTIVE: 'Active',
  MAINTENANCE: 'Maintenance',
  OUT_OF_SERVICE: 'Out of Service'
};

export const FILTER_OPTIONS = {
  ALL: 'All Statuses',
  ACTIVE: 'Active Only',
  MAINTENANCE: 'In Maintenance Only',
  OUT_OF_SERVICE: 'Out of Service Only'
};

