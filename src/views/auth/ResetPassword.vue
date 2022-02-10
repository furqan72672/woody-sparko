<template>
  <div id="background">
    <v-card class="reset-password" elevation="10">
      <img src="../../assets/logo.webp" alt="Logo" class="reset-password__logo"/>

      <h1 class="reset-password__title">{{ executed ? 'Password Updated' : 'Create New Password' }}</h1>
      <p class="reset-password__message">
        {{
          executed ? 'Your password is updated successfully. Goto our mobile app to login with your new password.' : '        Your new password must be different from previous used passwords.'
        }}
      </p>
      <v-form ref="form" v-if="!executed">
        <v-text-field
            v-model="password"
            :rules="[required('Do not leave this field empty')]"
            @keypress.enter="signIn"
            label="Your Password"
            type="password"
            outlined
        />
        <v-text-field
            v-model="confirmPassword"
            :rules="[required('Do not leave this field empty'), password === confirmPassword || 'Password Could Not Be Confirmed']"
            @keypress.enter="resetPassword"
            label="Confirm Password"
            type="password"
            outlined
        />

        <v-btn
            @click="resetPassword"
            color="#23277c"
            dark
            elevation="0"
            width="100%"
            height="45px"
        >
          <v-icon small style="margin-right: 5px">mdi-lock</v-icon>
          Reset Password
        </v-btn>
      </v-form>
      <div v-else></div>
    </v-card>
    <loading-dialog v-model="loading" message="Changing Password, Please wait..."/>
    <error-dialog v-model="error" :error="errorVal"/>
  </div>
</template>

<script>
import {required} from '@/utils/validators';
import LoadingDialog from '../../components/LoadingDialog';
import ErrorDialog from '../../components/ErrorDialog';

export default {
  name: 'ResetPassword',
  components: {ErrorDialog, LoadingDialog},

  data: () => ({
    error: false,
    errorVal: {},
    loading: false,
    password: '',
    confirmPassword: '',
    executed: false,
  }),

  methods: {
    required,
    async resetPassword() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          await this.$axios.patch('/person/reset-password', {
            hash: this.$route.params.hash,
            password: this.password
          })
          this.executed = true
        } catch (e) {
          this.error = true
          this.errorVal = {
            title: e.data.statusCode === 406 ? 'Password Reset Link Expired' : 'Unexpected Error',
            description: e.data.statusCode === 406 ? 'The password reset link you have followed is expired. Kindly request a new password reset link' : 'Unexpected Error have occurred. Try again later'
          }
          this.loading = false
        }

        this.loading = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.reset-password
  width: 448px
  padding: 20px 40px 40px 40px
  background: white
  text-align: center
  border-radius: 8px

  &__header
    display: grid
    grid-column-gap: 20px
    grid-template-columns: calc(30% - 20px) 70%

  &__logo
    width: 30%
    margin-bottom: 20px

  &__title
    color: black
    font-size: 24px
    margin-bottom: 10px
    font-weight: normal
    font-family: google-sans, sans-serif

  &__message
    font-size: 13px
    margin-bottom: 40px


#background
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: #23277c

//.logo-box {
//  padding: 10px;
//  margin: -120px auto 30px auto;
//}
//
//.heading {
//  font-size: 24px;
//  font-weight: normal;
//  margin-bottom: 20px;
//  font-family: google-sans, sans-serif;
//}
</style>

<style>
html {
  overflow-y: auto;
}
</style>
