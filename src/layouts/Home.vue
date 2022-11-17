/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>

  <div class="page-header min-vh-100 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-xl-4 col-lg-5 col-sm-12 col-md-5 mx-lg-0 mt-5 pt-5">
          <div class="card card-plain w-100 h-100 center text-center">
            <div class="pb-0 card-header text-start">
              <h4 class="font-weight-bolder">Sign In</h4>
              <p class="mb-0">Enter your phone and password to sign in</p>
            </div>
            <div class="card-body">
              <form role="form">
                <div class="mb-3 mt-3">
                  <div class="form-group">
                    <input class="form-control" type="phone" v-model="number" placeholder="phone" name="phone"
                      size="lg" />
                  </div>
                </div>
                <div class="mb-3 ">
                  <div class="form-group">
                    <input class="form-control" type="password" placeholder="Password" v-model="password"
                      name="password" />
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" v-model="confiance" type="checkbox" />
                  <label class="form-check-labe l">
                    <slot />Faire Confiance a cette appareil
                  </label>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" v-model="remember" type="checkbox" />
                  <label class="form-check-label">
                    <slot />Remember me
                  </label>
                </div>

                <div class="text-center mb-4">
                  <a class="btn mb-0 bg-info bg-gradient btn-lg w-100 null mt-4" variant="gradient" :loading="loading"
                    @click="onSubmit" color="infos" fullWidth size="lg">Sign in
                    <slot />
                  </a>
                </div>
              </form>
            </div>
            <div class="px-1 pt-0 text-center border-top pb-4 px-lg-2">
              <p class="mx-auto mb-6 text-sm">
                Don't have an account?
                <a :href="siteU +'/inscription'" class="text-success text-gradient font-weight-bold">Sign up</a>
              </p>
            </div>
          </div>
        </div>
        <div round
          class="top-0 my-auto m-5 radius-inherit text-center col-xl-7 col-sm-12 col-lg-6 col-md-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
          <div
            class="radius bg position-relative h-100 m-2 px-7 border-radius-inherit bg-success p-2 text-dark bg-opacity-10 d-flex flex-column justify-content-center"
            style="
                background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg');
                background-size: cover;
              ">
            <span class="mask bg-gradient-success opacity-6"></span>
            <h4 class="mt-5 text-white font-weight-bolder position-relative">
              "Attention is the new currency"
            </h4>
            <p class="text-white position-relative">
              The more effortless the writing looks, the more effort the
              writer actually put into the process.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>
<style scoped>
.radius {
  border-radius: 10px 10px 10px 10px;
}

.bg {
  opacity: 0.8;
}

.mask {
  position: absolute;
  background-size: cover;
  background-position: center center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.bg-gradient-success {
  border-radius: 10px 10px 10px 10px;

  background-image: linear-gradient(310deg, #2dce89 0%, #2dcecc 100%);
}

/*
.bg::after {
  opacity: 0.3;

  background-color: rgb(59, 182, 182);
} */
</style>
<script>
import { defineComponent, ref } from 'vue';
import { useMeta } from 'quasar';
import { api } from 'boot/axios';
import jwt_decode from 'jwt-decode';
import { RequestApi } from 'boot/RequestApi';
import { Cookies } from 'quasar';
const metaData = {
  // sets document title
  title: 'Welcome to Smailling',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title) => String(title),
  // meta tags
  meta: {
    description: { name: 'description', content: 'Page 1' },
    keywords: { name: 'keywords', content: 'Quasar website' },
    equiv: {
      'http-equiv': 'Content-Type',
      content: 'text/html; charset=UTF-8',
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: 'og:title',
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${String(ogTitle)} - My Website`;
      },
    },
  },
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
export default defineComponent({
  name: 'Home',
  components: {},

  async beforeRouteEnter(to, from, next) {

    // if (to.name == 'Price') {
    //   next();
    // } if (to.name == 'Doc') {
    //   next();
    let urlFInal = ref('');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let url = window.location.href;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    url.split('.').forEach((el) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (el.includes('http://')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (el.includes('sms')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          urlFInal.value =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            el.split('http://')[1].split('sms')[0]
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      else if (el.includes('https://')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (el.includes('sms')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          urlFInal.value =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            el.split('https://')[1].split('sms')[0]
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (el.includes('sms')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          urlFInal.value =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            el.split('sms')[0]
        }
      }



    })
    const req = await new RequestApi().getVitrineInfo(urlFInal.value);
    console.log('***...');
    console.log(req);
    if (req.status) {
      next();
    } else {
      next({ name: 'invalidVitrine' });
      console.log('--------------------------------------e');
    }
  },
  setup() {
    useMeta(metaData);
    return {};
  },
  data() {
    return {
      number: '',
      password: '',
      loading: false,
      isPwd: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: [],
      decode: [],
      token: '',
      remember: false,
      confiance: false,
      siteU: Cookies.get('site'),
    };
  },
  methods: {
    async  onSubmit() {
      /**
       * remember et confiance a true == 1 ; false == 0;
       */

      if (
        this.number.toString().length != 0 &&
        this.password.toString().length != 0
      ) {
        console.log('sdddsd', Cookies.get('remember') == 'true');
        this.loading = !this.loading;
        await api
          .post('/api/auth', {
            phone: this.number.toString(),
            password: this.password.toString(),
          })
          .then((response) => {
            this.loading = !this.loading;
            console.log('keyse**', String(this.decode.keySecret));
            api.defaults.headers.common['Authorization'] =
              'Bearer ' + String(response.data.token);
            Cookies.set('token', String(response.data.token));
            Cookies.set('refreshToken', String(response.data.refreshToken));
            this.decode = jwt_decode(String(response.data.token));
            Cookies.set('nom', String(this.decode.nom));
            Cookies.set('prenom', String(this.decode.prenom));
            Cookies.set('phone', String(this.decode.phone));
            Cookies.set('id', parseInt(String(this.decode.id)));
            Cookies.set('keySecret', String(this.decode.keySecret));
            let aujourdhui = new Date();

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            console.log(this.decode.roles[1] == 'ROLE_ADMIN');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (this.decode.roles[1] == 'ROLE_ADMIN') {
              Cookies.set('admin', '1');
            } else {
              Cookies.set('admin', '0');
            }
            Cookies.set(
              'date',
              aujourdhui.toLocaleString().split(',')[0].split('/')[0]
            );
            Cookies.set('remember', this.remember ? 1 : 0);
            Cookies.set('confiance', this.confiance ? 1 : 0);
            let site = Cookies.get('site');
            console.log(site); // Cookies.set('decode', this.decode);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.$router.replace({ name: 'Admin', params: { site } });
            console.log(Cookies.get('id'));
          })
          .catch(() => {
            this.loading = !this.loading;

            this.$q.notify({
              color: 'negative',
              position: 'top',
              message:
                "Erreur d'authentification veuillez verifiez votre numero et mot de passe",
              icon: 'report_problem',
            });
          });
      } else {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Veuillez verifiez remplir correctement tout les champs',
          icon: 'report_problem',
        });
      }
    },
  },
});
</script>

/** setup() { const leftDrawerOpen = ref(false); let loading = ref(false); let
number = ref(''); const $q = useQuasar(); let password = ref(''); //
eslint-disable-next-line @typescript-eslint/no-unsafe-assignment let decode =
ref([]); useMeta(metaData); const onSubmit = async () => {
console.log('sdddsd'); loading.value = !loading.value; await api
.post('/api/auth', { phone: number.value.toString(), password:
password.value.toString(), }) .then((response) => { loading.value =
!loading.value; api.defaults.headers.common['Authorization'] = 'Bearer ' +
String(response.data.token); Cookies.set('token', String(response.data.token));
Cookies.set('refreshToken', String(response.data.refreshToken)); decode =
jwt_decode(String(response.data.token)); Cookies.set('nom',
String(decode.value.nom)); Cookies.set('prenom', String(decode.value.prenom));
Cookies.set('phone', String(decode.value.phone)); Cookies.set('id',
parseInt(String(decode.value.id))); Cookies.set('keySecret',
String(decode.value.keySecret)); // eslint-disable-next-line
@typescript-eslint/no-unsafe-call console.log(decode.value.roles[1] ==
'ROLE_ADMIN'); // eslint-disable-next-line @typescript-eslint/no-unsafe-call if
(decode.value.roles[1] == 'ROLE_ADMIN') { Cookies.set('admin', '1'); } else {
Cookies.set('admin', '0'); } console.log(Cookies.get('admin')); //
Cookies.set('decode', decode); // eslint-disable-next-line
@typescript-eslint/no-floating-promises // eslint-disable-next-line
@typescript-eslint/no-unsafe-call this.$router.replace({ name: 'Admin' });
console.log(Cookies.get('id')); }) .catch(() => { loading.value =
!loading.value; $q.notify({ color: 'negative', position: 'top', message: "Erreur
d'authentification veuillez verifiez votre numero et mot de passe", icon:
'report_problem', }); }); }; return { leftDrawerOpen, loading, onSubmit, number,
password, }; }, */
