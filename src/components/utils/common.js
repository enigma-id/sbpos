import moment from 'moment';

export const currencyFormat = (value, usingText = true) => {
  let txt = usingText ? 'Rp ' : '';

  return `${txt}${new Intl.NumberFormat('de-DE').format(value)}`;
};

export const dateFormat = (date, format = 'DD/MM/YYYY HH:mm') => {
  if (!date) {
    return '-';
  }

  const fd = moment(date).isValid() ? moment(date).format(format) : '-';

  return fd;
};

const moneyList = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

export const cashList = total => {
  let res = [];

  moneyList.forEach(i => {
    if (i >= total) {
      res.push(i);
    } else {
      let roundup = Math.ceil(total / i) * i;
      if (roundup !== i && roundup !== total) {
        res.push(roundup);
      }
    }
  });

  return Array.from(new Set(res));
};
