<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t("transactions.title") }}</div>
        <div class="text-caption">
         {{ $t("transactions.subtitle") }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div
          class="border-radius-inherit"
              >
          <div class="bg-grey-9 q-py-sm q-pl-sm text-grey-4 text-subtitle1">
           {{ $t("transactions.l") }}
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

// import { api } from 'boot/axios';
import { useQuasar, /* Cookies */ } from 'quasar';

import { RequestApi } from 'boot/RequestApi';

// import { refreshAuthenticated } from 'boot/refreshAuthenticated';

const columns = [
  {
    name: 'expediteur',
    required: true,
    label: 'Nom Expéditeur',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { expediteur: any }) => row.expediteur,
    sortable: true,
  },
  {
    name: 'date',
    align: 'center',
    label: 'Date(s)',
    field: 'date',
    sortable: true,
  },
  {
    name: 'destinataire',
    required: true,
    label: 'Destinataire',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { destinataire: any }) => row.destinataire,
    sortable: true,
  },
  {
    name: 'sms',
    align: 'center',
    label: 'Message',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { message: any }) => row.message,

    sortable: true,
  },
  {
    name: 'quantite',
    align: 'center',
    label: 'qté',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { quantite: any }) => row.quantite,

    sortable: true,
  },
  {
    name: 'status',
    align: 'center',
    label: 'état',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { status: any }) => row.status,

    sortable: true,
  },
];

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Gestion des transactions',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'Transactions',

  setup() {
    onMounted(async () => {
      await getSms();
    });
    const rows = ref([
      {
        expediteur: 'aucun',
        date: '',
        destinataire: 'Aucun',
        message: 'Aucun',
        quantite: '',
        status: 'Reussi',
      },
    ]);
    const $q = useQuasar();
    const search = ref('');
    const nom = ref('');
    const description = ref('');
    const nomcontact = ref('');
    let listGroupe = ref([]);
    let loading = ref(true);
    const numero = ref('');

    const getSms = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getListLotSmsEnvoyeAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          if (rows.value.length < 5) {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              expediteur: x.senderId,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              date: x.date,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              destinataire: x.destinataire,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              message: x.message,
              quantite: 1,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              status: x.status ? 'Reussi' : 'Echec',
            };
          }
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des sms',
          type: 'negative',
        });
      }
      loading.value = false;
    };

    useMeta(metaData);


    return {
      search,
      nom,
      rows,
      columns,
      description,
      numero,
      listGroupe,
      selectGroupe: ref(null),
      nomcontact,
loading,
      promptGroupe: ref(false),
      promptContact: ref(false),
      date: ref('2019-02-01 12:44'),
    };
  },
});
</script>
