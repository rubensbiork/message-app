import utcToLocaTime from './dateTime';
import moment from 'moment';
import deepFreeze from 'deep-freeze';

describe('utils/dateTime', () => {
  it('Should apply local timezone and format as (D-M-YYYY HH:MM)', () => {

    const time = moment('2017-07-22T18:05:26Z').utc().format();
    deepFreeze(time);

    expect(
      utcToLocaTime(time)
    ).toBe('22-7-2017 20:05');
  });

  it('Should handle null', () => {
    expect(
      utcToLocaTime(null)
    ).toBe('');
  });

  it('Should handle empty', () => {
    expect(
      utcToLocaTime('')
    ).toBe('');
  });
});
