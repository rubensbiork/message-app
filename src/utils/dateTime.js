import moment from 'moment';

const utcToLocaTime = (utcTime) => {
  if (!utcTime) {
    return '';
  }
  return moment
          .utc(utcTime)
          .local()
          .format('D-M-YYYY HH:mm');
};

export default utcToLocaTime;
