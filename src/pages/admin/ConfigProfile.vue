<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('config.title') }}</div>
        <div class="text-caption">{{ $t('config.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="border-radius-inherit">
          <div class="row bg-grey-9 q-py-sm q-pl-sm text-grey-4">
            <div class="col-md-6">
              {{ $t('creditR') }}: {{ qteSms > 0 ? qteSms : 'Vide' }}
            </div>
            <div class="col-md-6">
              {{ $t('currentDate') }}: {{ dateCourante }}
            </div>
          </div>
          <q-form @submit="onSubmit">
            <div class="q-py-md q-pa-lg">
              <div class="row q-col-gutter-md q-pb-md">
                <div class="col-md-6">General Details</div>
                <div class="col-md-6">Securite</div>
              </div>
              <div class="row q-col-gutter-md">
                <div class="col-md-6">
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      label="Nom:"
                      autofocus
                      placeholder="Modifier le nom"
                      v-model="nom"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      label="Prenom:"
                      v-model="prenom"
                      placeholder="Modifier le prenom"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      v-model="numero"
                      label="Telephone:"
                      placeholder="Modifier le numero de telephone"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      v-model="email"
                      label="Email:"
                      placeholder="Modifier l' addresse mail"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      v-model="societe"
                      label="Societe"
                      placeholder="Modifier le nom de la societe"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      v-model="about"
                      label="A Propos de vous"
                      placeholder="Modifier A propos de vous"
                      stack-label
                      :dense="dense"
                      :loading="loadingUser"
                    />
                  </div>

                  <q-dialog v-model="promptValid">
                    <q-card style="min-width: 500px; min-height: 100px">
                      <q-card-section>
                        <div class="text-h6">
                          Entrer votre mot de passe pour valider
                        </div>
                      </q-card-section>

                      <q-card-section class="q-pt-none q-pb-md">
                        <div class="q-pb-md">
                          <q-input
                            filled
                            v-model="confirmPassword"
                            label="Mot de passe de validation"
                            type="password"
                            dense
                            autofocus
                          />
                        </div>
                      </q-card-section>

                      <q-card-actions align="right" class="text-primary">
                        <q-btn
                          flat
                          label="Mise a jour"
                          @click="patchUser"
                          color="green"
                          icon-right="save"
                          no-caps
                          v-close-popup
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  <q-btn
                    class="align"
                    label="Enregistre"
                    @click="validate"
                    color="primary"
                    :loading="loadingPatchUser"
                    no-caps
                  ></q-btn>
                </div>

                <div class="col-md-6">
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      type="password"
                      v-model="password"
                      label="Ancien"
                      placeholder="Entrer Ancien Mot de Passe"
                      stack-label
                      :dense="dense"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      type="password"
                      v-model="newMdp"
                      label="Nouveau"
                      placeholder="Entrer Nouveau Mot de Passe"
                      stack-label
                      :dense="dense"
                    />
                  </div>
                  <div class="col-md-4 a">
                    <q-input
                      filled
                      type="password"
                      v-model="rnewMdp"
                      label="Repeter"
                      placeholder="Reentrer Nouveau Mot de Passe"
                      stack-label
                      :dense="dense"
                    />
                  </div>
                  <q-btn
                    class="align"
                    :loading="loadingPatchPassword"
                    @click="patchPassword"
                    label="Mise a jour"
                    color="green"
                    no-caps
                  ></q-btn>
                </div>
              </div></div
          ></q-form>
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

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Configuration profile',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'configProfiles',
  setup() {
    const $q = useQuasar();
    onMounted(async () => {
      await getQteSms();
      await getUser();
    });
    const clientId = Cookies.get('id');
    const loadingUser = ref(true);

    const loadingPatchUser = ref(false);
    const loadingPatchPassword = ref(false);
    const dateCourante = formatDate(new Date());

    let nom = ref('');
    let prenom = ref('');
    let email = ref('');

    let numero = ref('');

    let societe = ref('');
    let about = ref('');

    let confirmPassword = ref('');
    let password = ref('');
    let newMdp = ref('');
    let rnewMdp = ref('');
    let promptValid = ref(false);
    // const name:string = Cookies.get('nom').toString() + Cookies.get('prenom') .toString();
    const qteSms = ref(0);

    const getQteSms = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getQteSmsAction();
      //  console.log('get qte statu', response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        qteSms.value = response.qte;
      } else {
        $q.notify({
          message: 'Erreur lors du chargement de votre credit restant',
          type: 'negative',
        });
      }
    };

    const patchUser = async () => {
      const data = {
        clientId: clientId,
        nom: nom.value,
        prenom: prenom.value,
        email: email.value,
        phone: numero.value,
        nomEntreprise: societe.value,
      };
      if (loadingPatchUser.value == false) {
        loadingPatchUser.value = true;
        if (confirmPassword.value != '') {
          await api
            .post('/api/auth', {
              phone: Cookies.get('phone'),
              password: confirmPassword.value.toString(),
            })
            .then(async (response) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (response.status == 200) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response: any = await new RequestApi().pathUserAction(
                  data,
                  0
                );
                //  console.log('get qte statu', response.data);
                if (response.status) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
                  loadingPatchUser.value = false;
                  confirmPassword.value = '';
                  $q.notify({
                    message:
                      'Mise a jour de vos information effectuee avec succes',
                    type: 'positive',
                  });
                } else {
                  confirmPassword.value = '';
                  loadingPatchUser.value = false;
                  $q.notify({
                    message: 'Erreur lors de la Mise a jour de vos information',
                    type: 'negative',
                  });
                }
              } else {
                loadingPatchUser.value = false;
                confirmPassword.value = '';
                $q.notify({
                  message: 'Mot de passe utilisateur incorrect',
                  type: 'negative',
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          loadingPatchUser.value = false;
          $q.notify({
            message: 'Veuillez entrer un mot de passe',
            type: 'negative',
          });
        }
      } else {
        loadingPatchUser.value = false;
        $q.notify({
          message: 'Une Mise a Jour est en cours',
          type: 'negative',
        });
      }
    };

    const patchPassword = async () => {
      const data = {
        clientId: clientId,
        password: newMdp.value,
      };
      if (loadingPatchPassword.value == false) {
        if (newMdp.value == rnewMdp.value) {
          loadingPatchPassword.value = true;

          await api
            .post('/api/auth', {
              phone: Cookies.get('phone'),
              password: password.value.toString(),
            })
            .then(async (response) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (response.status == 200) {
                const response1: any =
                  await new RequestApi().pathPasswordAction(data);
                //  console.log('get qte statu', response.data);
                if (response1.status) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
                  loadingPatchPassword.value = false;
                  newMdp.value = '';
                  rnewMdp.value = '';
                  password.value = '';
                  $q.notify({
                    message:
                      'Mise a jour de vos informations effectuee avec succes',
                    type: 'positive',
                  });
                } else {
                  loadingPatchPassword.value = false;
                  $q.notify({
                    message: 'Erreur lors de la Mise a jour de vos information',
                    type: 'negative',
                  });
                }
              } else {
                loadingPatchPassword.value = false;
                $q.notify({
                  message: 'Mot de passe utilisateur incorrect',
                  type: 'negative',
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          $q.notify({
            message: 'Les Mots de passes entres sont differents',
            type: 'negative',
          });
        }
      } else {
        $q.notify({
          message: 'Une Mise a Jour est en cours',
          type: 'negative',
        });
      }
    };

    const getUser = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().getUserAction();
      //  console.log('get qte statu', response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        nom.value = response.data['nom'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        prenom.value = response.data['prenom']; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        numero.value = response.data['phone'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        email.value = response.data['email']; // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        societe.value = response.data['nomEntreprise'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        about.value = '';
        loadingUser.value = false;
      } else {
        $q.notify({
          message: 'Erreur lors du chargement de vos informations',
          type: 'negative',
        });
        loadingUser.value = false;
      }
    };
    // const onSubmit = async () => {

    // };
    const validate = () => {
      //  if( nom.value != '' || prenom.value != '' ||nom.value != '' ||nom.value != '' ||nom.value != '')
      promptValid.value = !promptValid.value;
    };

    return {
      // onSubmit,
      nom,
      qteSms,
      loadingUser,
      dateCourante,
      prenom,
      email,
      numero,
      societe,
      about,
      rnewMdp,
      confirmPassword,
      password,
      newMdp,
      loadingPatchUser,
      patchUser,
      patchPassword,
      loadingPatchPassword,
      promptValid,
      validate,
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
