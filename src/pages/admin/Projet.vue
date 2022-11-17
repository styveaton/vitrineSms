<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('projet.title') }}</div>
        <div class="text-caption">{{ $t('projet.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm q-pl-sm text-grey-4 text-subtitle1">
            {{ $t('projet.l') }}
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
                  <q-td key="soldeSms" :props="props">
                    {{ props.row.soldeSms }}
                  </q-td>

                  <q-td key="dateCreation" :props="props">
                    {{ props.row.date }}
                  </q-td>
                  <q-td>
                    <center>
                      <q-btn
                        label="Voir Plus"
                        size="sm"
                        @click="getProjetInfo(props.row.id, props.row.nom)"
                      ></q-btn>
                    </center>
                    <q-dialog
                      v-model="promptProjet"
                      style="width: 150px"
                      persistent
                    >
                      <q-card>
                        <q-card-section class="row items-center">
                          <div class="text-h6">
                            Gerer projet {{ selectPname }}
                          </div>
                        </q-card-section>

                        <q-card-section
                          style="width: 450px;"
                          class="q-pt-none q-pb-md items-center"
                        >
                          <div class="q-pb-md">
                            Api link : {{ selectPLink }}
                          </div>
                         
                          <div class="q-pb-md" 
                           style=" text-align: left;"
                          >
                            Description Api : {{ descriptionLink }}
                          </div>
                          <div class="q-pb-md">Method : GET</div>
                          <div class="q-pb-md">ApiKey : {{ selectPKey }}</div>
                          <div class="q-pb-md">
                            Solde sms : {{ selectPsolde }}
                          </div>
                          <div class="q-pb-md">
                            Regenerer Api Key :
                            <q-btn
                              class="btn"
                              flat
                              label="Regenerer"
                              color="green"
                              icon-right="circle"
                              size="sm"
                              :loading="loadingR"
                              no-caps
                              @click="promptValidation = !promptValidation"
                            />
                          </div>
                        </q-card-section>
                        <q-inner-loading :showing="loadingGetProjet">
                          <q-spinner-gears size="50px" color="primary" />
                        </q-inner-loading>

                        <q-card-actions align="right" class="text-primary">
                          <q-btn
                            icon="close"
                            flat
                            color="red"
                            round
                            label="Back"
                            dense
                            v-close-popup
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                    <q-dialog v-model="promptValidation" persistent>
                      <q-card>
                        <q-card-section class="row items-center">
                          <div class="text-h6">
                            Valider Cette action avec votre mot de passe
                          </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none q-pb-md">
                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Password"
                              placeholder="1234"
                              v-model="password"
                              dense
                              autofocus
                              required
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
                            v-close-popup
                          />
                          <q-btn
                            flat
                            label="Confirmer"
                            color="green"
                            icon-right="save"
                            :loading="actionValidate"
                            no-caps
                            @click="regenerateProjetApiKey"
                          />
                        </q-card-actions>
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

import { formatDate } from 'boot/formatDate';
import { useQuasar } from 'quasar';
import { RequestApi } from 'boot/RequestApi';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';
import { jsPDF } from 'jspdf';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Gerez vos projets',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
const columns = [
  {
    name: 'nom',
    required: true,
    label: 'Nom Projet',
    align: 'center',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'nom',
    sortable: true,
  },
  {
    name: 'soldeSms',
    align: 'center',
    label: "Solde d'sms Projet",
    field: 'soldeSms',
    sortable: true,
  },

  {
    name: 'dateCreation',
    align: 'center',
    label: 'Date Creation',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'date',

    sortable: true,
  },

  {
    name: 'Action',
    align: 'center',
    label: 'Gerer Projet',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: (row: { acion: any }) => row.acion,

    sortable: true,
  },
];
export default defineComponent({
  name: 'Projet',
  setup() {
    const $q = useQuasar();
    onMounted(async () => {
      await getListProjet();
    });
    const rows = ref([
      {
        id: 0,
        nom: 'Aucun',
        soldeSms: 'Aucun',

        date: 'Aucun',

        acion: 'Aucun',
      },
    ]);
    const promptValidation = ref(false);
    let actionValidate = ref(false);

    const clientId = Cookies.get('id');
    const selectPname = ref('');
    const selectPsolde = ref(0);
    const selectPKey = ref('');
    const selectPLink = ref('');
    const descriptionLink = ref('');
    const promptProjet = ref(false);
    const loadingGetProjet = ref(false);
    const loading = ref(true);
    const loadingPatchProjet = ref(false);
    const loadingR = ref(false);

    const getListProjet = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getListProjetAction();

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            nom: x.nomProjet,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            soldeSms: x.soldeSms,

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            date: x.date,
          };
        });
        console.log(rows.value);
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des projets',
          type: 'negative',
        });
      }
      loading.value = false;
    };
    const getProjetInfo = async (idProjet: string, nomProjet: string) => {
      selectPsolde.value = 0;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selectPKey.value = '';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      selectPLink.value = '';
      promptProjet.value = !promptProjet.value;
      selectPname.value = nomProjet;
      loadingGetProjet.value = !loadingGetProjet.value;
      const response: any = await new RequestApi().getProjetAction(idProjet);

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        selectPsolde.value = response.data['soldeSms'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        selectPKey.value = response.data['apiKey'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        selectPLink.value = response.data['apiLink'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        descriptionLink.value = response.data['descriptionApiLink'];
        console.log(response.data);
        loadingGetProjet.value = !loadingGetProjet.value;
      } else {
        loadingGetProjet.value = !loadingGetProjet.value;

        $q.notify({
          message: 'Erreur lors du chargement des informations du projet',
          type: 'negative',
        });
      }
    };

    let password = ref('');

    const regenerateProjetApiKey = async () => {
      actionValidate.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().logIn(
        Cookies.get('phone'),
        password.value
      );
      if (response.status) {
        const data = {
          apiKey: selectPKey.value,
        };
        loadingR.value = true;

        const response: any =
          await new RequestApi().regenerateProjetApiKeyAction(data);
        //  console.log('get qte statu', response.data);
        if (response.status) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
          loadingR.value = false;
          // confirmPassword.value = '';
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          selectPKey.value = response.data['apiKey'];
          $q.notify({
            message:
              "Actualisation de le cle d'api du projet effectuee avec succes",
            type: 'positive',
          });
        } else {
          loadingR.value = false;
          $q.notify({
            message:
              "Erreur lors de l'Actualisation de le cle d'api du projet ",
            type: 'negative',
          });
        }
        promptValidation.value = false;
        actionValidate.value = false;
      } else {
        promptValidation.value = false;
        actionValidate.value = false;
        loadingR.value = false;
        $q.notify({
          message: 'Mot de Passe incorrect',
          type: 'negative',
        });
      }
      password.value = '';
    };
    const imprimer = async () => {
      let table = document.createElement('div');
      table.style.alignContent = 'center';
      table.style.margin = 'auto';
      let titre = document.createElement('div');

      let titre1 = document.createElement('span');
      titre1.innerText = "API D'ENVOI DE SMS POUR PROJET";
      let titre2 = document.createElement('span');
      titre2.innerText =
        "Reussir l'integration de notre api d'envoi de sms pour vos projets";
      titre2.style.fontSize = '12px';
      titre.style.marginTop = '2px';
      titre1.style.fontSize = '20px';
      titre1.style.fontWeight = 'bold';
      titre.style.width = '1000px';
      titre.style.color = 'green';
      titre.appendChild(titre1);
      titre.appendChild(titre2);

      table.appendChild(titre);
      console.log(table);
      const doc = new jsPDF('portrait', 'pt', 'a4');

      await doc.html(table, {
        callback: function (doc) {
          doc.save('API_Sms_Devoo_documentation_v1.0.0.pdf');
        },

        html2canvas: {
          // insert html2canvas options here, e.g.
          // width: 250,
        },
      });
    };
    useMeta(metaData);

    return {
      loadingGetProjet,
      loadingPatchProjet,
      rows,
      columns,
      promptProjet,
      getProjetInfo,
      tab: ref('Informations'),
      selectPname,
      selectPsolde,
      selectPKey,
      selectPLink,
      loadingR,
      regenerateProjetApiKey,
      imprimer,
      password,
      descriptionLink,
      loading,
      promptValidation,
      actionValidate,
      // onSubmit,
    };
  },
});
</script>

<style>
.a {
  margin-top: 10px;
}
.align {
  position: relative;
  float: right;
  margin-top: 7px;
}
</style>
