<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('vitrine.title') }}</div>
        <div class="text-caption">{{ $t('vitrine.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md"
        >Gestion du contenu de la vitrine</q-card-section
      >
      <q-card-section>
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
            {{ $t('vitrine.l') }}
          </div>
          <div class="q-py-lg q-px-sm" id="details">
            <q-table
              separator="cell"
              :rows="rows"
              :columns="columns"
              row-key="nom"
            >
              <template v-slot:header="scope">
                <q-tr :scope="scope">
                  <q-th
                    v-for="col in scope.cols"
                    :key="col.name"
                    :scope="scope"
                  >
                    {{ col.label }}
                  </q-th>
                  <q-th>Modifier</q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="SectionTitle" :props="props">
                    {{ props.row.SectionTitle }}
                  </q-td>
                  <q-td key="SectionContent" :props="props">
                    {{ props.row.SectionContent }}
                  </q-td>

                  <q-td align="center">
                    <q-btn
                      icon="add"
                      size="sm"
                      round
                      @click="
                        selectedSection(props.row.id, props.row.SectionContent)
                      "
                    ></q-btn>
                    <q-dialog
                      v-model="modifer"
                      style="min-width: 1500; min-height: 300px"
                    >
                      <q-card>
                        <q-card-section>
                          Entrer le text a modifer
                        </q-card-section>
                        <q-card-section>
                          <div class="q-pb-md">
                            <q-input
                              type="textarea"
                              autofocus
                              label="Entrer nouveau contenu"
                              filled
                              no-error-icon
                              v-model="contenu"
                              stack-label
                              :rules="[(val) => !!val || 'Entrer du texte']"
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
                            label="Modifier"
                            color="green"
                            icon-right="save"
                            @click="pathData"
                            no-caps
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                    &nbsp;
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

import { useQuasar, Cookies } from 'quasar';

import { RequestApi } from '../../boot/RequestApi';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Gestion de la vitrine',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'Vitrine',
  setup() {
    const columns = [
      {
        name: 'SectionTitle',
        required: true,
        label: 'Section Title',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
        // field: (row: { destinataire: any }) => row.destinataire,
        sortable: true,
      },
      {
        name: 'SectionContent',
        align: 'center',
        label: 'Section Content',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
        // field: (row: { message: any }) => row.message,

        sortable: true,
      },
    ];
    const search = ref('');

    onMounted(async () => {
      await getSectionVitrine();
    });
    const rows = ref([
      {
        SectionTitle: 'Aucun',
        SectionContent: 'Aucun',
        id: '',
      },
    ]);
    const admin = ref(Cookies.get('admin'));
    const selectedSection = (id: string, content: string) => {
      modifer.value = !modifer.value;
      selectId.value = id;
      contenu.value = content;
      console.log(id, content);
    };
    const selectId = ref('');
    const contenu = ref('');
    const modifer = ref(false);
    const $q = useQuasar();

    const getSectionVitrine = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (admin.value == '1') {
        const response = await new RequestApi().getVitrineAdmin();
      
        if (response.status) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
          rows.value = response.data.map((x: any) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: x['@id'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              SectionTitle: x.nom,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              SectionContent: x.contenu,
            };
          });
        } else {
          $q.notify({
            message: 'Erreur lors du chargement de votre vitrine',
            type: 'negative',
          });
        }
        console.log(rows.value);
        // loadingGroupes.value = false;
      }
    };

    const pathData = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      let data = {
        contenu: contenu.value,
      };
      const response = await new RequestApi().pathDataAction(
        selectId.value,
        data
      );
     
      console.log(response.data);
      if (response.status) {
        await getSectionVitrine();
        modifer.value = false;
        $q.notify({
          message: 'Mise a jour de votre vitrine effectuee avec succes',
          type: 'positive',
        });
      } else {
        $q.notify({
          message: 'Erreur lors de la mise a jour de votre vitrine',
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
      getSectionVitrine,
      modifer,
      pathData,
      contenu,
      selectedSection,
    };
  },
});
</script>
