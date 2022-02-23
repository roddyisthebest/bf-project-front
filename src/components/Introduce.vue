<template>
  <v-row justify="center">
    <v-col cols="11">
      <v-card class="mx-auto" color="primary" dark>
        <v-card-title>
          <v-icon large left> mdi-hand-back-left-outline </v-icon>
          <span class="text-h6 font-weight-light">Introduce myself</span>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-bold">
          " I designed this site with node.js and vue.js+ts. If you are
          interested please contact me through the git site below "
        </v-card-text>

        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-avatar color="white darken-3">
              <v-img
                class="elevation-6"
                alt=""
                src="https://avataaars.io/?avatarStyle=Transparent&topType=WinterHat1&accessoriesType=Kurt&hatColor=PastelBlue&facialHairType=Blank&clotheType=Hoodie&clotheColor=Black&eyeType=Default&eyebrowType=Default&mouthType=Concerned&skinColor=Light"
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Roddy</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end">
              <a href="https://github.com/roddyisthebest" target="_blank">
                <v-icon class="mr-1"> mdi-github </v-icon>
                <span class="mr-2" style="color: white">roddyisthebest</span>
              </a>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>

<style scoped>
a {
  text-decoration: none;
  color: white;
}
</style>
