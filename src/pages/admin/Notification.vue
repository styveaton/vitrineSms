<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">Notification</div>
        <div class="text-caption">Ajouter une nouvelle notification</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-form @submit="addNotification">
          <div class="row q-col-gutter-md q-pb-sm">
            <div class="col-md-4">
              <q-input
                filled
                label="Message:"
                autofocus
                placeholder="Entrer le message de votre notification"
                v-model="message"
                stack-label
                :dense="dense"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <q-select
                filled
                label="Type de notification"
                v-model="type"
                :rules="[
                  (val) =>
                    val !== 'Aucun' ||
                    'Veuillez selectionner un type de notifications',
                ]"
                :loading="loadingType"
                :options="optionsType"
              />
            </div>
            <!-- <div class="col-md-4">
              <q-select
                filled
                label="Model de notification"
                v-model="model"
                :rules="[
                  (val) => val !== 'Aucun' || 'Veuillez selectionner un model',
                ]"
                :loading="loadingModel"
                :options="optionsModel"
              />
            </div> -->
            <div class="col-md-4">
              <q-input
                filled
                label="Sender Name:"
                v-model="senderId"
                placeholder="Entrer un sender name"
                stack-label
                :dense="dense"
              />
            </div>

            <div class="col-md-4" v-if="type.id === 2">
              <q-select
                filled
                label="Frequence de notification"
                v-model="frequence"
                :rules="[
                  (val) =>
                    val !== 'Aucun' ||
                    'Veuillez selectionner une frequence d\'envoi de vos notifications',
                ]"
                :loading="loadingFrequence"
                :options="optionsFrequence"
              />
            </div>
            <div class="col-md-4">
              <q-input
                filled
                v-model="heure"
                label="Heure D'envoi"
                mask="time"
                :rules="['time']"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="heure">
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

          <div class="text-right q-pt-md">
            <q-btn
              label="Enregistrer le notification"
              icon-right="save"
              color="blue"
              type="submit"
              no-caps
              :loading="loadingSave"
            >
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Cookies } from 'quasar';
import { RequestApi } from 'boot/RequestApi';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Creer une nouvelle notification',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'Notification',
  setup() {
    onMounted(async () => {
      console.log('voici parun', /^\d+$/.test('690*-'));
      // await getModel();
      await getTypeNotification();
    });

    const $q = useQuasar();
    const message = ref('');

    const dateChoisit = ref(new Date());

    const senderId = ref('');

    const model = ref({ id: 0, label: 'Aucun' });
    const type = ref({ id: 0, label: 'Aucun' });
    const frequence = ref({ id: 0, label: 'Aucun' });
    const search = ref('');
    const optionsModel = ref([{ id: 0, label: 'Aucun' }]);
    const optionsType = ref([{ id: 0, label: 'Aucun' }]);
    const optionsFrequence = ref([
      { id: 1, label: 'Journaliere' },
      { id: 2, label: 'Hebdomadaire' },
      { id: 3, label: 'Week-end' },
      { id: 4, label: 'Mensuel' },
    ]);
    const heure = ref('08:00');
    const loadingModel = ref(false);
    const loadingType = ref(false);
    const loadingSave = ref(false);
    const loadingFrequence = ref(false);

    // const getModel = async () => {
    //   loadingModel.value = true;
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   const response: any = await new RequestApi().getModelAction();
    //   console.log(response.data);
    //   if (response.status) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
    //     optionsModel.value = response.data.map((x: any) => {
    //       return {
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         id: x['@id'],
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         label: x.nom,
    //       };
    //     });
    //   } else {
    //     $q.notify({
    //       message: 'Erreur lors du chargement des models',
    //       type: 'negative',
    //     });
    //   }
    //   loadingModel.value = false;
    // };

    const getTypeNotification = async () => {
      loadingModel.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await new RequestApi().getTypeNotificationAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsType.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.libelle,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des type de notification',
          type: 'negative',
        });
      }
      loadingModel.value = false;
    };
    const addNotification = async () => {
      if (type.value.id == 0) {
        $q.notify({
          message: 'Veuillez selectionner un type de notification',
          type: 'negative',
        });
      } else {
        if (
          message.value == '' ||
          senderId.value == '' ||
          (type.value.id == 2 ? frequence.value.id == 0 : false)
        ) {
          $q.notify({
            message: 'Veuillez remplir correctement tous les champs',
            type: 'negative',
          });
        } else {
          loadingSave.value = !loadingSave.value;

          let dataNotification = {
            typeNotification: '/api/type_notifications/'.concat(
              type.value.id.toString()
            ),
            clientId: parseInt(Cookies.get('id')),
            frequence: frequence.value.id,
            senderId: senderId.value,
            message: message.value,
          };

          console.log(dataNotification);

          const response = await new RequestApi().makeNotificationAction(
            dataNotification
          );
          console.log('response.status', response.status);
          if (response.status) {
            // eslint-disable-next-line require-atomic-updates
            loadingSave.value = !loadingSave.value;

            $q.notify({
              message: 'Ajout de la notification reussit',
              type: 'positive',
            });
          } else {
            loadingSave.value = !loadingSave.value;

            $q.notify({
              message: "Une erreur s'est produite",
              type: 'negative',
            });
          }
        }
      }
    };

    useMeta(metaData);

    return {
      search,
      optionsModel,
      loadingModel,
      model,
      message,
      loadingSave,
      dateChoisit,
      senderId,
      loadingType,
      optionsType,
      type,
      loadingFrequence,
      frequence,
      optionsFrequence,
      addNotification,
      heure,
    };
  },
});
</script>
