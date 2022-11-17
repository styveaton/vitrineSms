import { RouteRecordRaw } from 'vue-router';
import { Cookies } from 'quasar';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',

    component: () => import('layouts/Home.vue'),
    children: [
      {
        path: '',
        name: 'Vitrine',
        component: () => import('pages/Vitrine.vue'),
      },
      {
        path: '/tarifs',
        name: 'Price',
        component: () => import('pages/Price.vue'),
      },
      {
        path: '/documentation',
        name: 'Doc',
        component: () => import('pages/Doc.vue'),
      },
      {
        path: '/Connexion',
        name: 'Login',
        component: () => import('pages/Login.vue'),
      },
    ],
  },
  {
    path: '/Inscription',
    name: 'Inscription',
    component: () => import('pages/SignUp.vue'),
  },

  {
    path: '/administration',
    name: 'Admin',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    redirect: (to) => {
      return 'administration';
    },
    component: () => import('layouts/admin/Admin.vue'),
    children: [
      {
        path: '',
        name: 'Manager',
        component: () => import('pages/admin/Manager.vue'),
      },
      {
        path: 'historiques-transactions',
        name: 'Transactions',
        component: () => import('pages/admin/Transactions.vue'),
      },
      {
        path: 'list-contact',
        name: 'ListContact',
        component: () => import('pages/admin/ListContact.vue'),
      },
      {
        path: 'utiisateurs-manage',
        name: 'UtiisateursManage',
        component: () => import('pages/admin/UtiisateursManage.vue'),
      },
      {
        path: 'etats-des-sms-programme',
        name: 'MessageCron',
        component: () => import('pages/admin/MessageCron.vue'),
      },
      {
        path: 'nouveau-contact',
        name: 'NewContact',
        component: () => import('pages/admin/NewContact.vue'),
      },
      {
        path: 'importer-vos-contact',
        name: 'ImportContact',
        component: () => import('pages/admin/ImportContact.vue'),
      },
      {
        path: 'message-individuel',
        name: 'MessageIndividuel',
        component: () => import('pages/admin/MessageIndividuel.vue'),
      },
      {
        path: 'message-groupe',
        name: 'MessageGroupe',
        component: () => import('pages/admin/MessageGroupe.vue'),
      },
      {
        path: 'message-personaliser',
        name: 'MessageCustom',
        component: () => import('pages/admin/MessageCustom.vue'),
      },
      {
        path: 'groupe-contact',
        name: 'GroupeContact',
        component: () => import('pages/admin/GroupeContact.vue'),
      },
      {
        path: 'new-senderId',
        name: 'NewSenderId',
        component: () => import('pages/admin/NewSenderId.vue'),
      },
      {
        path: 'config-Profile',
        name: 'ConfigProfile',
        component: () => import('src/pages/admin/ConfigProfile.vue'),
      },
      {
        path: 'PackSms',
        name: 'PackSms',
        component: () => import('pages/admin/PackSms.vue'),
      },

      {
        path: 'Config',
        name: 'Config',
        component: () => import('pages/admin/Config.vue'),
      },
      {
        path: 'Projet',
        name: 'Projet',
        component: () => import('pages/admin/Projet.vue'),
      },
      {
        path: 'Calendrier',
        name: 'Calendrier',
        component: () => import('pages/admin/Calendrier.vue'),
      },
      {
        path: 'Notification',
        name: 'Notification',
        component: () => import('pages/admin/Notification.vue'),
      },

      {
        path: 'Vitrine',
        name: 'VitrineAdmin',
        component: () => import('src/pages/admin/Vitrine.vue'),
      },

      {
        path: 'new-profil',
        name: 'NewProfil',
        component: () => import('pages/admin/NewProfil.vue'),
      },
    ],
  },

  {
    path: '/rememberpage',
    name: 'RememberPage',
    component: () => import('pages/admin/rememberPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];
// const routes: RouteRecordRaw[] = [
//   {
//     path: '/:site',
//     name: 'start',

//     component: () => import('layouts/MainLayout.vue'),
//     children: [
//       {
//         path: '/:site/connexion',
//         name: 'Home',
//         component: () => import('../pages/Login.vue'),
//       },  {
//         path: '',
//         name: 'Vitrine',
//         component: () => import('pages/Vitrine.vue'),
//       },
//       {
//         path: '/:site/tarifs',
//         name: 'Price',
//         component: () => import('../pages/Price.vue'),
//       },
//       {
//         path: '/:site/documentation',
//         name: 'Doc',
//         component: () => import('../pages/Doc.vue'),
//       },
//     ],
//   },

//   {
//     path: '/:site/inscription',
//     name: 'inscription',
//     component: () => import('pages/SignUp.vue'),
//   },
//   {
//     path: '/:site/administration',
//     name: 'Admin',
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     redirect: (to) => {
//       return 'administration';
//     },
//     beforeEnter: (to, from, next) => {
//       const site = to.redirectedFrom
//         ? to.redirectedFrom.params.site.toString()
//         : to.params.site.toString();
//       console.log(site);
//       if (
//         Cookies.get('token') != undefined &&
//         Cookies.get('token') != 'undefined' &&
//         Cookies.get('token') != null
//       ) {
//         console.log(
//           Cookies.get('token') != undefined &&
//             Cookies.get('token') != 'undefined' &&
//             Cookies.get('token') != null
//         );
//         console.log('iiiiixzzxioooiioi', Cookies.get('token'));
//         void refreshAuthenticated();
//         next();
//         console.log('00000');
//       } else {
//         console.log('llllllllll');
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//         return next();
//       }
//     },
//     component: () => import('layouts/admin/Admin.vue'),
//     children: [
//       {
//         path: '',
//         name: 'Manager',
//         component: () => import('pages/admin/Manager.vue'),
//       },
//       {
//         path: 'historiques-transactions',
//         name: 'Transactions',
//         component: () => import('pages/admin/Transactions.vue'),
//       },
//       {
//         path: 'list-contact',
//         name: 'ListContact',
//         component: () => import('pages/admin/ListContact.vue'),
//       },
//       {
//         path: 'utiisateurs-manage',
//         name: 'UtiisateursManage',
//         component: () => import('pages/admin/UtiisateursManage.vue'),
//       },
//       {
//         path: 'etats-des-sms-programme',
//         name: 'MessageCron',
//         component: () => import('pages/admin/MessageCron.vue'),
//       },
//       {
//         path: 'nouveau-contact',
//         name: 'NewContact',
//         component: () => import('pages/admin/NewContact.vue'),
//       },
//       {
//         path: 'importer-vos-contact',
//         name: 'ImportContact',
//         component: () => import('pages/admin/ImportContact.vue'),
//       },
//       {
//         path: 'message-individuel',
//         name: 'MessageIndividuel',
//         component: () => import('pages/admin/MessageIndividuel.vue'),
//       },
//       {
//         path: 'message-groupe',
//         name: 'MessageGroupe',
//         component: () => import('pages/admin/MessageGroupe.vue'),
//       },
//       {
//         path: 'message-personaliser',
//         name: 'MessageCustom',
//         component: () => import('pages/admin/MessageCustom.vue'),
//       },
//       {
//         path: 'groupe-contact',
//         name: 'GroupeContact',
//         component: () => import('pages/admin/GroupeContact.vue'),
//       },
//       {
//         path: 'new-senderId',
//         name: 'NewSenderId',
//         component: () => import('pages/admin/NewSenderId.vue'),
//       },
//       {
//         path: 'config-Profile',
//         name: 'ConfigProfile',
//         component: () => import('src/pages/admin/ConfigProfile.vue'),
//       },
//       {
//         path: 'PackSms',
//         name: 'PackSms',
//         component: () => import('pages/admin/PackSms.vue'),
//       },

//       {
//         path: 'Config',
//         name: 'Config',
//         component: () => import('pages/admin/Config.vue'),
//       },
//       {
//         path: 'Projet',
//         name: 'Projet',
//         component: () => import('pages/admin/Projet.vue'),
//       },
//       {
//         path: 'Calendrier',
//         name: 'Calendrier',
//         component: () => import('pages/admin/Calendrier.vue'),
//       },
//       {
//         path: 'Notification',
//         name: 'Notification',
//         component: () => import('pages/admin/Notification.vue'),
//       },

//       {
//         path: 'Vitrine',
//         name: 'VitrineAdmin',
//         component: () => import('src/pages/admin/Vitrine.vue'),
//       },

//       {
//         path: 'new-profil',
//         name: 'NewProfil',
//         component: () => import('pages/admin/NewProfil.vue'),
//       },
//     ],
//   },

//   {
//     path: '/rememberpage',
//     name: 'RememberPage',
//     component: () => import('pages/admin/rememberPage.vue'),
//   },
//   {
//     path: '/invalidVitrine',
//     name: 'invalidVitrine',
//     component: () => import('pages/InvalidVitrine.vue'),
//   },
//   // Always leave this as last one,
//   // but you can also remove it
//   {
//     path: '/:catchAll(.*)*',
//     component: () => import('pages/Error404.vue'),
//   },
// ];

export default routes;

/**
 * import { RouteRecordRaw } from 'vue-router';
import { Cookies } from 'quasar';
import { refreshAuthenticated } from 'boot/refreshAuthenticated';

const routes: RouteRecordRaw[] = [
  {
    path: '/:site',
    name: 'Home',

    component: () => import('layouts/Home.vue'),
    children: [
      {
        path: '',
        name: 'Vitrine',
        component: () => import('pages/Vitrine.vue'),
      },
      {
        path: '/tarifs',
        name: 'Price',
        component: () => import('pages/Price.vue'),
      },
      {
        path: '/documentation',
        name: 'Doc',
        component: () => import('pages/Doc.vue'),
      },
    ],
  },
  {
    path: '/:site/administration',
    name: 'Admin',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    beforeEnter: (to, from, next) => {
      const site = to.redirectedFrom
        ? to.redirectedFrom.params.site.toString()
        : to.params.site.toString();
      console.log(site);
      if (
        Cookies.get('token') != undefined &&
        Cookies.get('token') != 'undefined' &&
        Cookies.get('token') != null
      ) {
        console.log(
          Cookies.get('token') != undefined &&
            Cookies.get('token') != 'undefined' &&
            Cookies.get('token') != null
        );
        console.log('iiiiixzzxioooiioi', Cookies.get('token'));
        void refreshAuthenticated();
       return next({ name: 'Manager' });
        console.log('00000');
      } else {
        console.log('llllllllll');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return next();
      }
    },
    component: () => import('layouts/admin/Admin.vue'),
    children: [
      {
        path: '',
        name: 'Manager',
        component: () => import('pages/admin/Manager.vue'),
      },
      {
        path: 'historiques-transactions',
        name: 'Transactions',
        component: () => import('pages/admin/Transactions.vue'),
      },
      {
        path: 'list-contact',
        name: 'ListContact',
        component: () => import('pages/admin/ListContact.vue'),
      },
      {
        path: 'utiisateurs-manage',
        name: 'UtiisateursManage',
        component: () => import('pages/admin/UtiisateursManage.vue'),
      },
      {
        path: 'etats-des-sms-programme',
        name: 'MessageCron',
        component: () => import('pages/admin/MessageCron.vue'),
      },
      {
        path: 'nouveau-contact',
        name: 'NewContact',
        component: () => import('pages/admin/NewContact.vue'),
      },
      {
        path: 'importer-vos-contact',
        name: 'ImportContact',
        component: () => import('pages/admin/ImportContact.vue'),
      },
      {
        path: 'message-individuel',
        name: 'MessageIndividuel',
        component: () => import('pages/admin/MessageIndividuel.vue'),
      },
      {
        path: 'message-groupe',
        name: 'MessageGroupe',
        component: () => import('pages/admin/MessageGroupe.vue'),
      },
      {
        path: 'message-personaliser',
        name: 'MessageCustom',
        component: () => import('pages/admin/MessageCustom.vue'),
      },
      {
        path: 'groupe-contact',
        name: 'GroupeContact',
        component: () => import('pages/admin/GroupeContact.vue'),
      },
      {
        path: 'new-senderId',
        name: 'NewSenderId',
        component: () => import('pages/admin/NewSenderId.vue'),
      },
      {
        path: 'config-Profile',
        name: 'ConfigProfile',
        component: () => import('src/pages/admin/ConfigProfile.vue'),
      },
      {
        path: 'PackSms',
        name: 'PackSms',
        component: () => import('pages/admin/PackSms.vue'),
      },

      {
        path: 'Config',
        name: 'Config',
        component: () => import('pages/admin/Config.vue'),
      },
      {
        path: 'Projet',
        name: 'Projet',
        component: () => import('pages/admin/Projet.vue'),
      },
      {
        path: 'Calendrier',
        name: 'Calendrier',
        component: () => import('pages/admin/Calendrier.vue'),
      },
      {
        path: 'Notification',
        name: 'Notification',
        component: () => import('pages/admin/Notification.vue'),
      },

      {
        path: 'Vitrine',
        name: 'VitrineAdmin',
        component: () => import('src/pages/admin/Vitrine.vue'),
      },

      {
        path: 'new-profil',
        name: 'NewProfil',
        component: () => import('pages/admin/NewProfil.vue'),
      },
    ],
  },

  {
    path: '/rememberpage',
    name: 'RememberPage',
    component: () => import('pages/admin/rememberPage.vue'),
  },
  {
    path: '/invalidVitrine',
    name: 'invalidVitrine',
    component: () => import('pages/InvalidVitrine.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

 */
