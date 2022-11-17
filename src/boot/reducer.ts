const lastId = 0;
// export default function counter(state =[],action) {
//       switch (action.type) {
//           case 'bugAdded':
//               return [...state, {
//                   id: ++lastId,
//                   description: action.payload.description,
//                   resolved:false

// import  RequestApi  from "./RequestApi";
// import {   ref } from 'vue';
// import store from "./store";
interface Data {
  id: number;
}
interface State {
  data: Data[];
  loading: boolean;
  error: null;
}

const initialState = {
  data: [],
  loading: false,
  error: null,
};

export const getData = (
  state: State = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case 'data':
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { state: state, data: action.payload };
    default:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { state: state, data: 'aaaaasadsvs' };
  }
};

