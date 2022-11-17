/* eslint-disable @typescript-eslint/no-unsafe-argument */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('messageCron.title') }}</div>
        <div class="text-caption">
          {{ $t('messageCron.subtitle') }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="text-right q-pb-md">
          <q-btn
            :to="{ name: 'MessageIndividuel' }"
            label="Ajouter"
            color="green"
            icon-right="add"
            no-caps
          ></q-btn>
        </div>
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm q-pl-sm text-grey-4 text-subtitle1">
            SMS Programmés en Attente
          </div>
          <div class="q-py-lg q-px-sm">
           <q-inner-loading v-if="loading" :showing="loading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
            <q-table
              v-else
              separator="cell"
              :rows="rows"
              :columns="columns"
              row-key="name"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

// import { refreshAuthenticated } from 'boot/refreshAuthenticated';
import { Cookies } from 'quasar';

const columns = [
  // {
  //   name: 'expediteur',
  //   required: true,
  //   label: 'Utilisateur',
  //   align: 'left',
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
  //   field: (row: { expediteur: any; }) => row.expediteur,
  //   sortable: true
  // },
  {
    name: 'senderId',
    align: 'center',
    label: 'Sender',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { sender: any }) => row.sender,
    sortable: true,
  },
  {
    name: 'date',
    align: 'center',
    label: 'Date(s) Programmée',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { date: any }) => row.date,

    sortable: true,
  },
  // {
  //   name: 'destinataire',
  //   align: 'center',
  //   label: 'Destinataire',
  //   field: 'destinataire',
  //   sortable: true,
  // },
  {
    name: 'sms',
    align: 'center',
    label: 'Message',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { message: any }) => row.message,

    sortable: true,
  },
];

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Sms programme',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'MessageCron',

  setup() {
    onMounted(async () => {
      await getSmsProg();
    });
    // const $q = useQuasar();
    const search = ref('');
    const nom = ref('');
    const description = ref('');
    const nomcontact = ref('');
    let loading = ref(true);

    const clientId = parseInt(Cookies.get('id'));
    const rows = ref([{ sender: 'Aucun', date: '', message: '' }]);

    const getSmsProg = async () => {
      await api
        .get(
          '/api/list_lot_calendriers?calendrier.clientId='.concat(
            clientId.toString()
          )
        )
        .then(async (response1) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          rows.value.pop();
          for (var i = 0; i < response1.data['hydra:member'].length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let idLot =
              //eslint-disable-next-line @typescript-eslint/no-unsafe-call
              response1.data['hydra:member'][i]['lot'].split('/')[3].toString();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let dateProgramme =
              //eslint-disable-next-line @typescript-eslint/no-unsafe-call
              response1.data['hydra:member'][i]['calendrier'][
                'dateProgramme'
              ].toString();

            await api

              .get(
                '/api/list_sms_lots_envoyes?lot='
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  .concat(idLot)
              )
              .then((response) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                let x = response.data['hydra:member'][0];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any

                rows.value.push({
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  sender: x['sms']['senderId']['senderId'],
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  date: dateProgramme,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  message: x['sms']['message'],
                });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              })
              .catch(() => {
                console.log('cv');
              });
          }
        })
        .catch(() => {
          console.log('cv');
        });
      console.log(rows.value);
      loading.value = false;

    };
    useMeta(metaData);

    return {
      search,
      nom,
      rows,
      columns,
      description,
loading,
      selectGroupe: ref(null),
      nomcontact,
      getSmsProg,
      promptGroupe: ref(false),
      promptContact: ref(false),
      date: ref('2019-02-01 12:44'),
    };
  },
});
</script>
