<!-- eslint-disable @typescript-eslint/no-unsafe-call -->
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">Calendrier</div>
        <div class="text-caption">Programmer un evennement</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="text-right q-pb-md">
          <q-btn label="Programmer un Evenement" color="green" icon-right="add" no-caps @click="validate"></q-btn>

          <q-dialog v-model="promptValid">
            <q-card style="min-width: 500px; min-height: 300px">
              <q-card-section>
                <div class="text-h6 text-center">
                  Remplir les champs suivants
                </div>
              </q-card-section>
              <q-card-section class="row q-gutter-y-md">
                <div class="text-h6">
                  <q-tabs v-model="tab" dense @click="clear" class="text-grey items-center" active-color="primary"
                    indicator-color="primary" align="center" narrow-indicator>
                    <q-tab name="Single" @click="clear" icon="mail" label="Single User" />
                    <q-tab name="Groupe" @click="clear" icon="alarm" label="Evennement de Groupes" />

                    <q-tab name="All" icon="alarm" label="General" />
                  </q-tabs>
                </div>
              </q-card-section>
              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="Single">
                  <div class="text-h6 text-center">
                    Programmer un evennement pour un contact
                  </div>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select filled stack-label label="List Contact" dense v-model="selectContact"
                        :options="optionsContact" />
                    </div>

                    <div class="q-pb-md">
                      <q-input filled stack-label label="Sender Name" placeholder="Ex: Gessiia" v-model="senderEvent"
                        dense autofocus required />
                    </div>
                    <div class="q-pb-md">
                      <q-input filled stack-label label="Message" placeholder="Ex: Merci de votre participation"
                        v-model="messageEvent" dense />
                    </div>

                    <div class="q-pb-md">
                      <q-input filled v-model="dateEvent" label="Date execution">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="dateEvent" mask="YYYY-MM-DD HH:mm">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="dateEvent" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                </q-tab-panel>

                <q-tab-panel name="Groupe" align="center">
                  <div class="text-h6 items-center">
                    Programmer un evennement pour un groupe
                  </div>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select filled stack-label label="Goupe Contact" dense v-model="selectGroupes"
                        :options="optionsGroupes" />
                    </div>
                    <div class="q-pb-md">
                      <q-input filled stack-label label="Sender Name" placeholder="Ex: Gessiia" v-model="senderEvent"
                        dense autofocus required />
                    </div>
                    <div class="q-pb-md">
                      <q-input filled stack-label label="Message" placeholder="Ex: Merci de votre participation"
                        v-model="messageEvent" dense />
                    </div>

                    <div class="q-pb-md">
                      <q-input filled v-model="dateEvent" label="Date execution">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="dateEvent" mask="YYYY-MM-DD HH:mm">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="dateEvent" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                </q-tab-panel>
                <q-tab-panel name="All" align="center">
                  <div class="text-h6 items-center">
                    Programmer un evennement pour tout vos contact
                  </div>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-input filled stack-label label="Sender Name" placeholder="Ex: Gessiia" v-model="senderEvent"
                        dense autofocus required />
                    </div>
                    <div class="q-pb-md">
                      <q-input filled stack-label label="Message" placeholder="Ex: Merci de votre participation"
                        v-model="messageEvent" dense />
                    </div>

                    <div class="q-pb-md">
                      <q-input filled v-model="dateEvent" label="Date execution">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="dateEvent" mask="YYYY-MM-DD HH:mm">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-time v-model="dateEvent" mask="YYYY-MM-DD HH:mm" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup label="Close" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </q-card-section>
                </q-tab-panel>
              </q-tab-panels>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Annuler" type="submit" color="red" icon-right="close" no-caps v-close-popup />
                <q-btn flat label="Valider" type="submit" color="green" icon-right="save" no-caps v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="row justify-between">
          <div class="col-lg-1 col-md-4 col-xl-1 col-sm-1">
            <q-date v-model="date" @click="selectDate(date)" :options="options" multiple>
            </q-date>
          </div>

          <div class="col-lg-8 col-md-8 col-xl-9 col-sm-1">
            <div class="border-radius-inherit">
              <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
                Liste des evenements
              </div>
              <div class="q-py-lg q-px-sm">
                <q-table separator="cell" :rows="rows" :columns="columns" row-key="name" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeMount } from 'vue';
import { Cookies } from 'quasar';

import { formatDate } from 'boot/formatDate';
import { useQuasar } from 'quasar';
import { RequestApi } from 'boot/RequestApi';
import { useMeta } from 'quasar';
import routes from '../../router';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';

const metaData = {
  // sets document title
  title: 'Ajouter un calendrier',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'Calendrier',
  // async beforeRouteEnter(to, from, next) {
  //   console.log(routes.name);
  //   let aujourdhui = new Date();
  //   console.log(aujourdhui.getDay());
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-non-null-assertion
  //   Cookies.set(
  //     'to',
  //     window.location.href.split('/')[
  //       window.location.href.split('/').length - 1
  //     ]
  //   );

  //   console.log(Cookies.get('remember'), Cookies.get('to'));
  //   if (Cookies.get('date') != aujourdhui.getDay().toString()) {
  //     if (Cookies.get('remember') == 'true') {
  //       if (
  //         Cookies.get('token') != undefined &&
  //         Cookies.get('token') != 'undefined' &&
  //         Cookies.get('token') != null
  //       ) {
  //         console.log(
  //           Cookies.get('token') != undefined &&
  //             Cookies.get('token') != 'undefined' &&
  //             Cookies.get('token') != null
  //         );
  //         console.log('iiiiixzzxioooiioi', Cookies.get('token'));
  //         await refreshAuthenticated();

  //         Cookies.set('date', aujourdhui.getDay().toString());

  //         next({ name: 'Admin' });
  //       } else {
  //         console.log('llllllllll');
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  //         next({ name: 'Home' });
  //       }
  //       console.log('rout**** gooooooo');
  //       next();
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  //       // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //     } else {
  //       next({ name: 'RememberPage' });
  //     }
  //   } else {
  //     next();
  //   }
  // },
  setup() {
    const $q = useQuasar();
    onMounted(async () => {
      await getListContacts();
      await getGroupe();
    });

    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);
    const selectGroupes = ref({ id: 0, label: 'Aucun' });
    const optionsContact = ref([{ id: 0, label: 'Aucun' }]);
    const selectContact = ref({ id: 0, label: 'Aucun' });
    let promptValid = ref(false);
    let loadingGroupes = ref(true);
    let loadingContact = ref(true);
    let senderEvent = ref('');
    let messageEvent = ref('');
    let dateEvent = ref(new Date());

    const qteSms = ref(0);

    const getEvent = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getQteSmsAction();
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

    const getListContacts = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getListContactAction();

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsContact.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/restrict-plus-operands
            label: x.nom + ' ' + x.prenom,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          };
        });
        loadingContact.value = false;
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des contacts',
          type: 'negative',
        });
        loadingContact.value = false;
      }
      // loadingGroupes.value = false;
    };

    const getGroupe = async () => {
      loadingGroupes.value = true;
      optionsGroupes.value.pop();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getGroupesAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsGroupes.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.nom,
          };
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des groupes',
          type: 'negative',
        });
      }
      loadingGroupes.value = false;
    };
    const selectDate = (date: any) => {
      console.log(date);
    };
    const validate = () => {
      //  if( nom.value != '' || prenom.value != '' ||nom.value != '' ||nom.value != '' ||nom.value != '')
      promptValid.value = !promptValid.value;
    };
    const clear = () => {
      senderEvent.value = '';
      messageEvent.value = '';
      dateEvent.value = new Date();
    };
    useMeta(metaData);
    return {
      tab: ref('Single'),
      optionsContact,
      optionsGroupes,
      selectGroupes,
      selectContact,
      promptValid,
      validate,
      selectDate,
      senderEvent,
      messageEvent,
      clear,
      dateEvent,
      date: ref(['2022/07/01', '2022/07/10', '2022/07/18', '2022/07/25']),
      options: ref(['2022/07/01', '2022/07/10', '2022/07/18', '2022/07/25']),
    };
  },
});
</script>

<style>
.a {
  margin-top: 10px;
}

.align {
  position: relative;
  float: right;
  margin-top: 7px;
}
</style>
