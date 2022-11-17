<template>
  <header class="hero"></header>

  <section class="register">
    <div class="container">
      <div class="row">
        <div id="resultat1" class="noRadius col-lg-12"></div>
        <div class="footerConnection col-lg-12">
          <h3>Inscrivez-vous</h3>
          <span>Testez gratuitement et sans engagement notre service</span>
        </div>

        <div class="col-lg-12">
          <q-form
            class=""
            @submit="onSubmit"
            name=""
            methos="POST"
            id="HeaderSignUp"
          >
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Votre nom "
                v-model="nom"
                autocomplete="off"
                name="nom"
                id="nom"
              />
            </div>

            <div class="form-group">
              <input
                type="text"
                v-model="prenom"
                class="form-control"
                placeholder="Votre prenom"
                autocomplete="off"
                name="prenoms"
                id="prenoms"
              />
            </div>

            <div class="form-group">
              <input
                type="text"
                v-model="entreprise"
                class="form-control"
                placeholder="Votre entreprise / Organisation"
                autocomplete="off"
                name="societe"
                id="societe"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                placeholder="Votre mail "
                v-model="mail"
                autocomplete="off"
                name="mail"
                id="mail"
              />
            </div>
            <div class="form-group">
              <input
                type="tel"
                class="form-control"
                placeholder="numero de telephone"
                autocomplete="off"
                name="telephone"
                v-model="phone"
                id="numero_telephone"
                onkeyup="verification_chiffre(this)"
                maxlength="12"
              />
            </div>

            <div class="form-group">
              <input
                type="password"
                v-model="password"
                class="form-control"
                placeholder="Votre mot de passe"
                name="password"
                autocomplete="off"
                id="password"
              />
            </div>
            <div class="col-md-12">
              <div
                class="checkbox"
                style="margin-top: 0; padding-left: 0; display: inline"
              >
                <div class="" style="">
                  <input
                    type="checkbox"
                    id="accepted"
                    name="accepted"
                    class="check"
                    value="1"
                    style="width: 20px; height: 20px"
                  />
                </div>
                J'ai lu et j'accepte
                <a target="_blank" href="terms.php">
                  <span style="">les termes et conditions du service</span> </a
                >.
              </div>
            </div>

            <button
              type="submit"
              class="btn btnsubmit form-control noRadius"
              name="send"
            >
              Inscription
            </button>
          </q-form>
        </div>
        <!-- End Form -->
        <div class="col-lg-12">
          <div>
            <ul class="social-links">
              <li class=""><p>S' incrire à partir de:</p></li>
              <li>
                <a href="#"><i class="fa fa-facebook-official fa-2x"></i></a>
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
      <!-- End Row -->
    </div>
    <!-- End Container -->
  </section>
  <!--End Section Register-->
  <!-- End Container -->
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar, useMeta } from 'quasar';

import { api } from 'boot/axios';
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
    stylei: { rel: 'stylesheet', href: 'css/stylei.css' },

    normalize: { rel: 'stylesheet', href: 'css/normalize.less' },
    vendorprefixes: { rel: 'stylesheet', href: 'css/vendor-prefixes.less' },

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

import { RequestApi } from 'boot/RequestApi';

export default defineComponent({
  name: 'SignUp',

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
      phone: '',
      password: '',
      entreprise: '',
      prenom: '',
      nom: '',
      mail: '',
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
      console.log('icii6666');
      this.data = {
        nom: this.nom,
        prenom: this.prenom,
        phone: this.phone,
        password: this.password,
        nomEntreprise: this.entreprise,
        email: this.mail,
      };
      // Cookies.remove('token');
      api.defaults.headers.common['Authorization'] = null;
      const response = await new RequestApi().signUp(this.data);

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        void this.connect();
      } else {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Une Erreur est survenue lors de votre inscription',
          icon: 'report_problem',
        });
      }
    },
    async connect() {
      await api
        .post('/api/auth', { phone: this.phone, password: this.password })
        .then((response) => {
          api.defaults.headers.common['Authorization'] =
            'Bearer ' + String(response.data.token);
          Cookies.set('token', String(response.data.token));
          Cookies.set('refreshToken', String(response.data.refreshToken));
          this.decode = jwt_decode(String(response.data.token));
          Cookies.set('id', parseInt(String(this.decode.id)));
                  Cookies.set('keySecret',String(this.decode.keySecret));
 console.log(jwt_decode(String(response.data.token)).id); // Cookies.set('decode', this.decode);

         // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.$router.replace({ name: 'Admin' });
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

<style scoped>
/*
.conta {
  background-color: rgba(70, 70, 70, 0.4);
  border: 0.5px rgba(190, 190, 190, 0.6) solid;

  width: 25%;
  min-width: 30%;
  max-width: 40%;
  text-align: left;
}
 */
.form-control {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.form-control:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.form-control::-moz-placeholder {
  color: #999;
  opacity: 1;
}
.form-control:-ms-input-placeholder {
  color: #999;
}
.form-control::-webkit-input-placeholder {
  color: #999;
}
.form-control::-ms-expand {
  background-color: transparent;
  border: 0;
}
.form-control[disabled],
.form-control[readonly],
fieldset[disabled] .form-control {
  background-color: #eee;
  opacity: 1;
}
.form-control[disabled],
fieldset[disabled] .form-control {
  cursor: not-allowed;
}
textarea.form-control {
  height: auto;
}
input[type='search'] {
  -webkit-appearance: none;
}
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input[type='date'].form-control,
  input[type='time'].form-control,
  input[type='datetime-local'].form-control,
  input[type='month'].form-control {
    line-height: 34px;
  }
  input[type='date'].input-sm,
  input[type='time'].input-sm,
  input[type='datetime-local'].input-sm,
  input[type='month'].input-sm,
  .input-group-sm input[type='date'],
  .input-group-sm input[type='time'],
  .input-group-sm input[type='datetime-local'],
  .input-group-sm input[type='month'] {
    line-height: 30px;
  }
  input[type='date'].input-lg,
  input[type='time'].input-lg,
  input[type='datetime-local'].input-lg,
  input[type='month'].input-lg,
  .input-group-lg input[type='date'],
  .input-group-lg input[type='time'],
  .input-group-lg input[type='datetime-local'],
  .input-group-lg input[type='month'] {
    line-height: 46px;
  }
}
.form-group {
  margin-bottom: 15px;
}
</style>
