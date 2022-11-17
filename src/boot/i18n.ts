import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import VueI18n from 'vue-i18n';
 import messages from 'src/i18n';

export default boot(({ app }) => {
  // Create I18n instance
  const  i18n = createI18n({
    locale: 'en-US',
    messages, legacy: false, globalInjection: true,
  });

  // Tell app to use the I18n instance
  app.use(i18n);
});


// import VueI18n from 'vue-i18n';
// import  messages  from 'src/i18n';

// export default async ({ app, Vue }) => {
//   Vue.use(VueI18n);
//   console.log(messages, numberFormats);
//   // Set i18n instance on app
//   app.i18n = new VueI18n({
//     locale: 'en-us',
//     fallbackLocale: 'en-us',
//     messages,
//     numberFormats,
//   });
// };
