/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>
  <q-layout view="lHh Lpr lFf">
    <header class="hero">
      <div class="container-fluid">
        <div class="container">
          <div class="row">
            <div class="col-md-12 col-xs-12">
              <nav>
                <div id="menu-toggle">
                  <div></div>
                  <div class="hamburger">
                    <span class="line"></span>
                    <span class="line"></span>
                    <span class="line"></span>
                  </div>
                </div>
                <ul class="main-nav">
                  <li>
                    <router-link :to="{ name: 'Home' }">Acceuil</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Price' }">Tarifs</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Doc' }"
                      >Documentaion</router-link
                    >
                  </li>
                  <li><router-link to="log-in.php">connexion</router-link></li>
                  <li>
                    <select name="lang" style="padding: 2px" class="purple">
                      <option value="Fr">Fr</option>
                      <option value="Eng">Eng</option>
                    </select>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div class="row" v-if="$route.name === 'Vitrine'">
            <div class="col-md-12 col-xs-12 Fornconnection">
              <div
                id="resul"
                style="text-align: center"
                class="col-lg-12"
              ></div>
              <div class="HomeMsg col-md-6 col-xs-12">
                <h4 class="sub-heading">
                  <br />Cameroonss VALUE[date("D-M-Y")]
                </h4>
                <h2 class="heading purple">
                  <br /><span class="purple">Demarrez une Campagne SMS</span>
                  <br /><br />Envoyez gratuitement des SMS et Mails à partir de
                  votre compte
                </h2>
              </div>
              <div class="connection col-md-6 col-xs-12">
                <h2 class="fs-title">Connectez vous</h2>
                <h5 class="fs-subtitle">
                  Remplissez le formulaire et cliquez sur connection.
                </h5>
                <q-form
                  class=""
                  @submit="onSubmit"
                  name=""
                  methos="POST"
                  id="Headerlogin"
                >
                  <div class="form-group">
                    <label>
                      <input
                        type="tel"
                        name="login"
                        class="form-control noRadius"
                        required
                        autocomplete="off"
                        v-model="number"
                        placeholder="Telephone"
                        maxlength="12"
                      />
                    </label>
                    <label>
                      <input
                        type="password"
                        required
                        v-model="password"
                        autocomplete="off"
                        name="pass"
                        class="form-control noRadius"
                        placeholder="Mot de passe"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    class="btn noRadius form-control btnvalid"
                    name=""
                  >
                    CONNECTION
                  </button>
                </q-form>
                <div class="col-lg-12">
                  <a href="#" class="pull-right"> Besoin d'aide ? </a>
                  <a href="/inscription"> Créer votre compte</a>
                </div>
                <div class="footerConnection col-lg-12">
                  <ul class="social-links">
                    <li class=""><p>Autres moyens de connection:</p></li>
                    <li>
                      <a href="#"
                        ><i class="fa fa-facebook-official fa-2x"></i
                      ></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa fa-google fa-2x"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa fa-twitter fa-2x"></i></a>
                    </li>
                    <li>
                      <a href="#"><i class="fa fa-github fa-2x"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  <footerComponent></footerComponent>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { useMeta } from 'quasar';
import { api } from 'boot/axios';
import footerComponent from 'components/footerComponent.vue';
import jwt_decode from 'jwt-decode';
import { Cookies } from 'quasar';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';
const metaData = {
  // sets document title
  title: 'Welcome to Smailling',
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
    material: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    },
    bootstrapcdn: {
      rel: 'stylesheet',
      href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    },
    googleapis: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700|Open+Sans:300,400,700',
    },
    cloudflare: {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
    },
    swiper: { rel: 'stylesheet', href: 'css/swiper.min.css' },
    price: { rel: 'stylesheet', href: 'css/price.css' },
    style: { rel: 'stylesheet', href: 'css/style.css' },
    bootstrap1: { rel: 'stylesheet', href: 'css/bootstrap.css' },
    bootstrap2: { rel: 'stylesheet', href: 'css/bootstrap.min.css' },
    bootstrap3: { rel: 'stylesheet', href: 'css/bootstrap-theme.css' },
  },
  // JS tags
  script: {
    respond: {
      src: 'https://oss.maxcdn.com/respond/1.4.2/respond.min.js',
    },
    html5shiv: {
      src: 'https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js',
    },
    jquery: {
      src: 'js/jquery-2.1.1.js',
    },
    swiper: {
      src: 'js/swiper.jquery.min.js',
    },
    EditJs1: {
      src: 'js/EditJs1.js',
    },
    cloudflare1: {
      src: 'http://cdnjs.cloudflare.com/ajax/libs/waypoints/2.0.3/waypoints.min.js',
    },
    counterup1: {
      src: 'js/jquery.counterup.min.js',
    },
    counterup2: {
      src: 'js/jquery.counterup.min.js',
    },
    EditJs2: {
      src: 'js/EditJs2.js',
    },
    EditJs3: {
      src: 'js/EditJs3.js',
    },
    main: {
      src: 'js/main.min.js',
    },
    index: {
      src: 'js/index.js',
    },
    cloudflare2: {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js',
    },
    jsdelivr: {
      src: 'https://cdn.jsdelivr.net/npm/nicescroll@3.7.4/jquery.nicescroll.min.js',
    },
    cloudflare3: {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
    },
    cloudflare4: {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/js/bootstrap.min.js',
    },
    jquery2: {
      src: 'https://code.jquery.com/jquery-2.2.4.js',
    },
  },
  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};
export default defineComponent({
  name: 'Home',
  components: {
    footerComponent,
  },
  async beforeRouteEnter(to, from, next) {
    if (
      Cookies.get('token') != undefined &&
      Cookies.get('token') != 'undefined' &&
      Cookies.get('token') != null
    ) {
      console.log(
        Cookies.get('token') != undefined &&
          Cookies.get('token') != 'undefined' &&
          Cookies.get('token') != null
      );
      console.log('iiiiixzzxioooiioi', Cookies.get('token'));
      await refreshAuthenticated();
      next({ name: 'Admin' });
    } else {
      console.log('llllllllll');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      next();
    }
  },
  setup() {
    const leftDrawerOpen = ref(false);
    useMeta(metaData);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      number: '',
      password: '',
      remenber: false,
      isPwd: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: [],
      decode: [],
      token: '',
    };
  },
  methods: {
    async onSubmit() {
      console.log('sdddsd');
      await api
        .post('/api/auth', {
          phone: this.number.toString(),
          password: this.password.toString(),
        })
        .then((response) => {
          api.defaults.headers.common['Authorization'] =
            'Bearer ' + String(response.data.token);
          Cookies.set('token', String(response.data.token));
          Cookies.set('refreshToken', String(response.data.refreshToken));
          this.decode = jwt_decode(String(response.data.token));
          Cookies.set('nom', String(this.decode.nom));
          Cookies.set('prenom', String(this.decode.prenom));
          Cookies.set('phone', String(this.decode.phone));
          Cookies.set('id', parseInt(String(this.decode.id)));
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          console.log(this.decode.roles[1] == 'ROLE_ADMIN');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          if (this.decode.roles[1] == 'ROLE_ADMIN') {
            Cookies.set('admin', '1');
          } else {
            Cookies.set('admin', '0');
          }
          console.log(Cookies.get('admin')); // Cookies.set('decode', this.decode);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.$router.replace({ name: 'Admin' });
          console.log(Cookies.get('id'));
        })
        .catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message:
              "Erreur d'authentification veuillez verifiez votre numero et mot de passe",
            icon: 'report_problem',
          });
        });
    },
  },
});
</script>
<style scoped></style>
