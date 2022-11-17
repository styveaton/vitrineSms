import { Cookies } from 'quasar';
import { api } from 'boot/axios';
import { boot } from 'quasar/wrappers';
// import jwt_decode from 'jwt-decode';

const refreshAuthenticated = async () => {
  await api
    .post('/api/token/refresh', {
      refreshToken: Cookies.get('refreshToken'),
    })
    .then((response) => {
      api.defaults.headers.common['Authorization'] =
        'Bearer ' + String(response.data.token);
      Cookies.set('token', String(response.data.token));
      Cookies.set('refreshToken', String(response.data.refreshToken));
      console.log(Cookies.get('refreshToken'));
      // decode = jwt_decode(String(response.data.token));
      //  Cookies.set('id', parseInt(String(this.decode.id)));
      //  console.log(jwt_decode(String(response.data.token)).id); // Cookies.set('decode', this.decode);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      // next()
    })
    .catch((e) => {
      console.log(e);
    });
};

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(refreshAuthenticated);
});

export { refreshAuthenticated };
