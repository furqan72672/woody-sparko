<template>
  <SimpleForm :onSubmit="submit" @done="afterSubmit">
    <p class="span-2 form__title">{{ 'Update Profile' }}</p>

    <v-text-field
        v-model="user.first_name"
        dense
        :rules="[required('A Name must be provided')]"
        label="First Name"
        outlined
    />
    <v-text-field
        v-model="user.last_name"
        dense
        :rules="[required('A Name must be provided')]"
        label="Last Name"
        outlined
    />
    <v-text-field
        v-model="user.username"
        dense
        :rules="[required('A Email must be provided')]"
        label="Email"
        readonly
        class="span-2"
        outlined
    />
    <v-text-field
        v-model="user.phone"
        dense
        :rules="[required('A Email must be provided')]"
        label="Phone #"
        class="span-2"
        outlined
    />
    <v-text-field
        v-model="password"
        dense
        label="Password"
        type="password"
        outlined
    />
    <v-text-field
        v-model="confirmPassword"
        dense
        :rules="[password ? password === confirmPassword || 'Password Could Not Be Confirmed' : true]"
        label="Confirm Password"
        type="password"
        outlined
    />
    <v-text-field
        v-model="oldPassword"
        dense
        :rules="[password ? required() : true]"
        label="Old Password"
        type="password"
        class="span-2"
        outlined
    />

    <loading-dialog v-model="loading" message="Loading..."/>
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import LoadingDialog from '../../components/LoadingDialog';
import {required} from '@/utils/validators';
import {SettingsService} from "@/services/settings-service";

export default {
  name: 'Form',
  components: {LoadingDialog, SimpleForm},

  data: () => ({
    loading: false,
    service: new SettingsService(),
    user: {},
    password: null,
    confirmPassword: null,
    oldPassword: null,

    errors: [],
  }),

  mounted() {
    this.loadUserData();
  },

  methods: {
    required,
    async loadUserData() {
      this.loading = true;
      this.user = JSON.parse(localStorage.getItem('auth_user'))
      this.loading = false;
    },
    preCheck(context) {
      if (!context.validate()) return false;

      return true;
    },
    async submit(context) {
      if (this.preCheck(context)) {
        context.changeLoadingMessage('Updating Profile');
        try {
          await this.service.update(this.user);
          if (this.password) {
            const data = {
              person: this.user._id,
              newPassword: this.password,
              oldPassword: this.oldPassword,
              username: this.user.username
            }
            await this.service.changePassword(data);
          }

          return true
        } catch (e) {
          context.reportError({
            title: 'Error occurred while updating Profile',
            description: e.data.message.toString()
          });
          return false
        }
      }
    },
    async afterSubmit() {
      const user = (await this.$axios.get('/auth/profile')).data;
      localStorage.setItem('auth_user', JSON.stringify(user))
      this.user = JSON.parse(localStorage.getItem('auth_user'))
    }
  }
};
</script>

<style scoped>
p {
  font-weight: bold;
  text-align: left;
}
</style>
