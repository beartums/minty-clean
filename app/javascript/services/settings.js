import * as lss from './localSettingsService';
import Period from '../models/Period';

const SETTINGS = {
  IGNORE_BEFORE: '2019-08-01T00:00:00',
  periodRangeType: 'M',
  periodRangeLength: 1,
  periodsToShow: 3,
};

export default SETTINGS;

const DEFAULTS = {
  periods_first_period: new Period(new Date(2019, 7, 6), 0, 'M', 1),
  periods_range_type: 'M',
  periods_range_length: 1,

  display_period_count: 3,
  display_period_first_period: new Period(new Date(2019, 7, 6), 0, 'M', 1),

  transaction_ignore_before: '2019-08-06',
  transaction_respect_ignore_before: false,
};

export const KEYS = {
  TRANSACTIONS: {
    IGNORE_BEFORE: 'transaction_ignore_before',
    RESPECT_IGNORE_BEFORE: 'transaction_respect_ignore_before',
  },
  PERIODS: {
    FIRST_PERIOD: 'periods_first_period',
    RANGE_TYPE: 'periods_range_type',
    RANGE_LENGTH: 'periods_range_length',
  },
  DISPLAY: {
    PERIOD_COUNT: 'display_period_count',
    FIRST_PERIOD: 'display_period_first_period',
  },
  GROUPS: {
    TO_SUM: 'groups_to_sum',
  },
  TOKENS: {
    AUTH: 'auth_token',
    REFRESH: 'refresh_token',
  },
  USER: {
    USERNAME: 'username',
  },
};

export class Settings {
  static getAll = () => lss.getAll();

  static get = (key, deflt) => {
    deflt = deflt || DEFAULTS[key];
    return lss.get(key, deflt);
  }

  static set = (key, value) => lss.set(key, value);
}
