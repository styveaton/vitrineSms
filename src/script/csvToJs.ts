
import { boot } from 'quasar/wrappers';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
const csvTojson =   () => {
const file = readFileSync('sample.csv', 'utf8');
parse(file, {complete: (result) => console.dir('voici result parsing',result.data)});

};

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(csvTojson);
});

export { csvTojson };
