/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { api } from './axios';

import { Cookies } from 'quasar';

import { formatDate } from 'boot/formatDate';
import jwt_decode from 'jwt-decode';
export class RequestApi {
  clientId: string = Cookies.get('id');
  decode = { nom: '', prenom: '', phone: '' };

  getClient = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any

    await api
      .get('/api/clients')
      .then(() => {
        //console.log('');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      })
      .catch(() => {
        //console.log('');
      });
  };

  getVitrineInfo = async (vitrine: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const data = {
      vitrine: vitrine,
    };
    console.log(data);
    await api
      .post('/vitrine/user', data)
      .then((response) => {
        //console.log('');
        dataRes = {
          status: true,
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };
  getVitrineAdmin = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/sections?page.vitrine=1')
      .then((response) => {
        //console.log('');
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
  };
  newMessageAction = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .post('/sendSmsApi', data)
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  signUp = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .post('/api/clients', data)
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
  };
  pathContactAction = async (id: number, data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      .patch('/api/contacts/'.concat(id.toString()), data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };
  getDefaultContactGroupeAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; id: number } = { status: true, id: 0 };

    await api
      .get(
        '/api/groupe_contacts?clientId='.concat(this.clientId) + '&status=false'
      )
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: response.data['hydra:member'][0]['@id'],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          id: 0,
        };
      });
    return dataRes;
  };
  deletteGroupeContactAction = async (
    contactId: number,
    groupeContactId: number
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    const responseA = await this.getDefaultContactGroupeAction();
    await api
      .get(
        '/api/list_groupe_contacts?contact='.concat(contactId.toString()) +
          '&groupeContact='.concat(groupeContactId.toString())
      )
      .then(async (response) => {
        dataRes = {
          status: true,
        };
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          await api
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            .patch(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              response.data['hydra:member'][i]['@id'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              { groupeContact: responseA.id },
              {
                headers: {
                  'Content-Type': 'application/merge-patch+json',
                },
              }
            )
            .then((response) => {
              dataRes = {
                status: true,
              };
            })
            .catch(() => {
              dataRes = {
                status: false,
              };
            });
        }
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };

  addContacttoGroupeAction = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    await api
      .post('/api/list_groupe_contacts', data)
      .then(() => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };
  // deletteGroupeContactAction = async (id: number, data: unknown) => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  //   let dataRes: { status: boolean } = { status: true };
  //   //console.log(data);
  //   await api
  //     .patch('/api/list_groupe_contacts/'.concat(id.toString()), data, {
  //       headers: {
  //         'Content-Type': 'application/merge-patch+json',
  //       },
  //     })
  //     .then((response) => {
  //       dataRes = {
  //         status: true,
  //       };
  //     })
  //     .catch(() => {
  //       dataRes = {
  //         status: false,
  //       };
  //     });
  //   return dataRes;
  // };
  getSmsAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/sms?clientId='.concat(this.clientId))
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
  };
  getSmsActionCustom = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes = { status: true, data: [] };

    await api
      .post('/sms/read', { keySecret: Cookies.get('keySecret') })
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };
  getListLotSmsEnvoyeAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const data: {
      message: string;
      senderId: string;
      status: boolean;
      destinataire: string;
      date: string;
    }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let message: {
      message: string;
      senderId: string;
      status: boolean;
      destinataire: string;
      date: string;
    } = {
      message: '',
      senderId: '',
      status: true,
      destinataire: '',
      date: formatDate(new Date()),
    };
    await api
      .get('/api/list_sms_lots_envoyes?sms.clientId='.concat(this.clientId))
      .then((response) => {
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          //console.log(response.data['hydra:member'][i]['sms']['message']);
          for (
            let j = 0;
            j < response.data['hydra:member'][i]['listSmsContacts'].length;
            j++
          ) {
            message = {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              message: response.data['hydra:member'][i]['sms']['message'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              senderId:
                response.data['hydra:member'][i]['sms']['senderId']['senderId'],
              status: true,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              destinataire:
                response.data['hydra:member'][i]['listSmsContacts'][j][
                  'contact'
                ]['phone'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              date: formatDate(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                new Date(response.data['hydra:member'][i]['dateCreated'])
              ),
            };
            data.push(message);
          }
        }

        dataRes = {
          status: true,
          data: <[]>data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  getListGroupForContactAction = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const data: {
      id: number;
      label: string;
    }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let groupe: {
      id: number;
      label: string;
    } = {
      id: 0,
      label: 'string',
    };
    await api
      .get('/api/contacts/'.concat(id))
      .then((response) => {
        for (let i = 0; i < response.data['listGroupeContacts'].length; i++) {
          if (
            response.data['listGroupeContacts'][i]['groupeContact']['status'] ==
            true
          ) {
            groupe = {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: response.data['listGroupeContacts'][i]['groupeContact']['id'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              label:
                response.data['listGroupeContacts'][i]['groupeContact']['nom'],
            };

            data.push(groupe);
          }
        }

        dataRes = {
          status: true,
          data: <[]>data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };
  getListContactAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const data: {
      nom: string;
      id: string;
      prenom: string;
      phone: string;
      date: string;
    }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let contact: {
      nom: string;
      id: string;
      prenom: string;
      phone: string;
      date: string;
    } = {
      id: '',
      nom: '',
      prenom: '',
      phone: '',
      date: formatDate(new Date()),
    };
    await api
      .get('/api/contacts?clientId='.concat(this.clientId))
      .then((response) => {
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          contact = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: response.data['hydra:member'][i]['id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            nom: response.data['hydra:member'][i]['nom'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            prenom: response.data['hydra:member'][i]['prenom'],

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            phone: response.data['hydra:member'][i]['phone'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            date: formatDate(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(response.data['hydra:member'][i]['dateCreated'])
            ),
          };

          data.push(contact);
        }

        dataRes = {
          status: true,
          data: <[]>data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  getUserAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/clients/'.concat(this.clientId))
      .then((response) => {
        dataRes = {
          status: true,
          data: <[]>response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  desactivateUserAction = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      .patch('/desactivate/client', data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };
  pathUserAction = async (data: unknown, connected: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      .patch('/update/profil/client', data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        if (connected == 0) {
          api.defaults.headers.common['Authorization'] =
            'Bearer ' + String(response.data.token);
          Cookies.set('token', String(response.data.token));
          Cookies.set('refreshToken', String(response.data.refreshToken));
          this.decode = jwt_decode(String(response.data.token));
          Cookies.set('nom', String(this.decode.nom));
          Cookies.set('prenom', String(this.decode.prenom));
          Cookies.set('phone', String(this.decode.phone));
        }
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };

  pathPasswordAction = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      .patch('/update/password/client', data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        api.defaults.headers.common['Authorization'] =
          'Bearer ' + String(response.data.token);
        Cookies.set('token', String(response.data.token));
        Cookies.set('refreshToken', String(response.data.refreshToken));
        this.decode = jwt_decode(String(response.data.token));
        Cookies.set('nom', String(this.decode.nom));
        Cookies.set('prenom', String(this.decode.prenom));
        Cookies.set('phone', String(this.decode.phone));

        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };

  pathDataAction = async (uri: string, data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: any } = { status: true, data: [] };
    //console.log(data);
    await api
      .patch(uri, data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  pathPasswordAction2 = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      .patch('/update/password/client', data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then((response) => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };
  logIn = async (number: number, password: string) => {
    //console.log('sdddsd');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };

    await api
      .post('/api/auth', {
        phone: number.toString(),
        password: password.toString(),
      })
      .then(() => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        };
        // api.defaults.headers.common['Authorization'] =
        //   'Bearer ' + String(response.data.token);
        // Cookies.set('token', String(response.data.token));
        // Cookies.set('refreshToken', String(response.data.refreshToken));
        // this.decode = jwt_decode(String(response.data.token));
        // Cookies.set('nom', String(this.decode.nom));
        // Cookies.set('prenom', String(this.decode.prenom));
        // Cookies.set('phone', String(this.decode.phone));
        // Cookies.set('id', parseInt(String(this.decode.id)));
        // //console.log(Cookies.get('nom')); // Cookies.set('decode', this.decode);
        // // eslint-disable-next-line @typescript-eslint/no-floating-promises
        // $router.replace({ name: 'Admin' });
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };
  getPaysAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/pays')
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
  };

  getModePaiementAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/mode_paiements')
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
  };

  async getQteSmsAction() {
    let dataRes;

    await api
      .get('/api/comptes?clientId='.concat(this.clientId) + '&typeCompte=1')
      .then((response) => {
        dataRes = {
          status: true,
          qte: response.data['hydra:member'][0]['solde'],
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

  // getQteSmsAction = async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
  //   let dataRes: { status: boolean; qte: number } = { status: true, qte: 0 };

  //   await api
  //     .get('/api/list_s_m_s_achettes?facture.clientId='.concat(this.clientId))
  //     .then((response) => {
  //       let qte = 0;

  //       for (let i = 0; i < response.data['hydra:member'].length; i++) {
  //         qte =
  //           qte +
  //           // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  //           // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //           parseInt(response.data['hydra:member'][i]['quantite']);
  //       }

  //       dataRes = {
  //         status: true,
  //         qte: qte,
  //       };
  //     })
  //     .catch(() => {
  //       dataRes = {
  //         status: false,
  //         qte: 0,
  //       };
  //     });
  //   return dataRes;
  // };

  getLicenceSmsAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/licences/1')
      .then((response) => {
        dataRes = {
          status: true,
          data: <[]>response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    return dataRes;
  };
  // getTranchesSmsAction
  getTranchesSmsAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/tranche_sms')
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
  };

  getAllUserAction = async () => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const dataFinal: {
      id: number;
      phone: string;
      name: string;
      firstname: string;
      surname: string;
      mail: string;
      organisation: string;
      solde: number;
    }[] = [];
    let User: {
      id: number;
      phone: string;
      name: string;
      firstname: string;
      surname: string;
      mail: string;

      organisation: string;
      solde: number;
    } = {
      id: 0,
      phone: '',
      name: '',
      mail: '',
      firstname: '',
      surname: '',
      organisation: '',
      solde: 0,
    };
    await api
      .get('/api/clients')
      .then(async (response) => {
        // dataRes = {
        //   status: true,
        //   data: <[]>response.data['hydra:member'],
        // };
        dataFinal.pop();
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          const data = await this.getCustomLSAAction(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.data['hydra:member'][i]['id']
          );
          if (response.data['hydra:member'][i]['id'] != this.clientId) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            User = {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: response.data['hydra:member'][i]['id'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              phone: response.data['hydra:member'][i]['phone'],
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              name:
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                response.data['hydra:member'][i]['nom'] +
                ' ' +
                response.data['hydra:member'][i]['prenom'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              firstname:
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                response.data['hydra:member'][i]['nom'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              mail:
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                response.data['hydra:member'][i]['email'],
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              surname: response.data['hydra:member'][i]['prenom'],

              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              organisation: response.data['hydra:member'][i]['nomEntreprise'],
              solde: data.quantite,
            };
            dataFinal.push(User);
          }
        }
        dataRes = {
          status: true,
          data: <[]>dataFinal,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    return dataRes;
  };
  getParrainUserAction = async () => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const dataFinal: {
      id: number;
      phone: string;
      name: string;
      firstname: string;
      surname: string;
      mail: string;
      organisation: string;
      solde: number;
    }[] = [];
    let User: {
      id: number;
      phone: string;
      name: string;
      firstname: string;
      surname: string;
      mail: string;

      organisation: string;
      solde: number;
    } = {
      id: 0,
      phone: '',
      name: '',
      mail: '',
      firstname: '',
      surname: '',
      organisation: '',
      solde: 0,
    };
    await api
      .get('/api/clients ')
      .then(async (response) => {
        // dataRes = {
        //   status: true,
        //   data: <[]>response.data['hydra:member'],
        // };
        const datas = [];
        //console.log('aissisiis');
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            response.data['hydra:member'][i]['codeParrain'].split('@')[0] ==
            this.clientId
          ) {
            //console.log('00000000000');
            datas.push(response.data['hydra:member'][i]);
          } else {
            //console.log('111111111d11');
          }
        }
        //console.log(datas);
        for (let i = 0; i < datas.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          const data = await this.getCustomLSAAction(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            datas[i]['id']
          );

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          User = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: datas[i]['id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            phone: datas[i]['phone'],
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            name:
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              datas[i]['nom'] + ' ' + datas[i]['prenom'],

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            firstname:
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              datas[i]['nom'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            mail:
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              datas[i]['email'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            surname: datas[i]['prenom'],

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            organisation: datas[i]['nomEntreprise'],
            solde: data.quantite,
          };
          dataFinal.push(User);
        }
        dataRes = {
          status: true,
          data: <[]>dataFinal,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    return dataRes;
  };

  getCustomLSAAction = async (clientId: string) => {
    let dataRes: { status: boolean; quantite: number } = {
      status: true,
      quantite: 0,
    };
    let quantite = 0;
    await api
      .get(
        '/api/list_s_m_s_achettes?facture.licence=1&facture.clientId='.concat(
          clientId
        )
      )
      .then((response) => {
        // dataRes = {
        //   status: true,
        //   data: <[]>response.data['hydra:member'],
        // };
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          quantite += parseInt(response.data['hydra:member'][i]['quantite']);
        }
        dataRes = {
          status: true,
          quantite: quantite,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          quantite: 0,
        };
      });

    return dataRes;
  };

  crediterCompteAction = async (data: any) => {
    let dataRes = { status: true, data: [] };

    await api
      .post('/transaction/sms', data)
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data['hydra:member'],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  /**
   *
   * @param data doit contenir clientId, routeId, et le montant a reduire ou a ajouter
   * @param type si 0 il s'agit d'une reduction si 1 d'une augmentation
   * @returns status  0 aucun trouve, 1 erreur , 2 reussit
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manageSoldeSmsCLientAction = async (data: any, type: number) => {
    /**
     * @description status  0 aucun trouve, 1 erreur , 2 reussit
     */
    let dataRes: { status: number } = {
      status: 0,
    };

    const dataN = {
      clientId: this.clientId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      routeId: data.routeId,
    };
    let emetteur = '';
    let recepteur = '';
    let typeManipulation = '';
    const reqSU = await this.getLSAAUserction(dataN);
    const reqUser = await this.getLSAAUserction(data);
    //console.log('voici le type', type);
    if (reqSU.id.length == 0 || reqUser.id.length == 0) {
      //console.log('ici....', emetteur.length, recepteur.length);
      dataRes = {
        status: 0,
      };
    } else {
      if (type == 0) {
        recepteur = reqSU.id;
        emetteur = reqUser.id;
        typeManipulation = '/api/type_manipulations/2';
      } else {
        emetteur = reqSU.id;
        recepteur = reqUser.id;

        typeManipulation = '/api/type_manipulations/1';
      }
      const dataTrans = {
        clientId: 1,
        emetteur: emetteur,
        recepteur: recepteur,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        quantite: parseInt(data.nombre),
        typemanipulation: typeManipulation,
      };
      //console.log(dataTrans);
      await api
        .post('/api/list_sms_manipules', dataTrans)
        .then(() => {
          dataRes = {
            status: 2,
          };
        })
        .catch(() => {
          dataRes = {
            status: 1,
          };
        });
    }
    return dataRes;
  };
  getLSAAUserction = async (data: any) => {
    let dataRes: { status: boolean; id: string } = { status: true, id: '' };
    let qteFinal = 0;
    let idLsaFinal = '';
    //console.log('ooooooooooooooooooooooooo');
    await api
      .get(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        '/api/list_s_m_s_achettes?facture.clientId='.concat(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          data.clientId
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ) + '&routeId='.concat(data.routeId)
      )
      .then((response) => {
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

          if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            parseInt(response.data['hydra:member'][i]['quantite']) > qteFinal
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            qteFinal = response.data['hydra:member'][i]['quantite'];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            idLsaFinal = response.data['hydra:member'][i]['@id'];
          } else {
            qteFinal = qteFinal;
          }
        }

        dataRes = {
          status: true,
          id: qteFinal > 0 ? idLsaFinal : '',
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          id: '',
        };
      });
    //console.log(dataRes);
    return dataRes;
  };
  /**
   * @argument data doit contenir l'id de listsmsachete et la quatite a patcher
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pathLSAAction = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    //console.log(data);
    await api
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .patch('/api/list_s_m_s_achettes/'.concat(data.id), data, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        },
      })
      .then(() => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };

  getLSAQteAction = async () => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const dataFinal: {
      date: string;
      pays: string;
      quantite: string;
      status: boolean;
    }[] = [];
    let LSA: { date: string; pays: string; quantite: string; status: boolean } =
      { date: '', pays: '', quantite: '', status: true };
    await api
      .get(
        '/api/list_s_m_s_achettes?licence.factures.clientId='.concat(
          this.clientId
        )
      )
      .then(async (response) => {
        // dataRes = {
        //   status: true,
        //   data: <[]>response.data['hydra:member'],
        // };
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          const paysNom = await this.getPaysFromRouteAction(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.data['hydra:member'][i].routeId
          );

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          LSA = {
            date: formatDate(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(response.data['hydra:member'][i]['date'])
            ),
            pays: paysNom.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            quantite: response.data['hydra:member'][i]['quantite'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            status: response.data['hydra:member'][i]['status'],
          };
          dataFinal.push(LSA);
        }
        dataRes = {
          status: true,
          data: <[]>dataFinal,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    return dataRes;
  };

  getLSAAction = async () => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const dataFinal: {
      id: string;
      date: string;
      pays: string;
      quantite: string;
      status: boolean;
    }[] = [];
    let LSA: {
      id: string;
      date: string;
      pays: string;
      quantite: string;
      status: boolean;
    } = { id: '0', date: '', pays: '', quantite: '', status: true };
    await api
      .get('/api/list_s_m_s_achettes?facture.clientId='.concat(this.clientId))
      .then(async (response) => {
        // dataRes = {
        //   status: true,
        //   data: <[]>response.data['hydra:member'],
        // };
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars

          const paysNom = await this.getPaysFromRouteAction(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            response.data['hydra:member'][i].routeId
          );

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          LSA = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: response.data['hydra:member'][i]['id'],
            date: formatDate(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(response.data['hydra:member'][i]['date'])
            ),
            pays: paysNom.data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            quantite: response.data['hydra:member'][i]['quantite'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            status: response.data['hydra:member'][i]['status'],
          };
          dataFinal.push(LSA);
        }
        dataRes = {
          status: true,
          data: <[]>dataFinal,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  getPaysFromRouteAction = async (idRoute: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: string } = { status: true, data: '' };

    await api
      .get('/api/pays?routes='.concat(idRoute))
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: response.data['hydra:member'][0]['nom'],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: '',
        };
      });

    return dataRes;
  };

  getRouteFromPaysAction = async (idPays: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/routes?pays='.concat(idPays))
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
  };

  /**
   * @argument data doit contenir l'id de la route et l'id de la licence qu'il a choisit et la quantite d'sms
   */
  makeListSmsAcheteAction = async (data: {
    facture: string;
    routeId: number;
    quantite: number;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };

    await api
      .post('/api/list_s_m_s_achettes', data)
      .then(() => {
        dataRes = {
          status: true,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
        };
      });
    return dataRes;
  };

  /**
   * @argument data doit contenir l'id du client et l'id de la licence qu'il a choisit
   */
  buyLicenceSmSAction = async (data: {
    licence: string;
    routeId: number;
    quantite: number;
    montant: number;
    modePaiement: number;
  }) => {
    const dataFact = {
      licence: data.licence,
      clientId: parseInt(this.clientId),
      montant: data.montant,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean } = { status: true };
    const response = await this.makeFactureAction(dataFact);

    if (response.status) {
      const dataLsa = {
        facture: response.id,
        routeId: data.routeId,
        quantite: data.quantite,
      };
      const response0 = await this.makeListSmsAcheteAction(dataLsa);
      if (response0.status) {
        const dataPay = {
          montant: data.montant,
          type: 'MOBILE_MONEY',
          facture: response.id.split('/')[3],
          clientId: this.clientId,
          modePaiement: data.modePaiement.toString().split('/')[3],
        };
        //console.log('paiemmmmmmmmm');
        //console.log(dataPay);

        await this.makePaiementAction(dataPay);

        dataRes = {
          status: true,
        };
      } else {
        dataRes = {
          status: false,
        };
      }
    } else {
      dataRes = {
        status: false,
      };
    }

    return dataRes;
  };

  /**
   * @argument data doit contenir l'id du client et l'id de la licence qu'il a choisit
   */
  makeFactureAction = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; id: string } = { status: true, id: '' };

    await api
      .post('/api/factures', data)
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: response.data['@id'],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          id: '',
        };
      });
    return dataRes;
  };

  /**
   * @argument data doit contenir l'id du client et l'id de la licence qu'il a choisit
   */
  makePaiementAction = async (data: {
    montant?: number;
    type?: string;
    facture?: string;
    clientId?: string;
    modePaiement?: string;
    sourcePaiement?: any;
  }) => {
    let dataRes = {
      status: true,
      sourcePaiement: 2,
      typePaiement: 0,
      paymentUrl: '',
      paymentToken: '',
      idListSmsAchete: '',
    };
    //console.log(data);
    await api
      .post('/licence/paid', data)
      .then((response) => {
        // //console.log(JSON.parse(response));
        //console.log('response........');

        if (data.sourcePaiement == 1) {
          dataRes = {
            status: true,
            sourcePaiement: 1,
            paymentUrl: response.data['message'],
            typePaiement: 0,
            paymentToken: '',
            idListSmsAchete: '',
          };
        } else {
          if (response.data['code'] == 201) {
            dataRes = {
              status: true,
              typePaiement: 0,
              sourcePaiement: 2,
              paymentUrl: response.data['payment_url'],
              paymentToken: response.data['payment_token'],
              idListSmsAchete: response.data['idListSmsAchete'],
            };
          } else {
            dataRes = {
              status: false,
              sourcePaiement: 2,
              typePaiement: 0,
              paymentUrl: '',
              paymentToken: '',
              idListSmsAchete: '',
            };
          }
        }
      })
      .catch(() => {
        dataRes = {
          status: false,
          sourcePaiement: 2,
          typePaiement: 0,
          paymentUrl: '',
          paymentToken: '',
          idListSmsAchete: '',
        };
      });
    return dataRes;
  };

  /**
   * quantite
   * token
   * modePaiement
   * idListSmsAchete
   *
   */
  async waitStateLicenceTransaction(data: unknown) {
    let dataRes;
    await api
      .post('/licence/notify', data)
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data,
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

  createSenderIdAction = async (senderId: string) => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    const dataSenderId = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      senderId: senderId,
      description: 'string',
      status: true,
      clientId: this.clientId,
    };

    await api
      .post('/api/sender_ids', dataSenderId)
      .then((response1) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data: <[]>response1.data,
        };
        //console.log('xxxxxxxxxxx cas................', response1.data);
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return dataRes;
  };

  findSenderIdAction = async (senderId: string) => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/sender_ids?senderId='.concat(senderId))
      .then(async (response) => {
        if (response.data['hydra:member'].length == 0) {
          const rep = await this.createSenderIdAction(senderId);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes = {
            status: rep['status'], // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data: rep['data'],
          };
          //console.log('premier cas................', dataRes);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes = {
            status: true,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            data: <[]>response.data['hydra:member'],
          };
          //console.log('second cas................');
        }
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  getListGroupe = async () => {
    await api
      .get('/api/groupe_contacts?clientId='.concat(Cookies.get('id')))
      .then((response) => {
        //console.log('voici...................', response.data['hydra:member']);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      });
  };
  createContactAction = async (contact: Array<string>, clientId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataRes: { status: boolean; data: any[] } = {
      status: true,
      data: [],
    };

    for (let i = 0; i < contact.length; i++) {
      const data = {
        phone: contact[i],
        clientId: clientId,
      };
      await api
        .post('/api/contacts', data)
        .then((response) => {
          dataRes.status = true;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          dataRes.data.push(response.data['@id']);
        })
        .catch(() => {
          dataRes.status = false;
        });
    }

    return dataRes;
  };

  createSmsAction = async (datas: object) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: any[] } = {
      status: true,
      data: [],
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call

    await api
      .post('/api/sms', datas)
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data: [response.data['@id']],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    //await createSmsByRouteAction(1, senderId.value);

    return dataRes;
  };
  getGroupesAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get(
        '/api/groupe_contacts?clientId='.concat(this.clientId + '&status=true')
      )
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
  };

  getTypeNotificationAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/type_notifications')
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
  };

  /**
   * @argument data doit contenir l'id du client,l'id du type de notification qu'il a choisit, le message
   */
  makeNotificationAction = async (data: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; id: string } = { status: true, id: '' };

    await api
      .post('/api/notifications', data)
      .then((response) => {
        dataRes = {
          status: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: response.data['@id'],
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          id: '',
        };
      });
    return dataRes;
  };

  getSenderIdsAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/sender_ids?clientId='.concat(this.clientId))
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
  };

  getActionContactForGroup = async (groupeId: string) => {
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/list_groupe_contacts?groupeContact='.concat(groupeId))
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
  };

  newProjetAction = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .post('/projet/new', data)
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  regenerateProjetApiKeyAction = async (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .post('/projet/refresh', data)
      .then((response) => {
        dataRes = {
          status: true,
          data: response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };
  getListProjetAction = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };
    const data: {
      nomProjet: string;
      id: string;

      soldeSms: string;
      date: string;
    }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let projet: {
      nomProjet: string;
      id: string;

      soldeSms: string;
      date: string;
    } = {
      id: '',
      nomProjet: '',
      soldeSms: '',
      date: formatDate(new Date()),
    };
    await api
      .get('/api/list_projet_clients?clientId='.concat(this.clientId))
      .then((response) => {
        for (let i = 0; i < response.data['hydra:member'].length; i++) {
          projet = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: response.data['hydra:member'][i]['projet']['id'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            nomProjet: response.data['hydra:member'][i]['projet']['nomProjet'],

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            soldeSms: response.data['hydra:member'][i]['projet']['soldeSms'],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            date: formatDate(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              new Date(response.data['hydra:member'][i]['date']) // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            ),
          };

          data.push(projet);
        }

        dataRes = {
          status: true,
          data: <[]>data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };

  getProjetAction = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
    let dataRes: { status: boolean; data: [] } = { status: true, data: [] };

    await api
      .get('/api/projets/'.concat(id))
      .then((response) => {
        dataRes = {
          status: true,
          data: <[]>response.data,
        };
      })
      .catch(() => {
        dataRes = {
          status: false,
          data: [],
        };
      });
    return dataRes;
  };
}
