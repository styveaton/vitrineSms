<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('licence.title') }}</div>
        <div class="text-caption">{{ $t('licence.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="text-right q-pb-md">
          <q-btn
            label="Acheter des sms"
            color="green"
            icon-right="add"
            :loading="loadinAchat"
            no-caps
            @click="promptAddLicence = !promptAddLicence"
          ></q-btn>
          <q-dialog v-model="promptAddLicence">
            <q-card style="min-width: 500px; min-height: 300px">
              <q-card-section>
                <div class="text-h6">Remplir les champs suivants</div>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-md">
                <div class="q-pb-md">
                  <q-input
                    filled
                    v-model="quantiteSms"
                    label="Quatite"
                    placeholder="Ex: 1000"
                    @keyup="getReduce"
                    @change="getReduce"
                    dense
                    autofocus
                  />
                </div>
                <div>
                  <q-select
                    filled
                    label="Pays"
                    v-model="pays"
                    :rules="[
                      (val) =>
                        val !== 'Aucun' || 'Veuillez selectionner un Pays',
                    ]"
                    :loading="loadingPays"
                    :options="optionsPays"
                  />
                </div>
                <div>
                  Vous beneficiez d'une reduction de {{ reduction }} % sur
                  chaque sms achete
                </div>
                <!-- <div>
                  <q-select
                    filled
                    label="Moyen de Paiment"
                    v-model="groupe"
                    :rules="[
                      (val) =>
                        val !== 'Aucun' || 'Veuillez selectionner un Groupe',
                    ]"
                    :loading="loadingGroupes"
                    :options="optionsGroupes"
                  />
                </div> -->
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  flat
                  label="Debut Achat"
                  @click="goNext"
                  type="submit"
                  color="green"
                  icon-right="save"
                  no-caps
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="promptBuySms">
            <q-card style="min-width: 500px; min-height: 300px">
              <q-card-section>
                <div class="text-h6">Achat de sms</div>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-md">
                <div>
                  <q-select
                    filled
                    label="Moyen de Paiment"
                    v-model="paiementSelect"
                    :rules="[
                      (val) =>
                        val !== 'Aucun' || 'Veuillez selectionner un Groupe',
                    ]"
                    :loading="loadingMoyenPaiement"
                    :options="optionsPaiement"
                  />
                </div>

                <div class="q-pb-md">
                  Voici le montant qui sera debite de votre solde :
                  {{ montantFinalSms }}
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  flat
                  label="Acheter"
                  @click="acheterSms"
                  color="green"
                  icon-right="save"
                  no-caps
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="continues">
            <q-card style="min-width: 500px; min-height: 300px">
              <iframe :src="srcValidPaiement" height="600" width="500">
                <p>Votre navigateur ne supporte aucune iframe !</p>
              </iframe>
            </q-card>
          </q-dialog>
        </div>
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
            {{ $t('licence.l') }}
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
            />
          </div>
        </div>
        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
            {{ $t('licence.h') }}
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
            />
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
import { FormatData } from '../../boot/FormatData';
import { Cookies } from 'quasar';

const columns = [
  // {
  //   name: 'Lice',
  //   required: true,
  //   label: 'Type De Licence',
  //   align: 'left',
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
  //   field: 'typeL',
  //   sortable: true,
  // },
  {
    name: 'date Achat',
    align: 'center',
    label: 'Date Achat',
    field: 'date',
    sortable: true,
  },
  {
    name: 'Pays',
    required: true,
    label: 'Pays',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'pays',
    sortable: true,
  },

  {
    name: 'quantite',
    align: 'center',
    label: 'Quantité',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'quantite',

    sortable: true,
  },
  {
    name: 'status',
    align: 'center',
    label: 'état',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'status',

    sortable: true,
  },
];

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Manager vos licence',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'Licence',
  setup() {
    const $q = useQuasar();
    const rows = ref([
      {
        // typeL: 'Aucun',
        date: formatDate(new Date()),
        pays: 'Aucune',
        quantite: '0',
        status: 'Operationnelle',
      },
    ]);

    const listTranches = ref([
      {
        min: 0,
        max: 0,
        pourcentage: 0,
      },
    ]);
    let quantiteSms = ref('0');
    let loadinAchat = ref(false);
    let loading = ref(true);
    let montantFinalSms = ref(0);
    let reduction = ref(0);
    const paiementSelect = ref({ id: 0, label: 'Aucun' });
    const optionsPaiement = ref([]);
    var continues = ref(false);

    let finalisation = ref(false);
    let srcValidPaiement = ref('');
    const optionsPays = ref([{ id: 0, label: 'Aucun' }]);
    const loadingPays = ref(true);
    const licenceSms = ref('');
    const promptBuySms = ref(false);
    onMounted(async () => {
      // await getQteSms();
      await getLicenceSms();
      await getTrancheSms();
      await getPays();
      await getModePaiement();
      await getLSA();
    });

    const pays = ref({ id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] });
    // const name:string = Cookies.get('nom').toString() + Cookies.get('prenom') .toString();
    // const qteSms = ref(0);

    // const getQteSms = async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   const response: any = await new RequestApi().getQteSmsAction();
    //   //  console.log('get qte statu', response.data);
    //   if (response.status) {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
    //     qteSms.value = response.qte;
    //   } else {
    //     $q.notify({
    //       message: 'Erreur lors du chargement de votre credit restant',
    //       type: 'negative',
    //     });
    //   }
    // };

    const getTrancheSms = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getTranchesSmsAction();
      //  console.log('get qte statu', response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        listTranches.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            min: x.min,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            max: x.max,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            pourcentage: x.pourcentage,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des tranches de reduction',
          type: 'negative',
        });
      }
    };

    const getReduce = () => {
      console.log('dssddssdsd');
      quantiteSms.value = new FormatData().verifNumber(
        quantiteSms.value.toString()
      );
      if (parseInt(quantiteSms.value.toString()) != 0) {
        for (var i = 0; i < listTranches.value.length; i++) {
          if (
            listTranches.value[i].min <=
              parseInt(quantiteSms.value.toString()) &&
            parseInt(quantiteSms.value.toString()) <= listTranches.value[i].max
          ) {
            reduction.value = listTranches.value[i].pourcentage;
          } else if (
            listTranches.value[i].min <=
              parseInt(quantiteSms.value.toString()) &&
            i == 0
          ) {
            reduction.value = 0;
          }
        }
      } else {
        reduction.value = 0;
      }
    };
    const getLSA = async () => {
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getLSAAction();

      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          console.log(x);
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            date: x.date,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            pays: x.pays,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            quantite: x.quantite,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            status: x.status ? 'Operationnelle' : 'Suspendu',
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des sms',
          type: 'negative',
        });
      }
      loading.value = false;
    };
    const getPays = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getPaysAction();
      // console.log('get pays statu', response.status);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        optionsPays.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x['@id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            routes: x.routes,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.nom,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des pays',
          type: 'negative',
        });
      }
      loadingPays.value = false;
    };

    const getModePaiement = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getModePaiementAction();
      // console.log('get pays statu', response.status);
      if (response.status) {
        for (let index = 0; index < response.data.length; index++) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
          optionsPaiement.value = response.data.map((x: any) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: x['@id'],

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label: x.libelle,
            };
          });
          console.log(optionsPaiement.value);
        }
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des pays',
          type: 'negative',
        });
      }
      loadingPays.value = false;
    };

    const getLicenceSms = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getLicenceSmsAction();
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        licenceSms.value = response.data['@id'];
      } else {
        $q.notify({
          message: 'Erreur lors de la recuperation de la licence sms',
          type: 'negative',
        });
      }
    };
    const acheterSms = async () => {
      if (
        parseInt(quantiteSms.value) > 0 &&
        parseInt(quantiteSms.value) >= 10
      ) {
        loadinAchat.value = !loadinAchat.value;

        let dataLSA = ref({});

        // promptBuySms.value = !promptBuySms.value;
        if (paiementSelect.value.id.toString().split('/')[3] == '1') {
          dataLSA.value = {
            sourcePaiement: 1,
            quantite: quantiteSms.value,

            routeId: pays.value.routes[0].id,

            idLicence: '1',
            clientId: Cookies.get('id'),
            recepteurId: Cookies.get('id'),
            montant: montantFinalSms.value,
            modePaiement: paiementSelect.value.id.toString().split('/')[3],

            // modePaiement: paiementSelect.value.id
          };
        } else {
          dataLSA.value = {
            sourcePaiement: 2,
            quantite: quantiteSms.value,

            routeId: pays.value.routes[0].id,
            idLicence: '1',
            clientId: Cookies.get('id'),

            recepteurId: Cookies.get('id'),
            montant: montantFinalSms.value,
            modePaiement: paiementSelect.value.id.toString().split('/')[3],
            type: 'MOBILE_MONEY',
          };
        }

        console.log(dataLSA.value);

        const response = await new RequestApi().makePaiementAction(
          dataLSA.value
        );
        console.log('response.status', response.status);
        if (response.status) {
          // eslint-disable-next-line require-atomic-updates

          // eslint-disable-next-line require-atomic-updates
          quantiteSms.value = ' 0';
          // eslint-disable-next-line require-atomic-updates
          pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] };

          if (response.sourcePaiement == 1) {
            loadinAchat.value = !loadinAchat.value;
            $q.notify({
              message: "Achat d'sms reussit",
              type: 'positive',
            });
          } else {
            continues.value = true;
            srcValidPaiement.value = response.paymentUrl;
            let dataVerfitrans = {
              quantite: quantiteSms.value,
              token: response.paymentToken,
              idListSmsAchete: response.idListSmsAchete,

              modePaiement: paiementSelect.value.id.toString().split('/')[3],
            };
            let i = ref(0);

            while (continues.value == true && i.value < 60) {
              console.log(i.value);
              const response0: any =
                await new RequestApi().waitStateLicenceTransaction(
                  dataVerfitrans
                );

              if (response0.data['code'] == '00') {
                // eslint-disable-next-line require-atomic-updates
                continues.value = false;

                // eslint-disable-next-line require-atomic-updates
                loadinAchat.value = !loadinAchat.value;
                $q.notify({
                  message: "Achat d'sms reussit",
                  type: 'positive',
                });
              }

              if (i.value == 59) {
                // eslint-disable-next-line require-atomic-updates
                continues.value = false;
                loadinAchat.value = false;

                $q.notify({
                  message: "Vous n'avez pas valide la transaction a tant",
                  type: 'negative',
                });
                break;
              } else {
                i.value++;
              }

              console.log('***********', i.value);
            }
          }

          await getLSA();

          // $q.notify({
          //   message: "Achat d'sms reussit",
          //   type: 'positive',
          // });
        } else {
          // eslint-disable-next-line require-atomic-updates
          loadinAchat.value = !loadinAchat.value;

          $q.notify({
            message: "Une erreur s'est produite",
            type: 'negative',
          });
        }
      } else {
        $q.notify({
          message:
            "Veuillez entrer une quantite d'sms correcte, minimum 10 sms",
          type: 'negative',
        });
      }
    };

    const goNext = () => {
      if (parseInt(quantiteSms.value.toString()) > 0) {
        montantFinalSms.value =
          pays.value.routes[0].prix * parseInt(quantiteSms.value);
        montantFinalSms.value =
          montantFinalSms.value -
          (montantFinalSms.value * reduction.value) / 100;
        montantFinalSms.value = Math.floor(montantFinalSms.value);
        console.log(
          'voici le prix',
          pays.value.routes[0].prix,
          reduction.value / 100,
          montantFinalSms.value
        );
        promptBuySms.value = !promptBuySms.value;
      } else {
        $q.notify({
          message: "Veuillez entrer une quantite d'sms correcte",
          type: 'negative',
        });
      }
    };
    useMeta(metaData);

    return {
      // qteSms,
      columns,
      rows,
      listTranches,
      quantiteSms,
      acheterSms,
      promptAddLicence: ref(false),
      promptBuySms,
      pays,
      loadingPays,
      loadinAchat,
      paiementSelect,
      optionsPays,
      getReduce,
      optionsPaiement,
      reduction,
      montantFinalSms,
      goNext,
      srcValidPaiement,
      continues,
      loading,
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
