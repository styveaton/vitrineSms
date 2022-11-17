<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t("senderId.title") }}</div>
        <div class="text-caption">
         {{ $t("senderId.subtitle") }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-form @submit="createSenderIdAction">
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <q-input
                filled
                label="titre:"
                autofocus
                placeholder="Entrer un titre"
                v-model="titre"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-4">
              <q-input
                filled
                label="description:"
                v-model="description"
                placeholder="Entrer un description"
                stack-label
                :dense="dense"
              />
            </div>

            <div class="q-pb-lg">
              <q-toggle v-model="status" label="Activer SenderId" />
            </div>
          </div>

          <div class="text-right q-pt-md">
            <q-btn
              label="Enregistrer ce senderId"
              icon-right="save"
              color="blue"
              type="submit"
              no-caps
            >
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card >
      <q-card style="margin-top:20px">
      <q-card-section>
        <div class="text-h4"> {{ $t("senderId.l") }}</div>
        <div class="text-caption">

        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
 <div class="q-py-lg q-px-sm">
            <q-table
              separator="cell"
              :rows="rows"
              :columns="columns"
              row-key="name"
            />
          </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Cookies } from 'quasar';
import { RequestApi } from 'src/boot/RequestApi';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Creer un nouveau senderId',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'NewSenderId',
  setup() {
    onMounted(async () => {
      await getListSenderId();
    });
    const columns = [
  {
    name: 'libelle',
    required: true,
    label: 'Libelle',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { libelle: any }) => row.libelle,
    sortable: true,
  },
 
  {
    name: 'description',
    required: true,
    label: 'Description',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { description: any }) => row.description,
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
    name: 'status',
    align: 'center',
    label: 'état',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { status: any }) => row.status,

    sortable: true,
  },
];const rows = ref([
      {
        libelle: 'aucun',
       
      
        description: 'Aucun',
         date: '',
        status: 'Reussi',
      },
    ]);

    const $q = useQuasar();
    const titre = ref('');

    const description = ref('');

    const status = ref(true);

    const search = ref('');

    const clientId = parseInt(Cookies.get('id'));

    const createSenderIdAction = async () => {
      let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

      let dataSenderId = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        senderId: titre.value,
        description: description.value,
        status: status.value,
        clientId: clientId,
      };

      await api
        .post('/api/sender_ids', dataSenderId)
        .then((response1) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes = {
            status: true,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data: <[]>response1.data,
          };
          $q.notify({
            message: 'SenderId cree avec success.',
            type: 'positive',
          });
          console.log('xxxxxxxxxxx cas................', response1.data);
        })
        .catch(() => {
          dataRes = {
            status: false,
            data: [],
          };
          $q.notify({
            message: 'Erreur de creation de SenderId.',
            type: 'negative',
          });
        });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return dataRes;
    };
    
    const getListSenderId= async () => {
      rows.value.pop();
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getSenderIdsAction();
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
      console.log(x);
           
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              libelle: x.senderId,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              date: x.dateCreated,
              
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              description: x.description,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              status: x.status ? 'Reussi' : 'Echec',
            };
          
        });
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

      status,
      titre,
      description,
columns,rows,
      createSenderIdAction,
    };
  },
});
</script>
