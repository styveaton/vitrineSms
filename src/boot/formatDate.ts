/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */

// import { boot } from 'quasar/wrappers';
// import jwt_decode from 'jwt-decode';

const formatDate = function (date: Date) {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();
  const heure = ' ' + date.getHours();
  const minutes = date.getMinutes();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('-') + [heure, minutes].join(':');
};

// export default boot(({ app }) => {
//   // Set i18n instance on app
//   app.use(formatDate);
// });

export { formatDate };
