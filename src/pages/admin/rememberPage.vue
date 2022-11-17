<!-- eslint-disable @typescript-eslint/no-unsafe-call -->
/* eslint-disable prettier/prettier */
<template>
  <center class="mt-7">
    <div class="vertical-middle">
      <div
        class="col-xl-4 col-lg-6 col-sm-12 col-md-6 absolute-center d-flex flex-column mx-lg-0 mt-3"
      >
        <div class="card card-plain w-100 align-middle">
          <div class="pb-0 card-header text-start">
            <h4 class="mb-0">Êtes vous {{ nom }} ?</h4>
            <h7> Veuillez confirmer en renseignant votre mot de passe</h7>
          </div>
          <div class="card-body">
            <form role="form">
              <div class="mb-3">
                <div class="form-group">
                  <input
                    class="form-control"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    name="password"
                  />
                </div>
              </div>

              <div class="row ps-2 pe-2">
                <q-btn
                  class="bg-danger w-50 mt-4"
                  variant="gradient" 
                  @click="loggout"
                  >Non, c'est pas moi
                </q-btn>
                <q-btn
                  class="bg-success w-50 mt-4"
                  variant="gradient"
                  :loading="loading"
                  @click="onSubmit"
                  color="success"
                  >Sign in
                </q-btn>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </center>
</template>

<script>
import { ref } from 'vue';
import { useMeta } from 'quasar';
import { api } from 'boot/axios';
import jwt_decode from 'jwt-decode';
import { Cookies } from 'quasar';
const metaData = {
  // sets document title
  title: 'Rememer page',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => String(title),
  // meta tags
  /*meta: {
    description: { name: 'description', content: 'Page 1' },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle:  {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template (ogTitle) {
        return `${ogTitle} - My Website`
      }
    }
  },*/
  // CSS tags
  link: {
    bootstrap1: {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
    },
    bootstrap2: {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    },
  },
  // JS tags
  script: {
    counterup1: {
      src: '"https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"',
    },
    counterup2: {
      src: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js',
    },
    EditJs2: {
      src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js',
    },
  },
  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};

export default {
  name: 'remember-page',

  data() {
    return {
      password: '',
      loading: false,
      isPwd: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: [],
      decode: [],
      token: '',
      remember: false,
    };
  },
  setup() {
    useMeta(metaData);
    let nom = ref('');
    nom.value = Cookies.get('nom');

    return { nom };
  },
  methods: {
    async onSubmit() {
      console.log('**************', Cookies.get('to')); // Cookies.set('decode', this.decode);
 this.loading = !this.loading;
      await api
        .post('/api/auth', {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          phone: Cookies.get('phone'),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          password: this.password.toString(),
        })
        .then((response) => {
         
          console.log('keyse**', String(this.decode.keySecret));
          api.defaults.headers.common['Authorization'] =
            'Bearer ' + String(response.data.token);
          Cookies.set('token', String(response.data.token));
          Cookies.set('refreshToken', String(response.data.refreshToken));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.decode = jwt_decode(String(response.data.token));
          Cookies.set('nom', String(this.decode.nom));
          Cookies.set('prenom', String(this.decode.prenom));
          Cookies.set('phone', String(this.decode.phone));
          Cookies.set('id', parseInt(String(this.decode.id)));
          Cookies.set('keySecret', String(this.decode.keySecret));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          console.log(this.decode.roles[1] == 'ROLE_ADMIN');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          if (this.decode.roles[1] == 'ROLE_ADMIN') {
            Cookies.set('admin', '1');
          } else {
            Cookies.set('admin', '0');
          }
          let aujourdhui = new Date();
          Cookies.set(
            'date',
            aujourdhui.toLocaleString().split(',')[0].split('/')[0]
          );
          if (Cookies.get('to').length != 0) {
            console.log('toocccooooooooooo', Cookies.get('to')); // Cookies.set('decode', this.decode);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-call
            this.$router.replace({ name: Cookies.get('to') });
          }
          else {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-call
            this.$router.replace({ name: 'Admin' });

          }
          console.log(Cookies.get('id'));
        })
        .catch(() => {
          this.loading = !this.loading;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message:
              "Erreur d'authentification veuillez verifiez votre mot de passe",
            icon: 'report_problem',
          });
        });
    },
    async loggout() {
      api.defaults.headers.common['Authorization'] = null;
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.set('token', 'undefined');
      Cookies.set('refreshToken', 'undefined');
      Cookies.remove('id');
      Cookies.remove('admin');
      // Cookies.remove('theme');
      console.log('iiiiiiiiiiiiiii', Cookies.get('admin'));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.$router.push({ name: 'Home' });
    },
  },
};
</script>
