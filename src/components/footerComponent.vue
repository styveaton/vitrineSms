<template>
  <footer class="site-footer">
    <div class="container">
      <div class="site-footer-inner">
        <div class="site-footer-top">
          <div class="site-footer-unit">
            <div class="site-footer-unit-inner">
              <div class="brand footer-brand mb-24">
                <a href="#">
                  <img src="images/logo.svg" alt="Logo" />
                </a>
              </div>
              <ul class="footer-social-links list-reset">
                <li>
                  <a href="#">
                    <span class="fa fa-facebook-official fa-2x"></span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span class="fa fa-twitter fa-2x"></span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span class="fa fa-google fa-2x"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="site-footer-unit">
            <div class="site-footer-unit-inner">
              <div class="footer-top-links">
                <div class="footer-title mb-16">Autres services</div>
                <ul class="list-reset">
                  <li>
                    <a href="#">Hebergement</a>
                  </li>
                  <li>
                    <a href="#">CEO</a>
                  </li>
                  <li>
                    <a href="#">Noms de domaines</a>
                  </li>
                  <li>
                    <a href="#">Emploi</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="site-footer-unit">
            <div class="site-footer-unit-inner">
              <div class="footer-top-links">
                <div class="footer-title mb-16">Fonctionnalités</div>
                <ul class="list-reset">
                  <li>
                    <a href="pages/sms-simple.php">SMS simple</a>
                  </li>
                  <li>
                    <a href="pages/sms-personnalise.php">SMS personalisé</a>
                  </li>
                  <li>
                    <a href="pages/groupes.php">Annuaire téléphonique</a>
                  </li>
                  <li>
                    <a href="pages/sms-programme-etat.php">SMS programmable</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="site-footer-unit">
            <div class="site-footer-unit-inner">
              <div class="footer-top-links">
                <div class="footer-title mb-16">Documentation</div>
                <ul class="list-reset">
                  <li>
                    <a href="#">Documentation</a>
                  </li>
                  <li>
                    <a href="#">Intégration de l'API</a>
                  </li>
                  <li>
                    <a href="#">Envoyer des SMS sans compte</a>
                  </li>
                  <li>
                    <a href="#">Devenir revendeur</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="site-footer-bottom">
          <ul class="footer-bottom-links list-reset">
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">FAQ's</a>
            </li>
            <li>
              <a href="#">Conditions d'utilisations</a>
            </li>
          </ul>
          <div class="footer-copyright">
            <sup>&copy; </sup> 2014 - VLAUE[date("Y")]<a
              href="https://gessiiagroup.com"
            >
              - GESSIIA Sarl</a
            >, all rights reserved
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'footerComponent',
});
</script>
