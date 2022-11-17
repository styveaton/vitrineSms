/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" container :style="{ height: $q.screen.height + 'px' }" class="rounded-borders">
      <q-header :class="!theme ? 'bg-grey-4' : ''">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title class="text-grey-8">{{
          description
          }}</q-toolbar-title>
          <q-space></q-space>
          <!-- <q-btn-group glossy class="text-grey-8 rounded-borders">
            <q-input
              placeholder="Ex: Bonjour"
              :input-style="{ width: 450 + 'px' }"
              v-model="search"
            ></q-input>
            <q-btn icon="search" dense></q-btn>
          </q-btn-group> -->

          <q-space></q-space>
          <q-btn icon="light_mode" v-show="drawer" flat @click="changeT" v-if="theme" />
          <q-btn icon="dark_mode" v-show="drawer" flat @click="changeT" v-else />

          <q-select v-model="locale" v-show="drawer" :options="localeOptions" label=" Language" dense borderless
            emit-value map-options options-dense style="min-width: 100px" />
          <q-btn-dropdown icon="person" flat>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Infos</div>
                <div>Tel: {{ phone }}</div>
                <div>Solde: {{ qteSms }}</div>
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ nom }}</div>

                <q-btn color="primary" label="Deconnexion" push size="sm" v-close-popup @click="loggout" />
              </div>
            </div>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="drawer" show-if-above :mini="!drawer || miniState" @click.capture="drawerClick" :width="250"
        :breakpoint="500" bordered :class="!theme ? 'bg-grey-3' : ''">
        <q-scroll-area class="fit">
          <q-list padding separator>
            <q-item clickable v-ripple :to="{ name: 'Manager' }">
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section> TABLEAU DE BORD </q-item-section>
            </q-item>

            <q-expansion-item expand-separator :content-inset-level="0.3" icon="contacts" label="Contact">
              <q-list>
                <q-item clickable v-ripple :to="{ name: 'NewContact' }">
                  <q-item-section avatar>
                    <q-icon name="add" />
                  </q-item-section>

                  <q-item-section> Nouveau </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'GroupeContact' }">
                  <q-item-section avatar>
                    <q-icon name="group" />
                  </q-item-section>

                  <q-item-section> Groupes </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'ImportContact' }">
                  <q-item-section avatar>
                    <q-icon name="save" />
                  </q-item-section>

                  <q-item-section> Import </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'ListContact' }">
                  <q-item-section avatar>
                    <q-icon name="list" />
                  </q-item-section>

                  <q-item-section>
                    {{ $t('listcontact.title') }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item expand-separator :content-inset-level="0.3" icon="message" label="Messages">
              <q-list>
                <q-item clickable v-ripple :to="{ name: 'MessageIndividuel' }">
                  <q-item-section avatar>
                    <q-icon name="send" />
                  </q-item-section>

                  <q-item-section> SMS Individuel </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'MessageGroupe' }">
                  <q-item-section avatar>
                    <q-icon name="group" />
                  </q-item-section>

                  <q-item-section> SMS de Groupe </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'MessageCron' }">
                  <q-item-section avatar>
                    <q-icon name="watch" />
                  </q-item-section>

                  <q-item-section> Etat SMS Programmé </q-item-section>
                </q-item>
                <q-item clickable v-ripple :to="{ name: 'MessageCustom' }">
                  <q-item-section avatar>
                    <q-icon name="list" />
                  </q-item-section>

                  <q-item-section> SMS Personnalisé </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-item clickable v-ripple :to="{ name: 'Transactions' }">
              <q-item-section avatar>
                <q-icon name="change_history" />
              </q-item-section>

              <q-item-section> Historique SMS </q-item-section>
            </q-item>
            <q-expansion-item expand-separator :content-inset-level="0.3" icon="payment" label="Licence">
              <q-list>
                <q-item clickable v-ripple :to="{ name: 'PackSms' }">
                  <q-item-section avatar>
                    <q-icon name="attach_money" />
                  </q-item-section>

                  <q-item-section> Acheter SMS </q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-icon name="history" />
                  </q-item-section>

                  <q-item-section> List Achat </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item expand-separator :content-inset-level="0.3" icon="dashboard" label="Evenements">
              <q-list>
                <q-item clickable :to="{ name: 'Calendrier' }">
                  <q-item-section avatar>
                    <q-icon name="supervised_user_circle" />
                  </q-item-section>

                  <q-item-section> Calendrier </q-item-section>
                </q-item>

                <q-item clickable :to="{ name: 'Notification' }">
                  <q-item-section avatar>
                    <q-icon name="supervised_user_circle" />
                  </q-item-section>

                  <q-item-section> Notifications </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-item clickable v-ripple v-show="!drawer" flat @click="changeT" v-if="theme">
              <q-item-section avatar>
                <q-icon name="light_mode" />
              </q-item-section>

              <q-item-section> Theme </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-show="!drawer" flat @click="changeT" v-else>
              <q-item-section avatar>
                <q-icon name="dark_mode" />
              </q-item-section>

              <q-item-section> Theme </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-select v-model="locale" v-show="!drawer" :options="localeOptions" label=" Language" class="ms-2" dense
                borderless emit-value map-options options-dense style="min-width: 50px" />
            </q-item>

            <!-- <q-expansion-item
              expand-separator
              :content-inset-level="0.3"
              icon="dashboard"
              label="Profil Utilisateurs"
            >
              <q-list>
                <q-item clickable v-ripple :to="{ name: 'NewProfil' }">
                  <q-item-section avatar>
                    <q-icon name="account_box" />
                  </q-item-section>

                  <q-item-section>  Creer un role </q-item-section>
                </q-item>

                <q-item clickable v-ripple :to="{ name: 'ConfigProfile' }">
                  <q-item-section avatar>
                    <q-icon name="settings_applications" />
                  </q-item-section>
                  <q-item-section> Profil </q-item-section>
                </q-item>

                <q-item clickable  href="http://localhost:8081">
                  <q-item-section avatar>
                    <q-icon name="supervised_user_circle" />
                  </q-item-section>

                  <q-item-section> Configuration </q-item-section>
                </q-item>

                <q-item clickable v-ripple :to="{ name: 'VitrineAdmin' }">
                  <q-item-section avatar>
                    <q-icon name="supervised_user_circle" />
                  </q-item-section>

                  <q-item-section> Vitrine </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item> -->
          </q-list>
        </q-scroll-area>

        <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
        -->
        <div class="q-mini-drawer-hide absolute" style="top: 15px; right: -17px">
          <q-btn dense round unelevated color="accent" icon="chevron_left" @click="
            drawer = !drawer;
            miniState = true;
          " />
        </div>
      </q-drawer>

      <q-page-container>
        <router-view></router-view>
      </q-page-container>
    </q-layout>
    <div class="bg-grey-10 q-px-sm q-py-lg shadow-3">
      <div class="row text-center text-grey-5">
        <div class="col-md-3">SMS GESSIIA | GESSIIA SARL &copy; 2022</div>
        <div class="col-md-3">Telephone: +237 679 170 000 / 656 295 102</div>
        <div class="col-md-3">Plan du Site</div>
        <div class="col-md-3">SMS GESSIIA | GESSIIA SARL © 2022</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

import { useI18n } from 'vue-i18n';
import { api } from 'boot/axios';
// import jwt_decode from 'jwt-decode';

import { Cookies } from 'quasar';
import i18n from 'src/i18n';

import { formatDate } from 'boot/formatDate';
import { useQuasar } from 'quasar';
import { RequestApi } from 'boot/RequestApi';
import routes from '../../router';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';

export default defineComponent({
  name: 'Admin',
  created: () => {
    console.log('a is: ', Cookies.get('nom'));

    // get status // true, false
  },

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

    // console.log(site);
    const req = await new RequestApi().getVitrineInfo(urlFInal.value);
    console.log('***...');
    console.log(req);
    if (
      Cookies.get('token') != undefined &&
      Cookies.get('token') != 'undefined' &&
      Cookies.get('token') != null
    ) {
      if (req.status) {
        console.log(req.data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        Cookies.set('description', req.data.description);
        next();
      } else {
        next({ name: 'invalidVitrine' });
        console.log('--------------------------------------e');
      }
    } else {
      next({ name: 'Home' });
      console.log('--------------------------------------e');
    }
    // next()
    //     let remember = Cookies.get('remember');
    //     let confiance = Cookies.get('confiance');
    //     Cookies.set(
    //       'to',
    //       window.location.href.split('/')[
    //         window.location.href.split('/').length - 1
    //       ]
    //     );
    //     let aujourdhui = new Date();
    //     if (confiance == '1') {
    //       console.log('**********************Confiance');

    //       if (remember == '1') {
    //         await refreshAuthenticated();
    //         next();

    //         console.log('**********************Remember');
    //       } else {
    //         console.log('**********************No Remember');

    //         if (
    //           Cookies.get('date') !=
    //           aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //         ) {
    //           console.log('**********************date differente');
    //           Cookies.set(
    //             'date',
    //             aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //           );
    //           Cookies.set(
    //             'to',
    //             window.location.href.split('/')[
    //               window.location.href.split('/').length - 1
    //             ]
    //           );
    //           next({ name: 'RememberPage' });
    //         } else {
    //           await refreshAuthenticated();

    //           console.log('**********************meme date');

    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //           next();
    //         }
    //       }
    //     } else {
    //       console.log('**********************No Confiance');

    //       if (remember == '1') {
    //         if (
    //           Cookies.get('date') !=
    //           aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //         ) {
    //           Cookies.set(
    //             'date',
    //             aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //           );
    //           console.log('**********************date differente');

    //           Cookies.set(
    //             'to',
    //             window.location.href.split('/')[
    //               window.location.href.split('/').length - 1
    //             ]
    //           );
    //           next({ name: 'RememberPage' });
    //         } else {
    //           await refreshAuthenticated();

    //           console.log('**********************meme date');

    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //           next();
    //         }
    //       } else {
    //         console.log(
    //           Cookies.get('date') !=
    //             aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //         );
    //         console.log('**********************No Remember');
    //         if (
    //           Cookies.get('date') !=
    //           aujourdhui.toLocaleString().split(',')[0].split('/')[0]
    //         ) {
    //           console.log('**********************date differente');

    //           api.defaults.headers.common['Authorization'] = null;
    //           Cookies.remove('token');
    //           Cookies.remove('refreshToken');
    //           Cookies.set('token', 'undefined');
    //           Cookies.set('refreshToken', 'undefined');
    //           Cookies.remove('id');
    //           Cookies.remove('admin');
    //           // Cookies.remove('theme');

    //           next({ name: 'Home' });
    //         } else {
    //           await refreshAuthenticated();

    //           console.log('**********************meme date');

    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //           next();
    //         }
    //       }
    //     }
  },
  methods: {
    async loggout() {
      console.log(this.$t('failed'));
      api.defaults.headers.common['Authorization'] = null;
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.set('token', 'undefined');
      Cookies.set('refreshToken', 'undefined');
      Cookies.remove('id');
      Cookies.remove('admin');
      // Cookies.remove('theme');
      // let site = Cookies.get('site');

      console.log('iiiiiiiiiiiiiii', Cookies.get('admin'));
      await this.$router.push({ name: 'Home', /* params: { site }  */ });
    },
  },
  data() {
    return {};
  },
  setup() {
    onMounted(async () => {
      description.value = Cookies.get('description'); // await getInfoVitrine();
      console.log(description.value);
      await getQteSms();
    });
    // const getInfoVitrine = async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   var site = window.location.href.split('/')[0];
    //   console.log(site);
    //   const req = await new RequestApi().getVitrineInfo(site);
    //   if (req.status) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     description =Cookies.get('description');
    //   } else {
    //   }
    // };
    const description = ref('SMS Marketing ');
    const $q = useQuasar();
    const qteSms = ref(0);

    console.log($q.dark.isActive);
    const miniState = ref(true);
    const nom = ref('');
    const phone = ref('');
    nom.value = Cookies.get('nom');
    const { locale } = useI18n({ useScope: 'global' });
    phone.value = Cookies.get('phone');
    let theme = ref(false);
    const getQteSms = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await new RequestApi().getQteSmsAction();
      //  console.log('get qte statu', response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        qteSms.value = response.qte;
      } else {
        $q.notify({
          message: 'Erreur lors du chargement de votre credit restant',
          type: 'negative',
        });
      }
    };
    const changeT = () => {
      theme.value = !theme.value;
      $q.dark.set(theme.value);

      // Cookies.set('theme', theme.value ? '1' : '0');

      console.log(theme.value, theme.value ? '1' : '0');
    };
    const getTheme = () => {
      if (
        Cookies.get('theme') == 'undefined' ||
        Cookies.get('theme') == undefined
      ) {
        console.log('pas de theme....');
        theme.value = false;
        /***
         * 0 =>theme false , 1=>theme 1
         */
        Cookies.set('theme', '0');
      } else {
        console.log('theme....');

        console.log(Cookies.get('theme'));

        $q.dark.set(Cookies.get('theme') == '0');

        console.log(Cookies.get('theme') == '0');
      }
    };
    return {
      drawer: ref(false),
      miniState,
      // search,
      theme,
      nom,
      phone,
      $q,
      locale,
      description,
      changeT,
      qteSms,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

      localeOptions: [
        {
          label: 'Francais',
          value: 'fr-FR',
        },
        {
          label: 'US English',
          value: 'en-us',
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ],
      drawerClick() {
        // if in "mini" state and user
        // click on drawer, we switch it to "normal" mode
        if (miniState.value) {
          miniState.value = false;

          // notice we have registered an event with capture flag;
          // we need to stop further propagation as this click is
          // intended for switching drawer to "normal" mode only
        }
      },
    };
  },
});
</script>

<style scoped>

</style>
