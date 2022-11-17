<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4"> {{ $t('contact.title') }}</div>
        <div class="text-caption">
         {{ $t('contact.subtitle') }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-form @submit="newContact">
          <div class="row q-col-gutter-md">
            <div class="col-md-4">
              <q-input
                filled
                label="Nom:"
                autofocus
                placeholder="Entrer un nom"
                v-model="nom"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-4">
              <q-input
                filled
                label="Prenom:"
                v-model="prenom"
                placeholder="Entrer un prenom"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-4">
              <q-input
                filled
                v-model="numero"
                label="Telephone:"
                placeholder="Entrer un numero de telephone"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-4">
              <q-input
                filled
                v-model="mail"
                label="Email:"
                placeholder="Entrer une addresse mail"
                stack-label
                :dense="dense"
              />
            </div>
            <div class="col-md-4">
              <q-input filled v-model="dateChoisit" >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="dateChoisit" mask="YYYY-MM-DD HH:mm">
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
              </q-input>
            </div>
            <div class="col-md-4">
              <q-select
                filled
                label="Groupe:"
                v-model="groupe"
                :rules="[
                  (val) => val !== 'Aucun' || 'Veuillez selectionner un Groupe',
                ]"
                :loading="loadingGroupes"
                :options="optionsGroupes"
              />
            </div>
          </div>

          <div class="text-right q-pt-md">
            <q-btn
              label="Enregistrer ce contact"
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
  title: 'Ajouter un contact',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'NewContact',
  setup() {
    onMounted(async () => {
      console.log('voici parun', /^\d+$/.test('690*-'));
      await getGroupe();
    });

    const $q = useQuasar();
    const nom = ref('');

    const prenom = ref('');

    const mail = ref('');
    const dateChoisit = ref(new Date());

    const numero = ref('');

    const groupe = ref({ id: 0, label: 'Aucun' });
    const search = ref('');
    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);

    const loadingGroupes = ref(false);
    const loadingSave = ref(false);

    const newContact = async () => {
      if (
        nom.value.length != 0 &&
        prenom.value.length != 0 &&
        numero.value.length != 0 /*  &&mail.value.length != 0 */
      ) {
        if (/^\d+$/.test(numero.value)) {
          const contact = {
            nom: nom.value,
            prenom: prenom.value,
            phone: numero.value,
            // email:mail.value,
            phoneCode: '+237',
            attribute: 'string',
            clientId: parseInt(Cookies.get('id')),
            birdDay:dateChoisit.value
          };

          loadingSave.value = true;
          await api
            .post('/api/contacts', contact)
            .then(async (response) => {
              console.log(
                'contact enregistre avec success.',
                response.data['@id']
              );

              if (groupe.value.id === 0) {
                $q.notify({
                  message: 'contact enregistre avec success.',
                  type: 'positive',
                });
              } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                await addContacttoGroupe(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  response.data['@id'],
                  groupe.value.id.toString()
                );
              }
              loadingSave.value = false;

              nom.value = '';

              prenom.value = '';

              mail.value = '';

              numero.value = '';

              search.value = '';
            })
            .catch((response) => {
              console.log('Erreur enregistrement contact', response);
              loadingSave.value = false;
              $q.notify({
                message: 'Erreur enregistrement contact.',
                type: 'negative',
              });
            });
        } else {
          $q.notify({
            message: 'Veuillez entrer un numero correct',
            type: 'negative',
          });
        }
      } else {
        $q.notify({
          message: 'Veuillez entrer des informations correctes',
          type: 'negative',
        });
      }
    };

    const addContacttoGroupe = async (contactId: string, groupeId: string) => {
      const groupe = {
        contact: contactId,
        groupeContact: groupeId,
      };
      await api
        .post('/api/list_groupe_contacts', groupe)
        .then((response) => {
          console.log('contact enregistre avec success.', response.data);

          $q.notify({
            message: 'contact enregistre avec success.',
            type: 'positive',
          });

          nom.value = '';

          prenom.value = '';

          mail.value = '';

          numero.value = '';

          search.value = '';
        })
        .catch((response) => {
          console.log('Erreur enregistrement contact ', response);

          $q.notify({
            message: 'Erreur enregistrement contact dans le groupe.',
            type: 'negative',
          });
        });
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
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des groupes',
          type: 'negative',
        });
      }
      loadingGroupes.value = false;
    };

    useMeta(metaData);

    return {
      search,
      optionsGroupes,
      loadingGroupes,
      getGroupe,
      groupe,
      nom,
      prenom,
      mail,
      numero,
      newContact,
      loadingSave,
      dateChoisit,
    };
  },
});
</script>
