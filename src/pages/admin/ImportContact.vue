/* eslint-disable @typescript-eslint/no-unsafe-assignment */ /* eslint-disable
@typescript-eslint/no-unsafe-assignment */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('import.title') }}</div>
        <div class="text-caption">
          {{ $t('import.subtitle') }}
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-form @submit="csvToContact">
          <div class="row q-col-gutter-md">
            <div class="col-md-6">
              <q-file
                clearable
                use-chips
                v-model="csv"
                filled
                bottom-slots
                label="Fichier de contact"
                accept=".csv,.vcf"
                counter
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>

                <template v-slot:hint> cliquer pour importer </template>
              </q-file>
            </div>
            <div class="col-md-6">
              <q-select
                filled
                label="Groupe de contact destinataire:"
                placeholder="Selectionner un groupe"
                stack-label
                :dense="dense"
                :loading="loadingGroupes"
                :options="optionsGroupes"
                v-model="groupe"
              />
            </div>
          </div>
          <div class="text-right q-pt-md">
            <q-btn
              label="Importer"
              icon-right="upload"
              color="blue"
              type="submit"
              no-caps
            >
            </q-btn>
          </div>
        </q-form>
        <div class="q-pt-md text-justify">
          Please upload CSV file only - names in 1st column, phone in 2nd (NO
          spaces, dashes, or parentheses in mobile numbers) Import your mobile
          numbers (Orange & MTN & NEXTEL) at 9 digits in local format (Do not
          include country code) Example 6xxxxxxxx) Télécharger un fichier
          exemple ou consulter notre
          <router-link to="#">documentation</router-link>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { api } from 'boot/axios';
import { useQuasar, Cookies } from 'quasar';
import { parse } from 'papaparse';

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Importez vos contact',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'ImportContact',

  setup() {
    onMounted(async () => {
      await getGroupe();
    });
    const search = ref('');

    const csv = ref();
    let correctSave = 0;

    let errorSave = 0;
    const listCont = [{ nom: 'Aucun', numero: '' }];

    const $q = useQuasar();

    const groupe = ref({ id: 0, label: 'Aucun' });

    const optionsGroupes = ref([{ id: 0, label: 'Aucun' }]);

    const clientId = parseInt(Cookies.get('id'));
    const loadingGroupes = ref(false);

    const newContact = async (nom: string, numero: string) => {
      const contact = {
        nom: nom,
        phone: numero,
        phoneCode: '+237',
        attribute: 'string',
        clientId: parseInt(Cookies.get('id')),
      };

      await api
        .post('/api/contacts', contact)
        .then(async (response) => {
          console.log('contact enregistre avec success.');

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          await addContacttoGroupe(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.data['@id'],
            groupe.value.id.toString()
          );
        })
        .catch(() => {
          console.log('Erreur enregistrement contact');
          errorSave++;
        });
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          correctSave++;
        })
        .catch(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          errorSave++;
          console.log('c');
        });
    };

    const getGroupesAction = async (requestType: number) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
      let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
      if (requestType === 1) {
        await api
          .get('/api/groupe_contacts?clientId='.concat(clientId.toString()))
          .then((response) => {
            dataRes = {
              status: true,
              data: <[]>response.data['hydra:member'],
            };
          })
          .catch(() => {
            dataRes = {
              status: false,
              data: [],
            };
          });
        return dataRes;
      }
    };
    const getGroupe = async () => {
      loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await getGroupesAction(1);
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

    // const csvToContact = async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   // const file =
    //   // // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   // readFileSync('xcxc', 'utf8');
    //   listCont.pop();
    //   type contact = {
    //     name: string;
    //     country: string;
    //     subCountry: string;
    //     geoNameId: number;
    //   };
    //   const headers = ['name', 'country', 'subCountry', 'geoNameId'];

    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //   parse<
    //     [
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string,
    //       string
    //     ]
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //   >(csv.value, {
    //     delimiter: ',',

    //     complete: (result) => {
    //       for (var i = 1; i < result.data.length; i++) {
    //         listCont.push({
    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //           nom: result.data[i][0],
    //           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //           numero: result.data[i][32],
    //         });
    //       }
    //     },
    //   });

    //   for (var i = 1; i < listCont.length; i++) {
    //     await newContact(
    //       listCont[i].nom,

    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //       listCont[i].numero
    //     );
    //   }
    //   if (listCont.length != 0) {
    //     if (errorSave == 0) {
    //       $q.notify({
    //         message:
    //           correctSave.toString() + 'Contatcs enregistres avec success',
    //         type: 'positive',
    //       });
    //     } else {
    //       $q.notify({
    //         message:
    //           correctSave.toString() +
    //           '  enregistre avec success et ' +
    //           errorSave.toString() +
    //           ' non enregistre.',
    //         type: 'positive',
    //       });
    //     }
    //   }
    // };



    const csvToContact = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const file =
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      // readFileSync('xcxc', 'utf8');
      listCont.pop();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      parse<
        [
          string,
          string
        ]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      >(csv.value, {
        delimiter: ',',

        complete: (result) =>
        {
          // console.log()
          for (var i = 1; i < result.data.length; i++) {
            listCont.push({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              nom: result.data[i][0],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              numero: result.data[i][1],
            });
          }
        },
      });

      for (var i = 1; i < listCont.length; i++) {
        await newContact(
          listCont[i].nom,

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          listCont[i].numero
        );
      }
      if (listCont.length != 0) {
        if (errorSave == 0) {
          $q.notify({
            message:
              correctSave.toString() + 'Contatcs enregistres avec success',
            type: 'positive',
          });
        } else {
          $q.notify({
            message:
              correctSave.toString() +
              '  enregistre avec success et ' +
              errorSave.toString() +
              ' non enregistre.',
            type: 'positive',
          });
        }
      }
    };
    useMeta(metaData);

    return {
      csv,
      search,
      listCont,
      csvToContact,
      optionsGroupes,
      loadingGroupes,
      getGroupe,
      groupe,
    };
  },
});
</script>
