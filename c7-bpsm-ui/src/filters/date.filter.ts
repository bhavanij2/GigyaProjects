import moment from 'moment';
import { EPOCH } from '@/utils/constants';

const date = (value: string) => {
  if (!value || value === EPOCH) {
    return 'Never';
  }
  return moment(value).fromNow();
};

export default date;
