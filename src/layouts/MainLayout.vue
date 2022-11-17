/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>
  <q-layout>
    <div class="container position-sticky rounded border-radius-inherit z-top">
      <div class="row">
        <div class="col-12">
          <!-- Navbar -->
          <nav
            class="bg-grey-1 fixed navbar navbar-expand-lg top-0 position-absolute mt-4 blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow radius">
            <div class="container ps-2 pe-0">
              <a href="/" class="navbar-brand font-weight-bolder ms-lg-0 ms-3"><img src="../assets/devoo-animate.svg"
                  height="40" width="50" alt="" srcset="" /></a><button class="shadow-none navbar-toggler ms-2"
                type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation"
                aria-expanded="false" aria-label="Toggle navigation" _msthidden="A" _msthiddenattr="1313455"
                _mstaria-label="320099">
                <span class="mt-2 navbar-toggler-icon"><span class="navbar-toggler-bar bar1"></span><span
                    class="navbar-toggler-bar bar2"></span><span class="navbar-toggler-bar bar3"></span></span>
              </button>
              <div class="collapse navbar-collapse" id="navigation">
                <ul class="navbar-nav mx-auto">
                  <li class="nav-item">
                    <router-link :to="{ name: 'Home' }" class="nav-link d-flex align-items-center me-2 active">Vitrine
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link :to="{ name: 'Price' }" class="nav-link d-flex align-items-center me-2 active">Tarifs
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link :to="{ name: 'Doc' }" class="nav-link d-flex align-items-center me-2 active">
                      Documentaion</router-link>
                  </li>
                  <!-- <li class="nav-item">
                    <router-link
                      :to="{ name: 'Inscription' }"
                      class="nav-link d-flex align-items-center me-2 active"
                      >Inscription</router-link
                    >
                  </li> -->
                </ul>
              </div>
            </div>
          </nav>
          <!-- End Navbar -->
        </div>
      </div>
    </div>

    <router-view />
  </q-layout>
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
import { refreshAuthenticated } from 'boot/refreshAuthenticated';
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
  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};
export default defineComponent({
  name: 'Home',
  components: {},

  async beforeRouteEnter(to, from, next) {

    // const site = to.redirectedFrom
    //   ? to.redirectedFrom.params.site.toString()
    //   : to.params.site.toString();
    // Cookies.set('site', site);
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
    // const site = to.redirectedFrom
    //   ? to.redirectedFrom.params.site.toString()
    //   : to.params.site.toString();
    Cookies.set('site', urlFInal.value);
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
    async onSubmit() {
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
