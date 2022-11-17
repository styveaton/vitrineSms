<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('first.title') }}</div>
        <div class="text-caption">{{ $t('first.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="border-radius-inherit">
          <div class="bg-grey-9 row q-py-sm q-px-sm text-grey-4">
            <div class="col-md-6 text-subtitle1">
              {{ $t('first.recent') }}
            </div>
            <div class="col-md-6 text-right">
              <q-btn label="" color="grey" :to="{ name: 'Transactions' }" icon-right="add" no-caps>{{
              $t('first.seemore') }}</q-btn>
            </div>
          </div>
          <div class="q-py-lg q-pa-sm">
            <q-table separator="cell" :rows="rows" :columns="columns" row-key="name" :hide-pagination="true" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { useQuasar } from 'quasar';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Liste de Sms',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
import { RequestApi } from 'boot/RequestApi';
const columns = [
  {
    name: 'destinataire',
    required: true,
    label: 'Destinataire',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { contact: any }) => row.contact,
    sortable: true,
  },
  {
    name: 'Sender',
    align: 'center',
    label: 'Sender',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { senderId: any }) => row.senderId,

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
    name: 'status',
    align: 'center',
    label: 'état',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { status: any }) => row.status,

    sortable: true,
  },
];

export default defineComponent({
  name: 'Manager',
  setup() {
    const search = ref('');

    onMounted(async () => {
      await getSms();
    });
    const sms = ref({ id: 0, label: 'Aucun' });
    const rows = ref([
      {
        destinataire: '',
        senderId: '',
        message: '',
        status: '',
      },
    ]);

    let listSms = ref([]);
    const loadingSms = ref(false);
    const $q = useQuasar();

    const getSms = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      const response: any = await new RequestApi().getSmsActionCustom();

      if (response.status) {
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        // rows.value = response.data.map((x: any) => {
        //   if (rows.value.length < 5) {
        //     return {
        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //       destinataire: x.destinataire,
        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //       message: x.message,
        //       quantite: 1,
        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        //       status: x.status ? 'Reussi' : 'Echec',
        //     };
        //   }
        // });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data;
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des sms',
          type: 'negative',
        });
      }
      // loadingGroupes.value = false;
    };

    useMeta(metaData);

    return {
      search,
      rows,
      columns,
      listSms,
      loadingSms,
      sms,
    };
  },
});
</script>
