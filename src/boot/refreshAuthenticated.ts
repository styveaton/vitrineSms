import { Cookies } from 'quasar';
import { api } from 'boot/axios';
import { boot } from 'quasar/wrappers';
import jwt_decode from 'jwt-decode';

const refreshAuthenticated = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decode: {
    nom: string;
    prenom: string;
    phone: string;
    id: number;
    roles: any;
  } = {
    nom: '',
    prenom: '',
    phone: '',
    id: 0,
    roles: [],
  };
  if (
    Cookies.get('refreshToken') != undefined &&
    Cookies.get('refreshToken') != 'undefined'
  ) {
    await api
      .post('/api/token/refresh', {
        refreshToken: Cookies.get('refreshToken'),
      })
      .then((response) => {
        console.log('nous effectuons le refresh token', response.data);
        api.defaults.headers.common['Authorization'] =
          'Bearer ' + String(response.data.token);
        Cookies.set('token', String(response.data.token));
        Cookies.set('refreshToken', String(response.data.refreshToken));
        decode = jwt_decode(String(response.data.token));
        Cookies.set('nom', String(decode.nom));
        Cookies.set('prenom', String(decode.prenom));
        Cookies.set('phone', String(decode.phone));
        Cookies.set('id', String(decode.id));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        console.log(decode.roles[1] == 'ROLE_ADMIN');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (decode.roles[1] == 'ROLE_ADMIN') {
          Cookies.set('admin', '1');
        } else {
          Cookies.set('admin', '0');
        }

        console.log(Cookies.get('admin')); // Cookies.set('decode', this.decode);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises

        console.log(Cookies.get('id'));
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(refreshAuthenticated);
});

export { refreshAuthenticated };
