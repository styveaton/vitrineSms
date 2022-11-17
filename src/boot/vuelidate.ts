// import something here
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vuelidate from 'vuelidate'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/require-await
export default async ( { app }) => {
  // something to do

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  app.use(Vuelidate)
}
