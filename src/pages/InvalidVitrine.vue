<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        Oops. Le nom de vitrine invalide veuillez contacter votre fournisseur...
      </div>

     
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeta } from 'quasar';

const metaData = {
  /*script: {
      jquery: {
        src: 'vendor/jquery/jquery.min.js',
      },
      bootstrap: {
        src: 'vendor/bootstrap/js/bootstrap.min.js',
      },
      metisMenu: {
        src: 'vendor/metisMenu/metisMenu.min.js',
      },
      raphael: {
        src: 'vendor/raphael/raphael.min.js',
      },
      morris1: {
        src: 'vendor/morrisjs/morris.min.js',
      },
      morris2: {
        src: 'data/morris-data.js',
      },
      admin: {
        src: 'dist/js/sb-admin-2.js',
      },
      script_upate: {
        src: 'script_upate.js',
      },
    },*/

  // <noscript> tags
  noscript: {
    default: 'This is content for browsers with no JS (or disabled JS)',
  },
};

export default defineComponent({
  name: 'InvalidVitrine ',

  setup() {
    useMeta(metaData);
  },
});
</script>

<style></style>
