<template>
  <div id="background">
    <v-card class="verify-account" elevation="10">
      <img src="../../assets/logo.webp" alt="Logo" class="verify-account__logo"/>

      <h1 class="verify-account__title"><span v-html="title"></span></h1>
      <p class="verify-account__message"><span v-html="message"></span></p>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'VerifyAccount',

  data: () => ({
    title: '',
    message:''
  }),
  mounted() {
    this.getVerification()
  },
  methods: {
    async getVerification() {
      const data = {
        id: this.$route.params.id,
        hash: this.$route.params.hash
      }
      try {
        const result = await this.$axios.patch('person/verify-account',data)
        this.title = 'Welcome Aboard! <br> Account Verified'
        this.message = `Thanks for signing up, ${result.data.first_name}. <br> Your account is now verified. <br> Finish setting up your account in the app.`
      } catch(e) {
        this.message = e.data.statusCode === 409 ? 'Your account is now verified. <br> Finish setting up your account in the app.' : e.data.message
        this.title = e.data.statusCode === 406 ? 'Could Not Verify Account' : e.data.message
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.verify-account
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
</style>

<style>
html {
  overflow-y: auto;
}
</style>
