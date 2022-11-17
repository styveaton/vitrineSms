<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">Roles des utilisateurs</div>
        <div class="text-caption">
          Tout utilisateur qui exploite la plateforme peut avoir un role
          different en faonction de ce qu'il doit y faire.
          <a href="/">En savoir plus</a>
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-form @submit="createSenderIdAction">
          <div class="row q-col-gutter-md">
            <div class="col">
              Nom du role
              <q-input
                filled
                label=""
                autofocus
                placeholder="Ex: Administrateur"
                v-model="titre"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col">
              Description
              <q-input
                filled
                label=""
                v-model="description"
                placeholder="Ex: Entreprise"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col" style="margin-top: 25px">
              <q-btn
                square
                style="padding-left: 0px; padding-top: 0px; padding-bottom: 0px"
              >
                <q-avatar square style="margin-right: 25px">
                  <img src="https://cdn.quasar.dev/img/avatar.png" />
                </q-avatar>
                Choice avatar
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <div class="text-right bg-grey-5">
        <q-btn
          label="Enregistrer"
          color="blue"
          type="submit"
          no-caps
          size="11px"
          style="margin-left: 400px"
        >
        </q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Cookies } from 'quasar';
import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Creer un nouveau profil',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'NewSenderId',
  setup() {
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
    useMeta(metaData);

    return {
      search,

      status,
      titre,
      description,

      createSenderIdAction,
    };
  },
});
</script>
