import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';
import {api} from 'boot/axios';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findSenderIdsAction({commit}, payload: boolean) {
    console.log('Le store', payload)
  },


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findSenderIdAction({commit}, payload: {requestType: number, data: {senderId: string}}) {
    let dataRes: { status: boolean, data: [] }
    if (payload.requestType === 1) {
      await api.get('/api/sender_ids?senderId='.concat(payload.data.senderId))
        .then(response => {
          dataRes = {
            status: true,
            data: <[]>response.data
          }
        })
        .catch(() => {
          dataRes = {
            status: false,
            data: []
          }
        })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return dataRes
    }
  },

  async createSmsAction(context, payload: {requestType: number, data: object}) {
    let dataRes: { status: boolean, data: [] }
    if (payload.requestType === 1) {
      const data: object = payload.data
      await api.post('/api/sms', data)
        .then(response => {
          dataRes = {
            status: true,
            data: <[]>response.data
          }
        })
        .catch(() => {
          dataRes = {
            status: false,
            data: []
          }
        })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return dataRes
    }
  },
};

export default actions;
