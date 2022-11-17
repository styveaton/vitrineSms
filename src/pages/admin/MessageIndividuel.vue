/* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable
@typescript-eslint/no-unsafe-assignment */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('messageIn.title') }}</div>
        <div class="text-caption">{{ $t('messageIn.subtitle') }}</div>
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
          <div class="q-py-md q-px-lg">
            <q-form @submit="onSubmit">
              <div class="q-pb-md">
                <q-input
                  type="textarea"
                  autofocus
                  label="Numero Destinataire"
                  v-model="destinataire"
                  @keyup="verifNumber"
                  filled
                  no-error-icon
                  hint="Ajoutez plusieurs Numeros en les separant par des points virgule (;)"
                  stack-label
                  :rules="[(val) => !!val || 'Entrer au moins un numero']"
                />
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-md-6">
                  <div class="q-pb-md">
                    <q-input
                      stack-label
                      filled
                      v-model="senderId"
                      no-error-icon
                      label="Nom de l'expéditeur"
                      placeholder="EX: STE GESSIIA"
                      :rules="[
                        (val) => !!val || 'Entrer le nom de l\'expediteur',
                      ]"
                    >
                    </q-input>
                  </div>
                  <div>
                    <q-input
                      type="textarea"
                      v-model="sms"
                      @keyup="verifMessage"
                      label="Message"
                      :hint="nsms"
                      no-error-icon
                      placeholder="EX: Bonjour"
                      filled
                      stack-label
                      :rules="[
                        (val) => !!val || 'Entrer au moins un caractere',
                      ]"
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
                        type="reset"
                        color="red"
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
                </div>
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { api } from '../../boot/axios';
import { formatDate } from '../../boot/formatDate';
import { FormatData } from '../../boot/FormatData';
import { Cookies, useQuasar } from 'quasar';
import { useMeta } from 'quasar';
import { RequestApi } from '../../boot/RequestApi';

const metaData = {
  // sets document title
  title: 'Envoyer message individuel',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'MessageIndividuel',
  methods: {},
  setup() {
    onMounted(async () => {
      await getQteSms();
      await getPays();
    });
    let nsms = ref('');
    let nsmsc = ref('');
    let ncara = ref(0);
    let ncreUser = ref(0);

    const search = ref('');
    const $q = useQuasar();
    const loadingPays = ref(false);

    const listData = ref(true);
    const dateChoisit = ref(new Date());

    const dateCourante = formatDate(new Date());
    const destinataire = ref('');
    const destinataireF = ref('');
    const pays = ref({ id: 0, label: 'Aucun', routes: [{ id: 0 }] });
    const senderId = ref('');
    const clientId = ref(parseInt(Cookies.get('id')));
    const sms = ref('');
    const qteSms = ref(0);

    const nbreDest = ref(0);
    const getNbreDest = () => {
      nbreDest.value =
        destinataire.value == ''
          ? 0
          : destinataire.value.split(';')[
              destinataire.value.split(';').length - 1
            ] == ''
          ? destinataire.value.split(';').length - 1
          : destinataire.value.split(';').length;
    };
    const smsCorrect = ref('');
    const optionsPays = ref([{ id: 0, label: 'Aucun' }]);
    //const route = ref('');
    const statusProg = ref(false);

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
    const onSubmit = async () => {
      if (
        pays.value.id === 0 ||
        sms.value.length === 0 ||
        senderId.value.length === 0
      ) {
        $q.notify({
          message: 'Veuillez remplir correctement tout les champs',
          type: 'info',
        });
        return 0;
      }

      let dataSms = statusProg.value
        ? {
            keySecret: Cookies.get('keySecret'),
            destinataire: destinataire.value.split(';'),
            route: pays.value.routes[0].id,
            senderId: senderId.value,
            message: sms.value,
            calendrier: dateChoisit.value,
          }
        : {
            keySecret: Cookies.get('keySecret'),
            destinataire: destinataire.value.split(';'),
            route: pays.value.routes[0].id,
            senderId: senderId.value,
            message: sms.value,
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
    const verifNumber = () => {
      let taille = destinataire.value.split('').length;
      ncreUser.value = nbreDest.value * Math.ceil(ncara.value / 159);

      for (var i = 0; i < taille; i++) {
        console.log(
          'f',
          parseInt(destinataire.value[i]),
          Number.isInteger(parseInt(destinataire.value[i]))
        );

        if (
          Number.isInteger(parseInt(destinataire.value[i])) ||
          destinataire.value[i] == ';'
        ) {
          console.log('pas modif', typeof parseInt(destinataire.value[i]));
        } else {
          console.log('modifi', 'number');

          destinataire.value = destinataire.value.replace(
            destinataire.value[i],
            ''
          );
        }
      }
      getNbreDest();
    };

    const delette = () => {
      sms.value = '';

      destinataire.value = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      senderId.value = '';

      pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0 }] };
    };
    useMeta(metaData);
    return {
      optionsPays,
      search,
      sms,
      getPays,
      senderId,
      smsCorrect,
      destinataire,
      statusProg,
      // eslint-disable-next-line vue/no-dupe-keys
      verifMessage,
      verifNumber,
      ncreUser,
      delette,
      getNbreDest,
      nbreDest,
      pays,
      loadingPays,
      onSubmit,
      dateChoisit,
      dateCourante,
      qteSms,
      nsms,
      ncara,
      nsmsc,
    };
  },
});
</script>
