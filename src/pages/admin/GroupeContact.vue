<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('groupe.title') }}</div>
        <div class="text-caption">{{ $t('groupe.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="text-right q-pb-md">
          <q-btn
            label="Ajouter un groupe"
            color="green"
            icon-right="add"
            no-caps
            @click="promptGroupe = !promptGroupe"
          ></q-btn>
          <q-dialog v-model="promptGroupe">
            <q-card style="min-width: 500px; min-height: 250px">
              <q-card-section>
                <div class="text-h6">Nouveau groupe</div>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-md">
                <div class="q-pb-md">
                  <q-input
                    filled
                    stack-label
                    label="Nom"
                    v-model="nom"
                    placeholder="Ex: Bopda"
                    dense
                    autofocus
                  />
                </div>
                <div>
                  <q-input
                    type="textarea"
                    v-model="description"
                    filled
                    stack-label
                    label="Description"
                    dense
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  flat
                  label="sauvegarder"
                  type="submit"
                  @click="newGroupe"
                  color="green"
                  icon-right="save"
                  no-caps
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          &nbsp;
          <q-btn
            label="Ajouter un Contact"
            color="green"
            icon-right="add"
            no-caps
            @click="promptContact = !promptContact"
          ></q-btn>
          <q-dialog v-model="promptContact">
            <q-card style="min-width: 500px; min-height: 300px">
              <q-card-section>
                <div class="text-h6">{{ $t('  contact.title') }}</div>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-md">
                <div class="q-pb-md">
                  <q-input
                    filled
                    stack-label
                    v-model="nomcontact"
                    label="Nom"
                    placeholder="Ex: Bopda"
                    dense
                    autofocus
                  />
                </div>
                <div class="q-pb-md">
                  <q-input
                    filled
                    stack-label
                    v-model="numero"
                    label="Numero"
                    placeholder="Ex: 600000000"
                    dense
                  />
                </div>
                <div>
                  <q-select
                    filled
                    label="Groupe:"
                    v-model="groupe"
                    :rules="[
                      (val) =>
                        val !== 'Aucun' || 'Veuillez selectionner un Groupe',
                    ]"
                    :loading="loadingGroupes"
                    :options="optionsGroupes"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  flat
                  label="sauvegarder"
                  @click="newContact"
                  color="green"
                  icon-right="save"
                  no-caps
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
            {{ $t('groupe.l') }}
          </div>
          <div class="q-py-lg q-px-sm">
            <q-inner-loading v-if="loadingGroupes"  :showing="loadingGroupes">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
            <q-table
              v-else
              separator="cell"
              :rows="rows"
              :columns="columns"
              row-key="name"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="nom" :props="props">
                    {{ props.row.nom }}
                  </q-td>

                  <q-td>
                    <center>
                      <q-btn
                        label="Voir Plus"
                        size="sm"
                        @click="groupeInformations(props.row.id, props.row.nom)"
                      ></q-btn>
                    </center>
                    <q-dialog v-model="promptAjoutGroupe">
                      <q-card>
                        <q-card-section class="q-pt-none">
                          <div class="q-pb-md">
                            Selectionner le contact a ajouter au groupe
                            {{ props.row.nom }}
                          </div>

                          <div>
                            <q-select
                              filled
                              label="List Contact"
                              v-model="contact"
                              :rules="[
                                (val) =>
                                  val !== 'Aucun' ||
                                  'Veuillez selectionner un Groupe',
                              ]"
                              :loading="loadingGroupes"
                              :options="optionsContacts"
                            />
                          </div>
                        </q-card-section>

                        <q-card-actions align="right" class="text-primary">
                          <q-btn
                            flat
                            label="Ajouter a Groupe"
                            @click="
                              addContacttoGroupe(contact.id, selectGroupId)
                            "
                            color="green"
                            icon-right="save"
                            no-caps
                            v-close-popup
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                  </q-td>
                </q-tr> </template
            ></q-table>
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

import { RequestApi } from 'boot/RequestApi';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';
import { Cookies } from 'quasar';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Configurez vos groupes de contact',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
const columns = [
  {
    name: 'nom',
    required: true,
    label: 'Nom du groupe',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'nom',
    sortable: true,
  },

  {
    name: 'action',
    align: 'center',
    label: 'Action',
    field: 'action',
    sortable: true,
  },
];

export default defineComponent({
  name: 'GroupeContact',

  setup() {
    onMounted(async () => {
      await getGroupe();
      await getListContacts();
    });
    const groupe = ref({ id: 0, label: 'Aucun' });
    const contact = ref({ id: 0, label: 'Aucun' });
    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);
    const optionsContacts = ref([{ id: 0, label: 'Aucun' }]);

    const rows = ref([{ id: 0, nom: 'Aucun', Action: '...' }]);
    const promptGroupe = ref(false);
    const promptAjoutGroupe = ref(false);
    const loadingGroupes = ref(true);
    const $q = useQuasar();
    const search = ref('');
    const nom = ref('');
    const selectGroupId = ref(0);
    const description = ref('');
    const nomcontact = ref('');
    let listGroupe = ref([]);
    let er = false;
    const numero = ref('');

    const getListContacts = async () => {
      optionsContacts.value.pop();
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getListContactAction();

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsContacts.value = response.data.map(
          (x: { id: { toString: () => string }; nom: any }) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              id: '/api/contacts/'.concat(x.id.toString()),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label: x.nom,
            };
          }
        );
        console.log('c***************', optionsContacts.value);
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des contacts',
          type: 'negative',
        });
      }
      // loadingGroupes.value = false;
    };
    const newGroupe = async () => {
      const groupe = {
        nom: nom.value,
        description: description.value,
        clientId: parseInt(Cookies.get('id')),
      };
      console.log('Nouveau groupe enregistre avec success.', groupe);
      await api
        .post('/api/groupe_contacts', groupe)
        .then((response) => {
          console.log('Nouveau groupe enregistre avec success.', response.data);
          $q.notify({
            message: 'Nouveau groupe enregistre avec success.',
            type: 'positive',
          });
        })
        .catch((response) => {
          console.log('Erreur enregistrement nouveau groupe', response);

          $q.notify({
            message: 'Erreur enregistrement nouveau groupe contact.',
            type: 'negative',
          });
        });
      await getGroupe();
    };

    const newContact = async () => {
      console.log(nom.value, numero.value);
      if (
        nom.value.length != 0 &&
        numero.value.length != 0 /*  &&mail.value.length != 0 */
      ) {
        if (/^\d+$/.test(numero.value)) {
          const contact = {
            nom: nomcontact.value,
            phone: numero.value,
            phoneCode: '+237',
            attribute: 'string',
            clientId: parseInt(Cookies.get('id')),
          };
          console.log('contact enregistre a.', contact);

          await api
            .post('/api/contacts', contact)
            .then(async (response) => {
              console.log('contact enregistre avec success.', response.data);
              if (groupe.value.id === 0) {
                $q.notify({
                  message: 'contact enregistre avec success.',
                  type: 'positive',
                });
              } else {
                await addContacttoGroupe(
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  response.data['@id'],
                  groupe.value.id.toString()
                );
              }

              nomcontact.value = '';

              numero.value = '';

              search.value = '';
            })
            .catch(async (response) => {
              console.log('Erreur enregistrement contact', response);

              if (er) {
                $q.notify({
                  message: 'Erreur enregistrement contact.',
                  type: 'negative',
                });
              } else {
                er = true;
                await refreshAuthenticated();
                await newContact();
              }
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

    const groupeInformations = (id: number, nomGroupe: string) => {
      promptAjoutGroupe.value = !promptAjoutGroupe.value;
      selectGroupId.value = id;
      console.log(id, nomGroupe);
    };
    const addContacttoGroupe = async (contactId: string, groupeId: string) => {
      const groupe = {
        contact: contactId,
        groupeContact: groupeId,
      };
      console.log('ajout.....');
      console.log(groupe);

      const response: any = await new RequestApi().addContacttoGroupeAction(
        groupe
      );
      console.log(response.data);
      if (response.status) {
        $q.notify({
          message: 'contact enregistre avec success.',
          type: 'positive',
        });

        nom.value = '';

        numero.value = '';

        search.value = '';
      } else {
        console.log('Erreur enregistrement contact ', response);

        $q.notify({
          message: 'Erreur enregistrement contact dans le groupe.',
          type: 'negative',
        });
      }
    };

    const getGroupe = async () => {
      loadingGroupes.value = true;
      optionsGroupes.value.pop();
      rows.value.pop();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getGroupesAction();
      console.log(response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsGroupes.value = response.data.map((x: any) => {
          console.log(x['@id']);
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.nom,
          };
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            nom: x.nom,
            action: '...',
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
      nom,
      rows,
      columns,
      description,
      selectGroupId,
      numero,
      listGroupe,
      selectGroupe: ref(null),
      nomcontact,
      optionsGroupes,
      loadingGroupes,
      getGroupe,
      groupe,
      newContact,
      newGroupe,
      optionsContacts,
      addContacttoGroupe,
      contact,
      promptGroupe,
      promptAjoutGroupe,
      promptContact: ref(false),
      date: ref('2019-02-01 12:44'),
      groupeInformations,
    };
  },
});
</script>
