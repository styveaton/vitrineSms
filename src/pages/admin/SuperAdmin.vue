/* eslint-disable @typescript-eslint/no-unsafe-call */
<template>
  <q-page class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h4">{{ $t('su.title') }}</div>
        <div class="text-caption">{{ $t('su.subtitle') }}</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pa-md">
        <div class="text-right q-pb-md">
          <q-btn-dropdown
            v-show="afficher"
            label="Opérations de Comptes"
            color="blue"
            no-caps
          >
            <q-list separator class="bg-blue" :dense="true">
              <q-item
                clickable
                @click="promptCreateAccount = !promptCreateAccount"
              >
                <q-item-section>
                  <q-item-label>Créer un compte</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptCreateAccount" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">
                      Créez des comptes pour vos clients/agences
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        label="Nom"
                        placeholder="Nom..."
                        v-model="nom"
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
                        v-model="prenom"
                        dense
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        label="Phone"
                        v-model="phone"
                        placeholder="Telephone..."
                        dense
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        v-model="entreprise"
                        label="Organisation"
                        placeholder="Organisation..."
                        dense
                      />
                    </div>

                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Type Compte"
                        placeholder="Client ou Administrateur"
                        dense
                        v-show="admin"
                        v-model="typeCompteChoisit"
                        :options="optionsTypeCompte"
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        label="Email"
                        v-model="mail"
                        placeholder="Email..."
                        dense
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        v-model="password"
                        label="Password"
                        placeholder="Password..."
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
                      v-show="!loadingCreationCompte"
                      v-close-popup
                    />
                    <q-btn
                      flat
                      label="Créer le Compte"
                      color="green"
                      icon-right="save"
                      :loading="loadingCreationCompte"
                      no-caps
                      @click="creerCompte"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item clickable @click="promptLessSolde = !promptLessSolde">
                <q-item-section>
                  <q-item-label>Deduire un solde</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptLessSolde">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">
                      Reduire les SMS d'un Compte client
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        dense
                        v-model="userSelect"
                        :options="rows"
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le pays "
                        dense
                        v-model="pays"
                        :options="optionsPays"
                      />
                    </div>

                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        label="Credit"
                        v-model="nombre"
                        placeholder="Nombre de credit"
                        dense
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      icon-right="save"
                      @click="goToValidate(5)"
                      no-caps
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item clickable @click="promptOffAccount = !promptOffAccount">
                <q-item-section>
                  <q-item-label>Suspendre un compte</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptOffAccount">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">Suspendre un Compte</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        v-model="userSelect"
                        :options="rows"
                        dense
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      icon-right="save"
                      @click="goToValidate(7)"
                      no-caps
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item
                clickable
                @click="promptChangePassword = !promptChangePassword"
              >
                <q-item-section>
                  <q-item-label>Changer un password</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptChangePassword">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">Changer un Mot de passe</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        v-model="userSelect"
                        :options="rows"
                        dense
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-btn
                        flat
                        label="Clicker pour Generer un nouveau Mot de passe"
                        color="blue"
                        @click="generateNewPassword"
                        no-caps
                      />
                    </div>
                    <div class="q-pb-md">
                      Copier Son Nouveau mot de passe qui sera :
                      {{ generatePassword }}
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      icon-right="save"
                      @click="promptValidation = true"
                      no-caps
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item clickable @click="promptSendAccount = !promptSendAccount">
                <q-item-section>
                  <q-item-label>Approvisionner un compte</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptSendAccount">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">Approvissionnement Compte</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        dense
                        v-model="userSelect"
                        :options="rows"
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le pays "
                        dense
                        v-model="pays"
                        :options="optionsPays"
                      />
                    </div>

                    <div class="q-pb-md">
                      <q-input
                        filled
                        stack-label
                        label="Credit"
                        v-model="nombre"
                        placeholder="Nombre de credit"
                        dense
                      />
                    </div>
                  </q-card-section>
                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      @click="goToValidate(4)"
                      icon-right="save"
                      no-caps
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
              <q-item
                v-show="admin"
                clickable
                @click="promptChangeTypeAccount = !promptChangeTypeAccount"
              >
                <q-item-section>
                  <q-item-label>Changer le type de compte</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptChangeTypeAccount">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">Changer un Type de compte</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        v-model="userSelect"
                        :options="rows"
                        dense
                      />
                    </div>
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Type de Compte"
                        :options="optionsTypeCompte"
                        v-model="typeCompteChoisit"
                        dense
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      icon-right="save"
                      no-caps
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>

              <q-item clickable @click="promptProjet = !promptProjet">
                <q-item-section>
                  <q-item-label>Creer un Projet</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptProjet">
                <q-card>
                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        filled
                        stack-label
                        label="Veuillez choisir le Compte"
                        v-model="userSelect"
                        :options="rows"
                        dense
                      />
                    </div>
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn
                      flat
                      label="Valider"
                      color="green"
                      icon-right="save"
                      no-caps
                      v-close-popup
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-list>
          </q-btn-dropdown>
          &nbsp;
          <q-btn-dropdown
            v-show="afficher"
            label="Imprimer un état"
            color="blue"
            no-caps
          >
            <q-list separator class="bg-blue" :dense="true">
              <q-item clickable @click="promptPrintSolde = !promptPrintSolde">
                <q-item-section>
                  <q-item-label>Solde (SMS)</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptPrintSolde">
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">Impression des soldes Clients</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <q-btn
                      flat
                      class="full-width bg-green"
                      label="Imprimer"
                      icon-right="save"
                      no-caps
                      v-close-popup
                      @click="imprimer"
                    />
                  </q-card-section>
                </q-card>
              </q-dialog>
              <q-item
                clickable
                @click="promptPrintConsommation = !promptPrintConsommation"
              >
                <q-item-section>
                  <q-item-label>Consommation</q-item-label>
                </q-item-section>
              </q-item>
              <q-dialog v-model="promptPrintConsommation" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <div class="text-h6">
                      Impression des Consommations Client
                    </div>
                    <q-space></q-space>
                    <q-btn
                      icon="close"
                      flat
                      color="red"
                      round
                      dense
                      v-close-popup
                    />
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-md">
                    <div class="q-pb-md">
                      <q-select
                        stack-label
                        filled
                        label="Selectionner un Client"
                      >
                      </q-select>
                    </div>
                    <div class="q-pb-xl">
                      <q-btn
                        flat
                        class="full-width bg-green"
                        label="Imprimer pour le client choisir"
                        icon-right="save"
                        no-caps
                        v-close-popup
                      />
                    </div>
                    <div class="q-pb-lg">
                      <q-btn
                        flat
                        class="full-width bg-green"
                        label="Imprimer toute les consommations"
                        icon-right="save"
                        no-caps
                        v-close-popup
                      />
                    </div>
                    <div class="q-pb-md">
                      <div class="row q-col-gutter-md">
                        <div class="col-md-6">
                          <q-input
                            filled
                            v-model="date"
                            label="Date debut"
                            mask="date"
                            :rules="['date']"
                          >
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy
                                  ref="qDateProxy"
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-date v-model="date">
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
                        <div class="col-md-6">
                          <q-input
                            filled
                            v-model="date"
                            label="Date fin"
                            mask="date"
                            :rules="['date']"
                          >
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy
                                  ref="qDateProxy"
                                  cover
                                  transition-show="scale"
                                  transition-hide="scale"
                                >
                                  <q-date v-model="date">
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
                      </div>
                    </div>
                    <div class="q-pb-md">
                      <q-btn
                        flat
                        class="full-width bg-green"
                        label="Imprimer pour la periode choisir"
                        icon-right="save"
                        no-caps
                        v-close-popup
                      />
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-list>
          </q-btn-dropdown>
          &nbsp;
          <q-btn color="blue" text-color="white" @click="afficher = !afficher">
            {{ !afficher ? 'Voir Plus' : 'Voir Moins' }}
          </q-btn>
        </div>

        <div class="border-radius-inherit">
          <div class="bg-grey-9 q-py-sm text-subtitle1 q-px-xs text-grey-4">
            {{ $t('su.l') }}
          </div>
          <div class="q-py-lg q-px-sm" id="details">
            <q-table
              separator="cell"
              :rows="rows"
              :columns="columns"
              row-key="nom"
              :filter="filter"
              :loading="loadingTable"
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
                  <q-th>Opérations</q-th>
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
                  <q-td key="phone" :props="props">
                    {{ props.row.phone }}
                  </q-td>
                  <q-td key="username" :props="props">
                    {{ props.row.username }}
                  </q-td>
                  <q-td key="solde" :props="props">
                    {{ props.row.solde }}
                  </q-td>
                  <q-td key="organisation" :props="props">
                    {{ props.row.organisation }}
                  </q-td>
                  <q-td>
                    <q-btn
                      icon="add"
                      size="sm"
                      @click="ajouterSms(props.row.id, props.row.username)"
                      round
                    ></q-btn>
                    <q-dialog v-model="promptCrediterAccount">
                      <q-card>
                        <q-card-section class="row items-center">
                          <div class="text-h6">
                            Approvissionnement du Compte de
                            {{ nomManageClient }}
                          </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none q-pb-md">
                          <div class="q-pb-md">
                            <q-select
                              filled
                              stack-label
                              label="Veuillez choisir le pays "
                              dense
                              v-model="pays"
                              :options="optionsPays"
                            />
                          </div>

                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Credit"
                              v-model="nombre"
                              placeholder="Nombre de credit"
                              dense
                            />
                          </div>
                        </q-card-section>
                        <q-card-actions align="right" class="text-primary">
                          <q-btn
                            flat
                            label="Valider"
                            color="green"
                            @click="promptValidation = !promptValidation"
                            icon-right="save"
                            no-caps
                            v-close-popup
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                    &nbsp;
                    <q-btn
                      icon="remove"
                      @click="reduireSms(props.row.id, props.row.username)"
                      size="sm"
                      round
                    ></q-btn>
                    &nbsp;
                    <q-dialog v-model="promptReduireAccount">
                      <q-card>
                        <q-card-section class="row items-center">
                          <div class="text-h6">
                            Reduction Du solde sms du Compte de
                            {{ nomManageClient }}
                          </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none q-pb-md">
                          <div class="q-pb-md">
                            <q-select
                              filled
                              stack-label
                              label="Veuillez choisir le pays "
                              dense
                              v-model="pays"
                              :options="optionsPays"
                            />
                          </div>

                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Credit"
                              v-model="nombre"
                              placeholder="Nombre de credit"
                              dense
                            />
                          </div>
                        </q-card-section>
                        <q-card-actions align="right" class="text-primary">
                          <q-btn
                            flat
                            label="Valider"
                            color="green"
                            @click="promptValidation = !promptValidation"
                            icon-right="save"
                            no-caps
                            v-close-popup
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>

                    <q-btn
                      icon="edit"
                      @click="
                        modifyClientAccount(
                          props.row.id,
                          props.row.username,
                          props.row.firstname,
                          props.row.phone,
                          props.row.organisation,
                          props.row.mail
                        )
                      "
                      size="sm"
                      round
                    ></q-btn>
                    &nbsp;
                    <q-dialog v-model="promptModifyAccount">
                      <q-card>
                        <q-card-section class="row items-center">
                          <div class="text-h6">
                            Modifier le compte de votre client
                            {{ nomManageClient }}
                          </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none q-pb-md">
                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Nom"
                              placeholder="Nom..."
                              v-model="selectNom"
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
                              v-model="selectPrenom"
                              dense
                            />
                          </div>
                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Phone"
                              v-model="selectPhone"
                              placeholder="Telephone..."
                              dense
                            />
                          </div>
                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              v-model="selectEntreprise"
                              label="Organisation"
                              placeholder="Organisation..."
                              dense
                            />
                          </div>

                          <div class="q-pb-md">
                            <q-input
                              filled
                              stack-label
                              label="Email"
                              v-model="selectMail"
                              placeholder="Email..."
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
                            v-show="!loadingPatchUser"
                            v-close-popup
                          />
                          <q-btn
                            flat
                            label="Modifer le Compte"
                            color="green"
                            icon-right="save"
                            :loading="loadingPatchUser"
                            no-caps
                            @click="promptValidation = !promptValidation"
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                    <q-btn
                      icon="delete"
                      @click="disabledClientAccount(props.row.id)"
                      size="sm"
                      round
                    ></q-btn>

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
                            @click="validate(action)"
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
import { Cookies, useQuasar } from 'quasar';
import { jsPDF } from 'jspdf';
import { RequestApi } from 'boot/RequestApi';
const columns = [
  {
    name: 'phone',
    required: true,
    label: 'Numero',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any
    field: 'phone',
    sortable: true,
  },
  {
    name: 'username',
    align: 'center',
    label: 'Noms & Prenoms',
    field: 'username',
    sortable: true,
  },
  {
    name: 'solde',
    align: 'center',
    label: 'Solde (SMS)',
    field: 'solde',
    sortable: true,
  },
  {
    name: 'organisation',
    align: 'center',
    label: 'Organisation',
    field: 'organisation',
    sortable: true,
  },
];

import { useMeta } from 'quasar';

const metaData = {
  // sets document title
  title: 'Admin page',
  // optional; sets final title as "Index Page - My Website", useful for multiple level meta
  titleTemplate: (title: string) => String(title),
};
export default defineComponent({
  name: 'SuperAdmin',

  setup() {
    onMounted(async () => {
      admin.value = Cookies.get('admin');
      console.log('voici admin...', admin.value);

      addScript(
        'https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js'
      );
      await getPays();
      await getAllUsers();
    });

    const rows = ref([
      {
        id: 0,
        firstname: '',
        surname: '',
        phone: 'Aucun',
        username: 'Aucun',
        label: 'Aucun',
        solde: 0,
        mail: '',
        organisation: 'Aucun',
      },
    ]);
    const addScript = (url: string) => {
      var script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      document.head.appendChild(script);
    };
    const userSelect = ref({
      id: 0,

      phone: '',
      username: 'Aucun',
      label: 'Aucun',

      solde: 0,
      organisation: '',
    });
    const $q = useQuasar();
    let password = ref('');
    let entreprise = ref('');
    let prenom = ref('');
    let nom = ref('');
    let phone = ref('');
    let mail = ref('');
    let loadingClientInfo = ref(true);
    let promptCrediterAccount = ref(false);

    let actionValidate = ref(false);
    let promptReduireAccount = ref(false);
    let nombre = ref(0);
    let loadingPatchUser = ref(false);
    let nomManageClient = ref('');

    let loadingCreationCompte = ref(false);
    let promptModifyAccount = ref(false);
    const search = ref('');
    const filter = ref('');
    const generatePassword = ref('');
    const loadingTable = ref(false);
    const promptValidation = ref(false);
    let selectEntreprise = ref('');
    let selectPrenom = ref('');
    let selectNom = ref('');
    let selectPhone = ref('');
    let selectMail = ref('');
    const admin = ref(Cookies.get('admin'));
    let action = ref(0);
    const pays = ref({ id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] });
    const optionsPays = ref([{ id: 0, label: 'Aucun' }]);
    const loadingPays = ref(true);
    let idManageClient = ref(0);
    let typeCompteChoisit = ref({
      roles: ['ROLE_CLIENT'],
      label: '',
    });
    const optionsTypeCompte =
      admin.value == '0'
        ? ref([
            {
              roles: ['ROLE_CLIENT'],
              label: 'Compte Client',
            },
            {
              roles: ['ROLE_CLIENT', 'ROLE_ADMIN'],
              label: 'Compte Administrateur',
            },
          ])
        : ref([
            {
              roles: ['ROLE_CLIENT'],
              label: 'Compte Client',
            },
          ]);
    const getAllUsers = async () => {
      var response: any;
      // loadingGroupes.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (admin.value == '1') {
        console.log('admin....', admin.value);
        response = await new RequestApi().getAllUserAction();
      } else {
        console.log('noo....admin....', admin.value);
        response = await new RequestApi().getParrainUserAction();
      }
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        rows.value = response.data.map((x: any) => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: x.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            phone: x.phone,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            username: x.name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            firstname: x.firstname,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            mail: x.mail,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            surname: x.surname,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            label: x.name,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            solde: x.solde,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            organisation: x.organisation,
          };
        });
      } else {
        $q.notify({
          message: 'Erreur lors du chargement des Utilisateurs',
          type: 'negative',
        });
      }
      // loadingGroupes.value = false;
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
    const creerCompte = async () => {
      var data = {
        nom: nom.value,
        prenom: prenom.value,
        phone: phone.value,
        password: password.value,
        nomEntreprise: entreprise.value,
        email: mail.value,
        roles: typeCompteChoisit.value.roles,
        codeParrain: Cookies.get('id'),
      };
      if (
        nom.value.length == 0 ||
        prenom.value.length == 0 ||
        phone.value.length == 0 ||
        password.value.length == 0 ||
        entreprise.value.length == 0 ||
        mail.value.length == 0
      ) {
        console.log(
          nom.value.length,
          prenom.value.length,
          phone.value.length,
          password.value.length,
          entreprise.value.length,
          mail.value.length
        );
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Veuillez remplir tout les champs',
          icon: 'report_problem',
        });
      } else {
        loadingCreationCompte.value = true;
        const response = await new RequestApi().signUp(data);
        await getAllUsers();
        if (response.status) {
          (nom.value = ''),
            (prenom.value = ''),
            (phone.value = ''),
            (password.value = ''),
            (entreprise.value = ''),
            (mail.value = ''),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
            $q.notify({
              color: 'positive',
              position: 'top',
              message: "La creation de compte s'est deroule avec succes",
              icon: 'report_correct',
            });

          loadingCreationCompte.value = false;
        } else {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Une Erreur est survenue lors de votre inscription',
            icon: 'report_problem',
          });

          loadingCreationCompte.value = false;
        }
      }
    };
    const desactivateUser = async (type: number) => {
      const data = {
        clientId: type == 0 ? idManageClient.value : userSelect.value.id,

        status: false,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().desactivateUserAction(data);
      //  console.log('get qte statu', response.data);
      if (response.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        promptValidation.value = false;
        $q.notify({
          message: 'Desactivation du compte effectuee avec succes',
          type: 'positive',
        });
      } else {
        promptValidation.value = false;
        $q.notify({
          message: 'Erreur lors de la Mise a jour de vos information',
          type: 'negative',
        });
      }
    };
    /**
     * @argument type si 0 => reduction , 1 => augmentation
     * @argument selectH si 0 => selectionne depuis la liste du home , 1 => selectionne depuis le drawer
     *
     */
    const manageSoldeSmsCLient = async (type: number, selectH: number) => {
      console.log('voici type', type);
      var data = {
        clientId: selectH == 0 ? idManageClient.value : userSelect.value.id,
        routeId: pays.value.routes[0].id,
        nombre: nombre.value,
      };
      if (
        nombre.value <= 0 ||
        (userSelect.value.id == 0 && idManageClient.value == 0) ||
        pays.value.routes[0].id == 0
      ) {
        promptValidation.value = false;
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Veuillez remplir tout les champs',
          icon: 'report_problem',
        });
      } else {
        console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        const response = await new RequestApi().manageSoldeSmsCLientAction(
          data,
          type
        );

        if (response.status == 2) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
          await getAllUsers();
          $q.notify({
            color: 'positive',
            position: 'top',
            message: "La manipulation de compte s'est deroule avec succes",
            icon: 'report_correct',
          });
          promptValidation.value = false;
          nombre.value = 0;
          userSelect.value = {
            id: 0,
            phone: '',
            username: 'Aucun',
            label: 'Aucun',
            solde: 0,
            organisation: '',
          };

          pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] };
          // loadingCreationCompte.value = false;
        } else if (response.status == 0) {
          $q.notify({
            color: 'negative',
            position: 'top',
            message:
              "Impossible d'effectuer cette operation car solde sms inferieur a ".concat(
                nombre.value.toString()
              ),
            icon: 'report_problem',
          });
          nombre.value = 0;
          userSelect.value = {
            id: 0,
            phone: '',
            username: 'Aucun',
            label: 'Aucun',
            solde: 0,
            organisation: '',
          };
          pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] };
          // loadingCreationCompte.value = false;
        } else {
          $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Une Erreur est survenue lors de votre operation',
            icon: 'report_problem',
          });
          nombre.value = 0;
          userSelect.value = {
            id: 0,

            phone: '',
            username: 'Aucun',
            label: 'Aucun',

            solde: 0,
            organisation: '',
          };
          pays.value = { id: 0, label: 'Aucun', routes: [{ id: 0, prix: 0 }] };
          // loadingCreationCompte.value = false;
        }
      }
      promptValidation.value = false;
    };
    const patchPassword = async () => {
      const data = {
        clientId: userSelect.value.id,
        password: generatePassword.value,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response1: any = await new RequestApi().pathPasswordAction2(data);
      //  console.log('get qte statu', response.data);
      if (response1.status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any

        $q.notify({
          message: 'Mise a jour de vos informations effectuee avec succes',
          type: 'positive',
        });
        password.value = '';
      } else {
        password.value = '';
        $q.notify({
          message: 'Erreur lors de la Mise a jour de vos information',
          type: 'negative',
        });
      }
    };
    const ajouterSms = (idClient: number, nomClient: string) => {
      action.value = 0;
      console.log(promptCrediterAccount.value);
      nomManageClient.value = nomClient;
      idManageClient.value = idClient;
      promptCrediterAccount.value = !promptCrediterAccount.value;
      console.log(promptCrediterAccount.value);
    };
    const reduireSms = (idClient: number, nomClient: string) => {
      console.log(promptReduireAccount.value);
      action.value = 1;
      nomManageClient.value = nomClient;
      idManageClient.value = idClient;
      promptReduireAccount.value = !promptReduireAccount.value;
      console.log(promptReduireAccount.value);
    };
    const modifyClientAccount = (
      idClient: number,
      nomClient: string,
      prenomClient: string,
      telephone: string,
      organisation: string,
      email: string
    ) => {
      action.value = 2;
      console.log(promptModifyAccount.value);
      selectNom.value = nomClient;
      selectPrenom.value = prenomClient;
      selectPhone.value = telephone;
      selectEntreprise.value = organisation;
      selectMail.value = email;
      idManageClient.value = idClient;
      loadingClientInfo.value = true;
      promptModifyAccount.value = !promptModifyAccount.value;
      console.log(
        selectNom.value,
        selectPrenom.value,
        selectPhone.value,
        selectMail.value
      );
    };
    const disabledClientAccount = (idClient: number) => {
      action.value = 3;
      console.log(promptModifyAccount.value);
      promptValidation.value = !promptValidation.value;
      idManageClient.value = idClient;
    };
    const patchUser = async () => {
      const data = {
        clientId: idManageClient.value,
        nom: selectNom.value,
        prenom: selectPrenom.value,
        email: selectMail.value,
        phone: selectPhone.value,
        nomEntreprise: selectEntreprise.value,
      };
      // if (loadingPatchUser.value == false) {
      loadingPatchUser.value = true;
      //   if (confirmPassword.value != '') {
      //     await api
      //       .post('/api/auth', {
      //         phone: Cookies.get('phone'),
      //         password: confirmPassword.value.toString(),
      //       })
      //       .then(async (response) => {
      //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //         if (response.status == 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().pathUserAction(data, 1);
      //  console.log('get qte statu', response.data);
      if (response.status) {
        await getAllUsers();
        promptValidation.value = false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-explicit-any
        loadingPatchUser.value = false;
        // confirmPassword.value = '';

        $q.notify({
          message: 'Mise a jour de vos information effectuee avec succes',
          type: 'positive',
        });
      } else {
        promptValidation.value = false;
        // confirmPassword.value = '';
        loadingPatchUser.value = false;
        $q.notify({
          message: 'Erreur lors de la Mise a jour de vos information',
          type: 'negative',
        });
      }
      //         } else {
      //           loadingPatchUser.value = false;
      //           // confirmPassword.value = '';
      //           $q.notify({
      //             message: 'Mot de passe utilisateur incorrect',
      //             type: 'negative',
      //           });
      //         }
      //       })
      //       .catch((e) => {
      //         console.log(e);
      //       });
      //   } else {
      //       loadingPatchUser.value = false;
      //     $q.notify({
      //       message: 'Veuillez entrer un mot de passe',
      //       type: 'negative',
      //     });
      //   }
      // } else {
      //     loadingPatchUser.value = false;
      //   $q.notify({
      //     message: 'Une Mise a Jour est en cours',
      //     type: 'negative',
      //   });
      // }
      promptValidation.value = false;
    };
    const goToValidate = (act: number) => {
      promptValidation.value = true;
      action.value = act;
    };
    const generateNewPassword = () => {
      action.value = 8;
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result1 = ' ';
      const charactersLength = characters.length;
      for (let i = 0; i < 7; i++) {
        result1 += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      generatePassword.value = result1.trim();
      console.log(generatePassword.value);
    };
    /**
     * @argument action permet de determiner quel fonction sera appellee
     * @argument params represente un tableau contenant les attribut des fonctions a appeler
     *
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validate = async (action: number) => {
      actionValidate.value = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await new RequestApi().logIn(
        Cookies.get('phone'),
        password.value
      );
      console.log(action, response.status);
      if (response.status) {
        /**
         * action == 0  approvisionemnt d'un user depuis list
         */
        if (action == 0) {
          console.log('AugmentaTION SOLDE CLIENT');
          await manageSoldeSmsCLient(1, 0);
        } else if (action == 1) {
          /**
           * action == 1  reduction d'un user depuis list
           */
          await manageSoldeSmsCLient(0, 0);
        } else if (action == 2) {
          /**
           * action == 2  modification d'un user depuis list
           */
          await patchUser();
        } else if (action == 3) {
          /**
           * action == 3  desactiver un user depuis list
           */
          await desactivateUser(0);
        } else if (action == 4) {
          /**
           * action == 4  approvisionemnt d'un user select
           */
          console.log('AugmentaTION SOLDE CLIENT');
          await manageSoldeSmsCLient(1, 1);
        } else if (action == 5) {
          /**
           * action == 5  reduction d'un user select
           */
          await manageSoldeSmsCLient(0, 1);
        } else if (action == 6) {
          /**
           * action == 6  modification d'un user select
           */
          await patchUser();
        } else if (action == 7) {
          /**
           * action == 7  desactiver un user depuis list
           */
          await desactivateUser(1);
        } else if (action == 8) {
          await patchPassword();
        }
        actionValidate.value = false;
      } else {
        // confirmPassword.value = '';
        actionValidate.value = false;
        $q.notify({
          message: 'Mot de passe Incorrect',
          type: 'negative',
        });
      }
    };
    // const params = '';
    const imprimer = async () => {
      let table = document.createElement('div');
      table.style.alignContent = 'center';
      let imgheader = document.createElement('img');
      imgheader.src = 'src\assets\devoo_blue.png';
      imgheader.align = 'right';
      imgheader.height = 44;
      imgheader.width = 100;
      imgheader.style.alignContent = 'right';
      imgheader.style.marginBottom = '10px';

      let titre = document.createElement('div');
      titre.innerText = 'Liste des Soldes Sms Clients';
      titre.style.marginTop = '100px';
      titre.style.margin = 'auto';
      titre.style.textAlign = 'center';
      titre.style.border = '3px solid green';
      titre.style.padding = '10px';
      let tbl = document.createElement('table');
      tbl.style.width = '100%';
      tbl.style.border = '1px solid black';
      const tr = tbl.insertRow();
      tr.style.border = '1px solid black';
      const td = tr.insertCell();

      const td0 = tr.insertCell();
      const td1 = tr.insertCell();
      const td2 = tr.insertCell();
      td.appendChild(document.createTextNode('Nom'));

      td0.appendChild(document.createTextNode('phone'));

      td1.appendChild(document.createTextNode('Organisation'));

      td2.appendChild(document.createTextNode('Solde'));
      for (let i = 0; i < rows.value.length; i++) {
        const tr0 = tbl.insertRow();
        tr0.style.border = '1px solid black';
        const td = tr0.insertCell();
        td.style.border = '1px solid black';
        const td0 = tr0.insertCell();
        td0.style.border = '1px solid black';
        const td1 = tr0.insertCell();
        td1.style.border = '1px solid black';
        const td2 = tr0.insertCell();
        td2.style.border = '1px solid black';
        td.appendChild(
          document.createTextNode(rows.value[i].username.toString())
        );

        td0.appendChild(
          document.createTextNode(rows.value[i].phone.toString())
        );

        td1.appendChild(
          document.createTextNode(rows.value[i].organisation.toString())
        );

        td2.appendChild(
          document.createTextNode(rows.value[i].solde.toString())
        );
      }
      table.appendChild(imgheader);
      table.appendChild(titre);
      table.appendChild(tbl);
      const doc = new jsPDF('portrait', 'px', 'a4');
      await doc.html(table, {
        callback: function (doc) {
          doc.save('etat.pdf');
        },

        html2canvas: {
          // insert html2canvas options here, e.g.
          // width: 250,
        },
      });
    };

    useMeta(metaData);

    return {
      nomManageClient,
      generatePassword,
      idManageClient,
      search,
      loadingTable,
      filter,
      $q,
      goToValidate,
      rows,
      columns,
      promptCreateAccount: ref(false),
      promptReduireAccount,
      promptCrediterAccount,
      promptModifyAccount,
      promptLessSolde: ref(false),
      promptOffAccount: ref(false),
      promptChangePassword: ref(false),
      promptSendAccount: ref(false),
      promptChangeTypeAccount: ref(false),
      promptProjet: ref(false),
      promptPrintSolde: ref(false),
      promptPrintConsommation: ref(false),
      date: ref('2019-02-01 12:44'),
      desactivateUser,
      optionsTypeCompte,
      typeCompteChoisit,
      phone,
      password,
      entreprise,
      prenom,
      nom,
      mail,
      creerCompte,
      loadingCreationCompte,
      userSelect,
      nombre,
      optionsPays,
      pays,
      manageSoldeSmsCLient,
      patchPassword,
      ajouterSms,
      reduireSms,
      modifyClientAccount,
      afficher: ref(false),
      loadingClientInfo,
      selectNom,
      selectMail,
      selectEntreprise,
      selectPhone,
      selectPrenom,
      loadingPatchUser,
      patchUser,
      promptValidation,
      validate,
      action,
      disabledClientAccount,
      generateNewPassword,
      imprimer,
      actionValidate,
      admin,
    };
  },
});
</script>
