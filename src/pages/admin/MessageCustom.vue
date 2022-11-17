/* eslint-disable @typescript-eslint/no-unsafe-call */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">
          {{ $t('messagePersonnalise.title') }}
        </div>
        <div class="text-caption">
          {{ $t('messagePersonnalise.subtitle') }}
        </div>
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
              {{ $t('currentDate') }}: 23 Mar 2022 12:03
            </div>
          </div>
          <div class="q-py-md q-px-lg">
            <q-form @submit="onSubmit">
              <div class="row q-col-gutter-md">
                <div class="col-md-6">
                  <div class="q-pb-md">
                    <q-file
                      clearable
                      use-chips
                      filled
                      bottom-slots
                      v-model="csv"
                      hint="NB: le Fichier doit contenir le nom des colonnes en entête et la premiere entete phone contenant les numeros "
                      label="Veuillez importer votre fichier"
                      accept=".csv"
                      counter
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>

                      <template v-slot:hint> cliquer pour importer </template>
                    </q-file>
                  </div>
                  <div class="q-pb-md">
                    <q-btn
                      label="Télécharger"
                      color="green"
                      class="full-width"
                      @click="csvConvert"
                      :loading="loadingGetCsv"
                      no-caps
                    ></q-btn>
                  </div>
                  <div class="q-pb-md">
                    <q-select
                      stack-label
                      placeholder="Selectionnez un expediteur"
                      filled
                      label="Nom de l'expediteur"
                      v-model="senderId"
                      :loading="loadingSenderIds"
                      :options="optionsSenderIds"
                    >
                    </q-select>
                  </div>
                  <div class="q-pb-md">
                    <q-select
                      stack-label
                      filled
                      label="Inserer les variables"
                      v-model="headerChoise"
                      :options="Header"
                      @change="
                        (val) => {
                          add();
                        }
                      "
                    >
                    </q-select>
                  </div>
                  <div class="q-pb-md">
                    <q-btn
                      label="Inserer"
                      color="green"
                      class="full-width"
                      @click="add"
                      no-caps
                    ></q-btn>
                  </div>
                  <div>
                    <q-input
                      type="textarea"
                      autofocus
                      label="Message"
                      @keyup="verifMessage"
                      :hint="nsms"
                      placeholder="EX: Bonjour"
                      filled
                      stack-label
                      v-model="sms"
                    />
                  </div>
                  <div class="row text-center q-col-gutter-md q-pt-md">
                    <div class="col-md-6">
                      <q-btn
                        label="Envoyez le message"
                        color="green"
                        type="submit"
                        no-caps
                      ></q-btn>
                    </div>
                    <div class="col-md-6">
                      <q-btn
                        label="effacer"
                        :style="{ width: 150 + 'px' }"
                        color="red"
                        @click="delette"
                        no-caps
                      ></q-btn>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="q-pb-md">
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
                  <div class="q-pb-md">
                    <q-input
                      stack-label
                      filled
                      type="textarea"
                      v-model="listNumContacts"
                      disable
                      :input-style="{ height: 55 + 'px' }"
                      label="Contact liés"
                      placeholder="EX: STE GESSIIA"
                    >
                    </q-input>
                  </div>
                  <div>
                    <q-input
                      type="textarea"
                      readonly
                      v-model="smsCorrect"
                      label="Visualiser le Message"
                      :hint="nsmsc"
                      placeholder="EX: Bonjour"
                      filled
                      stack-label
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
                </div></div
            ></q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { useQuasar } from 'quasar';
import { RequestApi } from 'boot/RequestApi';
import { parse } from 'papaparse';
import { formatDate } from 'boot/formatDate';
import { FormatData } from '../../boot/FormatData';

import { api } from 'boot/axios';
import { Cookies } from 'quasar';
import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Envoyer sms personnalise',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'MessageCustom',
  setup() {
    const search = ref('');
    const $q = useQuasar();
    onMounted(async () => {
      await getQteSms();
      await getPays();
      await getSenderId();
      // await getGroupe();
    });
    const smsCorrect = ref('');

    const statusProg = ref(false);
    const clientId = ref(parseInt(Cookies.get('id')));
    const dateChoisit = ref(new Date());

    const dateCourante = formatDate(new Date());
    const loadingPays = ref(false);
    const pays = ref({ id: 0, label: 'Aucun', routes: [{ id: 0 }] });
    const optionsPays = ref([{ id: 0, label: 'Aucun' }]);
    const sms = ref('');
    const csv = ref();
    const listData = ref();
    let listSenderId = ref([]);
    const loadingSenderIds = ref(true);
    const loadingGetCsv = ref(false);
    const senderId = ref({ id: 0, label: 'Aucun' });
    let headerChoise = ref({ label: '' });
    const optionsSenderIds = ref([{ id: 0, label: 'Aucun' }]);
    let Header = ref([{ label: 'Aucun' }]);
    let ncara = ref(0);
    let ncreUser = ref(0);

    let nsms = ref('');
    let nsmsc = ref('');
    const listNumContacts = ref();

    const qteSms = ref(0);
    const nbreDest = ref(0);
    const getNbreDest = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      nbreDest.value =
        listNumContacts.value == ''
          ? 0
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          listNumContacts.value.split(';')[
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              listNumContacts.value.split(';').length - 1
            ] == ''
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            listNumContacts.value.split(';').length - 1
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            listNumContacts.value.split(';').length;
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
      // console.log('get pays statu', response.status);
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
    const createContactAction = async (
      requestType: number,
      contact: string,
      clientId: number
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; data: any[] } = {
        status: true,
        data: [],
      };
      if (requestType === 1) {
        let data = {
          phone: contact,
          clientId: clientId,
        };
        await api
          .post('/api/contacts', data)
          .then((response) => {
            dataRes.status = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            dataRes.data.push(response.data['@id']);
          })
          .catch(() => {
            dataRes.status = false;
          });
      }
      console.log('contact', contact);
      return dataRes;
    };

    const findContactAction = async (
      requestType: number,
      contact: string,
      clientId: number
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; data: any[] } = {
        status: true,
        data: [],
      };
      if (requestType === 1) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let res1: any[] = [];
        await api
          .get(
            '/api/contacts?phone='
              .concat(contact)
              .concat('&clientId=')
              .concat(clientId.toString())
          )
          .then((response) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            res1 = response.data['hydra:member'];
            dataRes.status = true;
          })
          .catch(() => {
            dataRes.status = false;
          });
        if (dataRes.status) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (res1.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let tempDataRes: { status: boolean; data: any[] } =
              await createContactAction(1, contact, clientId);
            if (tempDataRes.status) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              dataRes.data.push({ contact: tempDataRes.data[0] });
            } else {
              dataRes.status = false;
            }
          } else {
            dataRes.status = true;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            dataRes.data.push({ contact: res1[0]['@id'] });
          }
        }
      }
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

    const startCreateSms = async (message: string, contact: string) => {
      if (pays.value.id === 0) {
        $q.notify({
          message: 'Le pays est requis',
          type: 'info',
        });
        return 0;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response2: any = await findContactAction(1, contact, clientId.value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let response3: any = await createLotAction(1, {});

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(response2.status, response3.status);
      console.log(pays.value);
      if (response2.status && response3.status) {
        let dataSms = {
          message: smsCorrect.value,
          status: true,
          clientId: clientId.value,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          senderId: senderId.value.id,
          listSmsLotsEnvoyes: [
            {
              status: true,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
              listSmsContacts: response2.data,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
              lot: response3.data[0],
              routeListSmsLotsEnvoyes: [
                {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  routeId: pays.value.routes[0].id,
                },
              ],
            },
          ],
        };
        console.log(dataSms);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response4: any = await createSmsAction(1, dataSms);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (response4.status) {
          $q.notify({
            message: 'Message envoyer avec success.',
            type: 'positive',
          });
        } else {
          $q.notify({
            message: "Une erreur est survenu lors de l'operation.",
            type: 'negative',
          });
        }
      } else {
        $q.notify({
          message: "Une erreur est survenu lors de l'operation.",
          type: 'negative',
        });
      }
    };

    const csvConvert = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const file =
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // readFileSync('xcxc', 'utf8');
      loadingGetCsv.value = true;
      Header.value.pop();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // interface formatTypeEntete = {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      parse<
        []
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      >(csv.value, {
        delimiter: ',',

        complete: (result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          var en = result.data[0].toString().split(';');

          Header.value = en.map((x: string) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label: x,
            };
          });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          listNumContacts.value = result.data.map((x: string[]) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return x[0].split(';')[0];
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          listNumContacts.value.shift();
          listData.value = result.data.map((x) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return x.toString().split(';');
          });
          getNbreDest();
          // listData.value.shift();

          // console.log(listData.value[1]);

          // for (var i = 1; i < result.data.length; i++) {
          //   console.log(result.data[i]);
          // }
          loadingGetCsv.value = false;
        },
      });
    };
    const add = () => {
      console.log(sms.value);
      console.log(headerChoise.value.label);
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      sms.value = sms.value + ' ' + '#' + headerChoise.value.label + ' ';
    };
    // var a = '';
    let listFinal: [string, string][] = [];
    const onSubmit = async () => {
      // let e = 0;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      listData.value.shift();
      for (let j = 0; j < listData.value.length; j++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (listData.value[j] != '') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          check(j, listData.value[j]);
        }
        // listFinal.push(message.value);
      }

      console.log(listFinal);
      for (let j = 0; j < listFinal.length; j++) {
        await startCreateSms(listFinal[j][0], listFinal[j][1]);
      }
      // console.log(sms.value);
    };

    const check = (j: number, data: string[]) => {
      // let e = 0;
      let message = ref('');
      message.value = sms.value;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      console.log(j);
      for (var i = 0; i < Header.value.length; i++) {
        console.log(data, data.length);
        if (
          message.value.includes('#' + Header.value[i].label)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ) {
          let re = '#' + Header.value[i].label;

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          message.value = message.value.replace(
            re,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            data[i]
          );
          // console.log(listData.value[j][i]);
        }
      }

      listFinal.push([message.value, data[0]]);

      // console.log(listFinal);
      // console.log(sms.value);
    };
    const delette = () => {
      sms.value = '';

      listNumContacts.value = [];
      csv.value = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      senderId.value = { id: 0, label: 'Aucun' };
      Header.value = [{ label: 'Aucun' }];
      headerChoise.value = { label: 'Aucun' };
      pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0 }] };
    };


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
      listSenderId,
      csv,
      sms,
      headerChoise,
      selectSenderId: ref(null),
      optionsSenderIds,
      Header,
      loadingGetCsv,
      loadingSenderIds,
      add,
      statusProg,
      csvConvert,
      listNumContacts,
      senderId,
      search,
      date: ref('2019-02-01 12:44'),

      getNbreDest,
      nbreDest,
      pays,
      loadingPays,
      optionsPays,
      qteSms,
      dateChoisit,
      delette,
      dateCourante,
      onSubmit,
      startCreateSms,
      ncara,
      verifMessage,
      ncreUser,
       nsms,
      nsmsc,
      smsCorrect,

    };
  },
});
</script>
