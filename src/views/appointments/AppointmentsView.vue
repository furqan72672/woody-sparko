<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab>Pending</v-tab>
      <v-tab>Approved</v-tab>
      <v-tab>Rejected</v-tab>
      <v-tab>Cancelled</v-tab>
      <v-tab>Completed</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <AppointmentsTable :status="0"/>
      </v-tab-item>
      <v-tab-item>
        <AppointmentsTable :status="1"/>
      </v-tab-item>
      <v-tab-item>
        <AppointmentsTable :headers="headers" :status="4"/>
      </v-tab-item>
      <v-tab-item>
        <AppointmentsTable :status="2"/>
      </v-tab-item>
      <v-tab-item>
        <AppointmentsTable :status="3"/>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AppointmentsTable from "@/views/appointments/AppointmentsTable";


export default {
  components: {AppointmentsTable},

  data: () => ({
    tab: null,
    headers: [
      {
        text: 'Client',
        value: 'person',
        sortable: false
      },
      {
        text: 'Type',
        value: 'type',
        sortable: false
      },
      {
        text: 'Service',
        value: 'service'
      },
      {
        text: 'Date',
        value: 'date'
      },
      {
        text: 'Reason',
        value: 'reason'
      }
    ]
  }),
};
</script>

<style lang="sass" scoped>
.chip
  font-weight: 500
  padding: 5px 10px
  border-radius: 50px
  background: lightgray
</style>
