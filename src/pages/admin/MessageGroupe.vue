<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('messageGroupe.title') }}</div>
        <div class="text-caption">{{ $t('messageGroupe.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="border-radius-inherit">
          <div class="row bg-grey-9 q-py-md q-px-xs text-grey-4">
            <div class="col-md-3">
              Credit Restant :
              {{ qteSms - ncreUser > 0 ? qteSms - ncreUser : 0 }}
            </div>
            <div class="col-md-3">Credits A utiliser : {{ ncreUser }}</div>
            <div class="col-md-3">
              Nombre Destinataires:
              {{ nbreDest }}
            </div>
            <div class="col-md-3">
              {{ $t('currentDate') }}: {{ dateCourante }}
            </div>
          </div>
          <q-form @submit="onSubmit">
            <div class="q-py-md q-px-lg">
              <div class="row q-col-gutter-md q-pb-md">
                <div class="col-md-6">
                  <q-select
                    autofocus
                    label="Groups List"
                    filled
                    stack-label
                    v-model="groupe"
                    :rules="[
                      (val) =>
                        val !== 'Aucun' || 'Veuillez selectionner un Groupe',
                    ]"
                    :loading="loadingGroupes"
                    :options="optionsGroupes"
                    @update:model-value="getContactForGroup"
                  />
                </div>
                <div class="col-md-6">
                  <q-select
                    autofocus
                    label="Sender ID"
                    placeholder="Selectionner un Expéditeur"
                    filled
                    v-model="senderId"
                    :loading="loadingSenderIds"
                    :options="optionsSenderIds"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-md-6">
                  <div class="q-pb-md">
                    <q-input
                      stack-label
                      filled
                      type="textarea"
                      disable
                      :input-style="{ height: 55 + 'px' }"
                      label="Contact liés"
                      placeholder="EX: STE GESSIIA"
                      :loading="loadingContact"
                      v-model="listNumContacts"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-6">
                    <q-select
                      v-model="pays"
                      filled
                      :rules="[
                        (val) =>
                          val !== 'Aucun' || 'Veuillez selectionner un pays',
                      ]"
                      :loading="loadingPays"
                      :options="optionsPays"
                      label="Pays"
                    />
                  </div>
                  <div>
                    <q-input
                      type="textarea"
                      autofocus
                      @keyup="verifMessage"
                      label="Message"
                      v-model="sms"
                      :hint="nsms"
                      placeholder="EX: Bonjour"
                      filled
                      stack-label
                    />
                  </div>
                  <div class="row text-center q-col-gutter-md q-pt-md">
                    <div class="col-md-6">
                      <q-btn
                        label="Envoyez le message"
                        type="submit"
                        color="green"
                        no-caps
                      ></q-btn>
                    </div>
                    <div class="col-md-6">
                      <q-btn
                        label="effacer"
                        @click="delette"
                        :style="{ width: 150 + 'px' }"
                        color="red"
                        no-caps
                      ></q-btn>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div>
                    <q-input
                      type="textarea"
                      autofocus
                      readonly
                      label="Visualiser le Message"
                      :hint="nsms"
                      placeholder="EX: Bonjour"
                      filled
                      stack-label
                      v-model="smsCorrect"
                    />
                  </div>
                  <div class="row q-pt-md">
                    <div class="col-md-6">
                      <q-checkbox
                        label="Programmer le Message"
                        v-model="statusProg"
                      />
                    </div>
                    <div class="col-md-6">
                      <q-input filled v-model="dateChoisit" v-if="statusProg">
                        <template v-slot:prepend>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                v-model="dateChoisit"
                                mask="YYYY-MM-DD HH:mm"
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>

                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-time
                                v-model="dateChoisit"
                                mask="YYYY-MM-DD HH:mm"
                                format24h
                              >
                                <div class="row items-center justify-end">
                                  <q-btn
                                    v-close-popup
                                    label="Close"
                                    color="primary"
                                    flat
                                  />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div></div
          ></q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { formatDate } from 'boot/formatDate';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { RequestApi } from 'boot/RequestApi';

import { Cookies } from 'quasar';

import { useMeta } from 'quasar';
import { FormatData } from '../../boot/FormatData';

const metaData = {
  // sets document title
  title: 'Envoyer sms a un groupe de contact',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'MessageGroupe',
  setup() {
    const $q = useQuasar();
    onMounted(async () => {
      await getQteSms();
      await getGroupe();
      await getSenderId();
      await getPays();
    });

    let nsms = ref('');
    let nsmsc = ref('');
    let ncara = ref(0);
    let ncreUser = ref(0);
    const smsCorrect = ref('');

    const dateCourante = formatDate(new Date());
    const dateChoisit = ref(new Date());
    const statusProg = ref(false);
    const sms = ref('');
    const clientId = ref(parseInt(Cookies.get('id')));
    let listGroupe = ref([]);
    const pays = ref({ id: 0, label: 'Aucun', routes: [{ id: 0 }] });
    const loadingPays = ref(false);
    const optionsPays = ref([{ id: 0, label: 'Aucun' }]);
    const loadingGroupes = ref(false);
    const loadingContact = ref(false);
    const groupe = ref({ id: 0, label: 'Aucun' });
    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);

    const qteSms = ref(0);
    const nbreDest = ref(0);
    const getNbreDest = () => {
      console.log('get des', listNumContacts.value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      nbreDest.value = listNumContacts.value.length;
      console.log('get des', nbreDest.value);
    };
    const getGroupe = async () => {
      loadingGroupes.value = true;
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

    const getQteSms = async () => {
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
    const getPays = async () => {
      loadingPays.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getPaysAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsPays.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            routes: x.routes,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.nom,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des pays',
          type: 'negative',
        });
      }
      loadingPays.value = false;
    };
    let listSenderId = ref([]);
    const loadingSenderIds = ref(true);
    const senderId = ref({ id: 0, label: 'Aucun' });
    const optionsSenderIds = ref([{ id: 0, label: 'Aucun' }]);
    const listNumContacts = ref();

    const getSenderId = async () => {
      loadingSenderIds.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getSenderIdsAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsSenderIds.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.senderId,
          };
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des groupes',
          type: 'negative',
        });
      }
      loadingSenderIds.value = false;
    };

    const getContactForGroup = async () => {
      loadingContact.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getActionContactForGroup(
        groupe.value.id.toString()
      );
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        listNumContacts.value = response.data.map((x: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          console.log('voici .....', x.contact.phone);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return x.contact.phone;
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        console.log('voici .....', listNumContacts.value.join(','));
        getNbreDest();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des contacts du groupes',
          type: 'negative',
        });
      }
      loadingContact.value = false;
    };

    const createLotAction = async (requestType: number, datas: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; data: any[] } = {
        status: true,
        data: [],
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (requestType === 1) {
        await api
          .post('/api/lots', datas)
          .then(async (response) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dataRes = {
              status: true,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              data: [response.data['@id']],
            };
            if (statusProg.value) {
              var creationClendrier = await createCalendarAction();
              if (creationClendrier.status) {
                await createlistLotCalendarAction(
                  creationClendrier.idld,

                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  response.data['@id']
                );
              }
            }
          })
          .catch(() => {
            dataRes = {
              status: false,
              data: [],
            };
          });
      }
      return dataRes;
    };
    const createCalendarAction = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; idld: string } = {
        status: true,
        idld: '',
      };
      let datas = {
        dateExecution: dateChoisit.value,
        frequence: 1,
        clientId: clientId.value,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      await api
        .post('/api/calendriers', datas)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes = {
            status: true,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            idld: response.data['@id'],
          };
        })
        .catch(() => {
          dataRes = {
            status: false,
            idld: '',
          };
        });

      return dataRes;
    };

    const createlistLotCalendarAction = async (
      calendrier: string,
      lot: string
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; idld: string } = {
        status: true,
        idld: '',
      };
      let datas = {
        calendrier: calendrier,

        lot: lot,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call

      await api
        .post('/api/list_lot_calendriers', datas)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes = {
            status: true,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            idld: response.data['@id'],
          };
        })
        .catch(() => {
          dataRes = {
            status: false,
            idld: '',
          };
        });

      return dataRes;
    };

    const createSmsAction = async (requestType: number, datas: object) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; data: any[] } = {
        status: true,
        data: [],
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (requestType === 1) {
        await api
          .post('/api/sms', datas)
          .then((response) => {
            dataRes = {
              status: true,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              data: [response.data['@id']],
            };
          })
          .catch(() => {
            dataRes = {
              status: false,
              data: [],
            };
          });
        //await createSmsByRouteAction(1, senderId.value);
      }
      return dataRes;
    };
    // const onSubmit = async () => {
    //   // let datas1 = {
    //   //   requestType: 1,
    //   //   senderId: senderId.value,
    //   // };

    //   if (pays.value.id === 0) {
    //     $q.notify({
    //       message: 'Le pays est requis',
    //       type: 'info',
    //     });
    //     return 0;
    //   }

    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment

    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   let response3: any = await createLotAction(1, {});
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

    //   console.log(pays.value);
    //   if (response3.status) {
    //     let dataSms = {
    //       message: smsCorrect.value,
    //       status: true,
    //       clientId: clientId.value,
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //       senderId: senderId.value.id.toString(),
    //       listSmsLotsEnvoyes: [
    //         {
    //           status: true,
    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access

    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    //           lot: response3.data[0],
    //           groupeContact: groupe.value.id,
    //           routeListSmsLotsEnvoyes: [
    //             {
    //               // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //               routeId: pays.value.routes[0].id,
    //             },
    //           ],
    //         },
    //       ],
    //     };
    //     console.log(dataSms);
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     let response4: any = await createSmsAction(1, dataSms);
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //     if (response4.status) {
    //       $q.notify({
    //         message: 'Message envoyer avec success.',
    //         type: 'positive',
    //       });
    //     } else {
    //       $q.notify({
    //         message: "Une erreur est survenu lors de l'operation.",
    //         type: 'negative',
    //       });
    //     }
    //   } else {
    //     $q.notify({
    //       message: "Une erreur est survenu lors de l'operation.",
    //       type: 'negative',
    //     });
    //   }
    // };

    const onSubmit = async () => {
      let datas1 = {
        requestType: 1,
        senderId: senderId.value,
      };

      if (pays.value.id === 0) {
        $q.notify({
          message: 'Le pays est requis',
          type: 'info',
        });
        return 0;
      }
      let dataSms = statusProg.value
        ? {
            keySecret: Cookies.get('keySecret'),
            groupeContact: groupe.value.id.toString().split('/')[3],
            route: pays.value.routes[0].id,
            senderId: senderId.value,
            message: smsCorrect.value,
            calendrier: dateChoisit.value,
          }
        : {
            keySecret: Cookies.get('keySecret'),
            groupeContact: groupe.value.id.toString().split('/')[3],
            route: pays.value.routes[0].id,
            senderId: senderId.value,
            message: smsCorrect.value,
          };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response1: any = await new RequestApi().newMessageAction(dataSms);

      if (response1.status) {
        $q.notify({
          message: 'Message Envoye.',
          type: 'positive',
        });
      } else {
        $q.notify({
          message: "Une erreur est survenu lors de l'operation.",
          type: 'negative',
        });
      }
    };
    const search = ref('');
    const delette = () => {
      sms.value = '';

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      senderId.value = { id: 0, label: 'Aucun' };
      groupe.value = { id: 0, label: 'Aucun' };
      pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0 }] };
    };

    // const verifMessage = () => {
    //   smsCorrect.value = sms.value;
    //   let taille = sms.value.split('').length;
    //   for (var i = 0; i < taille; i++) {
    //     const blocked = ref(['<', '<?', '!', '{', '}', '?>', '$']);
    //     blocked.value.forEach((string) => {
    //       if (smsCorrect.value.includes(string))
    //         smsCorrect.value = smsCorrect.value.replace(string, ' ');
    //     });
    //     console.log('1111', smsCorrect.value);
    //   }
    // };

    const verifMessage = () => {
      ncara.value = sms.value.split('').length;
      ncreUser.value = nbreDest.value * Math.ceil(ncara.value / 159);

      nsms.value = Math.ceil(ncara.value / 159)
        .toString()
        .concat(' Message(s) pour ')
        .concat(ncara.value.toString())
        .concat(' Caractere(s)');
      smsCorrect.value = new FormatData().verifMessage(sms.value);
      nsmsc.value = Math.ceil(smsCorrect.value.split('').length / 159)
        .toString()
        .concat(' Message(s) pour ')
        .concat(smsCorrect.value.split('').length.toString())
        .concat(' Caractere(s)');
      console.log('****', smsCorrect.value);
    };
    useMeta(metaData);

    return {
      search,
      listGroupe,
      selectGroupe: ref(null),
      optionsGroupes,
      loadingGroupes,
      listNumContacts,
      loadingContact,
      getGroupe,
      groupe,
      statusProg,
      getContactForGroup,
      listSenderId,
      selectSenderId: ref(null),
      optionsSenderIds,
      loadingSenderIds,
      getSenderId,
      onSubmit,
      senderId,
      sms,
      smsCorrect,
      delette,
      verifMessage,
      getNbreDest,
      nbreDest,
      qteSms,
      pays,
      optionsPays,
      loadingPays,
      dateChoisit,
      dateCourante,
      ncara,
      ncreUser,
      nsms,
      nsmsc,
    };
  },
});
</script>
