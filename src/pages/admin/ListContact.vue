/* eslint-disable vue/no-ref-as-operand */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('listcontact.title') }}</div>
        <div class="text-caption">{{ $t('listcontact.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm q-pl-sm text-grey-4 text-subtitle1">
            {{ $t('listcontact.l') }}
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
            >
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>
              <template v-slot:header="scope">
                <q-tr :scope="scope">
                  <q-th
                    v-for="col in scope.cols"
                    :key="col.name"
                    :scope="scope"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:no-data="{ icon, message, filter }">
                <div class="full-width row flex-center text-accent q-gutter-sm">
                  <q-icon size="2em" name="sentiment_dissatisfied" />
                  <span> Well this is sad... {{ message }} </span>
                  <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                </div>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="nom" :props="props">
                    {{ props.row.nom }}
                  </q-td>
                  <q-td key="prenom" :props="props">
                    {{ props.row.prenom }}
                  </q-td>
                  <q-td key="phone" :props="props">
                    {{ props.row.phone }}
                  </q-td>
                  <q-td key="date ajout" :props="props">
                    {{ props.row.date }}
                  </q-td>
                  <q-td>
                    <center>
                      <q-btn
                        label="Voir Plus"
                        size="sm"
                        @click="
                          getContactsInformations(
                            props.row.id,
                            props.row.nom,
                            props.row.prenom,
                            props.row.phone
                          )
                        "
                      ></q-btn>
                    </center>
                    <q-dialog v-model="promptContact" h>
                      <q-card>
                        <q-card-section class="row q-gutter-y-md">
                          <div class="text-h6">
                            <q-tabs
                              v-model="tab"
                              dense
                              class="text-grey items-center"
                              active-color="primary"
                              indicator-color="primary"
                              align="center"
                              narrow-indicator
                            >
                              <q-tab
                                name="Informations"
                                icon="mail"
                                label="Informations"
                              />
                              <q-tab
                                name="retirer"
                                icon="alarm"
                                label="Retirer Groupes"
                              />

                              <q-tab
                                name="Groupes"
                                icon="alarm"
                                label="Ajouter dans Groupes"
                              />
                            </q-tabs>
                          </div>
                        </q-card-section>
                        <q-tab-panels v-model="tab" animated>
                          <q-tab-panel name="Informations">
                            <div class="text-h6" align="center">
                              Modifier les Informations du contact
                            </div>
                            <q-card-section class="q-pt-none q-pb-md">
                              <div class="q-pb-md">
                                <q-input
                                  filled
                                  stack-label
                                  label="Nom"
                                  placeholder="Nom..."
                                  v-model="nomcontact"
                                  dense
                                  autofocus
                                  required
                                />
                              </div>
                              <div class="q-pb-md">
                                <q-input
                                  filled
                                  stack-label
                                  label="Prenom"
                                  placeholder="Prenom..."
                                  v-model="prenomcontact"
                                  dense
                                />
                              </div>
                              <div class="q-pb-md">
                                <q-input
                                  filled
                                  stack-label
                                  label="Phone"
                                  v-model="phonecontact"
                                  placeholder="Telephone..."
                                  dense
                                />
                              </div>
                            </q-card-section>
                            <q-card-actions align="right" class="text-primary">
                              <q-btn
                                icon="close"
                                flat
                                color="red"
                                round
                                label="Annuler"
                                dense
                                v-show="!loadingContact"
                                v-close-popup
                              />
                              <q-btn
                                flat
                                label="Modifer le Contact"
                                color="green"
                                icon-right="save"
                                :loading="loadingContact"
                                no-caps
                                @click="pathContact"
                              />
                            </q-card-actions>
                          </q-tab-panel>

                          <q-tab-panel name="retirer" align="center">
                            <div class="text-h6">
                              Retirer ce contact des groupes
                            </div>
                            <li
                              v-for="groupe in listGroupes"
                              :key="groupe.label"
                            >
                              <div class="row">
                                <div class="col">
                                  {{ groupe.label }}
                                </div>
                                <div class="col">
                                  <q-btn
                                    align="right"
                                    icon="close"
                                    flat
                                    color="red"
                                    label="Retirer"
                                    dense
                                    @click="removeContactToGroupe(groupe.id)"
                                  />
                                </div>
                              </div>
                            </li>
                            <q-card-actions align="right" class="text-primary">
                              <q-btn
                                icon="close"
                                flat
                                color="red"
                                round
                                label="Annuler"
                                dense
                                :loading="loadingContact"
                                v-close-popup
                              />
                            </q-card-actions>
                          </q-tab-panel>
                          <q-tab-panel name="Groupes" align="center">
                            <div class="text-h6">
                              Ajouter ce contact au Groupe
                            </div>

                            <q-card-section class="q-pt-none q-pb-md">
                              <div class="q-pb-md">
                                <q-select
                                  filled
                                  stack-label
                                  label="Goupe Contact"
                                  dense
                                  v-model="groupe"
                                  :options="optionsGroupes"
                                />
                              </div>
                            </q-card-section>
                            <q-card-actions align="right" class="text-primary">
                              <q-btn
                                icon="close"
                                flat
                                color="red"
                                round
                                label="Annuler"
                                v-show="!loadingContact"
                                dense
                                v-close-popup
                              />
                              <q-btn
                                flat
                                label="Ajouter"
                                color="green"
                                icon-right="save"
                                :loading="loadingContact"
                                no-caps
                                @click="addContacttoGroupe"
                              />
                            </q-card-actions>
                          </q-tab-panel>
                        </q-tab-panels>
                      </q-card>
                    </q-dialog>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
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

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Liste de vos contact',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
const columns = [
  {
    name: 'nom',
    required: true,
    label: 'Nom Contact',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'nom',
    sortable: true,
  },
  {
    name: 'prenom',
    align: 'center',
    label: 'Prenom',
    field: 'prenom',
    sortable: true,
  },
  {
    name: 'phone',
    required: true,
    label: 'Phone',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'phone',
    sortable: true,
  },
  {
    name: 'date ajout',
    align: 'center',
    label: 'Date ajout',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'date',

    sortable: true,
  },

  {
    name: 'Action',
    align: 'center',
    label: 'Action',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { acion: any }) => row.acion,

    sortable: true,
  },
];

export default defineComponent({
  name: 'ListContact',

  setup() {
    onMounted(async () => {
      await getGroupe();
      await getListContacts();
    });
    const rows = ref([
      {
        id: 0,
        nom: 'Aucun',
        prenom: 'Aucun',
        phone: 'Aucun',
        date: 'Aucun',

        acion: 'Aucun',
      },
    ]);

    const listGroupes = ref([
      {
        id: 0,
        label: '',
      },
    ]);
    const loadingGroupes = ref(false);
    const loadingContact = ref(false);
    const loading = ref(true);

    const promptContact = ref(false);
    const $q = useQuasar();
    const search = ref('');
    const nom = ref('');
    const description = ref('');
    const nomcontact = ref('');

    const prenomcontact = ref('');

    const idContactSelect = ref(0);

    const phonecontact = ref('');

    const groupe = ref({ id: 0, label: 'Aucun' });
    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);

    const getListContacts = async () => {
      // loading.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getListContactAction();

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            nom: x.nom,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            prenom: x.prenom,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            phone: x.phone,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            date: x.date,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des contacts',
          type: 'negative',
        });
      }
      loading.value = false;
      // loadingGroupes.value = false;
    };

    const getContactsInformations = async (
      id: number,
      nom: string,
      prenom: string,
      phone: string
    ) => {
      if (id != 0) {
        (idContactSelect.value = id),
          (promptContact.value = !promptContact.value);
        prenomcontact.value = prenom;
        phonecontact.value = phone;
        nomcontact.value = nom;
        console.log(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any =
          await new RequestApi().getListGroupForContactAction(id.toString());

        if (response.status) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          listGroupes.value.pop();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
          listGroupes.value = response.data.map((x: any) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: x.id,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label: x.label,
            };
          });
        } else {
          $q.notify({
            message: 'Erreur lors du chargement des groupes de ce contact',
            type: 'negative',
          });
        }
      } else {
        $q.notify({
          message: 'chargement des contacts en cours...',
          type: 'positive',
        });
      }
      // loadingGroupes.value = false;
    };
    const getGroupe = async () => {
      loadingGroupes.value = true;
      optionsGroupes.value.pop();
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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          return {
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
    const pathContact = async () => {
      let data = {
        nom: nomcontact.value,
        prenom: prenomcontact.value,
        phone: phonecontact.value,
      };
      loadingContact.value = true;
      const response = await new RequestApi().pathContactAction(
        idContactSelect.value,
        data
      );
      if (response.status) {
        await getListContacts();
        loadingContact.value = false;
        $q.notify({
          message: 'Operation effectuee avec succes',
          type: 'positive',
        });
      } else {
        loadingContact.value = false;

        $q.notify({
          message: 'Erreur lors de la modification du contact',
          type: 'negative',
        });
      }
    };
    const removeContactToGroupe = async (idGroupe: number) => {
      console.log(idGroupe);
      loadingContact.value = true;
      const response = await new RequestApi().deletteGroupeContactAction(
        idContactSelect.value,
        idGroupe
      );
      if (response.status) {
        await getContactsInformations(
          idContactSelect.value,
          nomcontact.value,
          prenomcontact.value,
          phonecontact.value
        );

        loadingContact.value = false;
        $q.notify({
          message: 'Operation effectuee avec succes',
          type: 'positive',
        });
      } else {
        loadingContact.value = false;

        $q.notify({
          message: 'Erreur lors de votre operation',
          type: 'negative',
        });
      }
    };

    const addContacttoGroupe = async () => {
      const data = {
        contact: '/api/contacts/'.concat(idContactSelect.value.toString()),
        groupeContact: groupe.value.id,
      };
      loadingContact.value = true;
      const response = await new RequestApi().addContacttoGroupeAction(data);
      if (response.status) {
        await getContactsInformations(
          idContactSelect.value,
          nomcontact.value,
          prenomcontact.value,
          phonecontact.value
        );

        loadingContact.value = false;
        $q.notify({
          message: 'contact ajoute au groupe avec success.',
          type: 'positive',
        });
      } else {
        loadingContact.value = false;
        $q.notify({
          message: 'Erreur enregistrement contact dans le groupe.',
          type: 'negative',
        });
      }
    };

    useMeta(metaData);

    return {
      search,
      nom,
      rows,
      pathContact,
      columns,
      description,
      prenomcontact,
      phonecontact,
      optionsGroupes,
      selectGroupe: ref(null),
      nomcontact,
      promptGroupe: ref(false),
      getContactsInformations,
      promptContact,
      date: ref('2019-02-01 12:44'),
      tab: ref('Informations'),
      listGroupes,
      loadingGroupes,
      loadingContact,
      removeContactToGroupe,
      groupe,
      idContactSelect,
      addContacttoGroupe,
      loading,
    };
  },
});
</script>
<style scoped>
li {
  list-style-type: none;
  list-style: none;
}
</style>
