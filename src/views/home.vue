<template>
  <div>
    <div class="dashboard-cards">
      <v-card class="pa-5 text-center blue white--text">
        <h1>{{ dashboard.pending || 0 }}</h1>
        <p>Pending Appointments</p>
      </v-card>
      <v-card class="pa-5 text-center purple white--text">
        <h1>{{ dashboard.accepted || 0 }}</h1>
        <p>Approved Appointments</p>
      </v-card>
      <v-card class="pa-5 text-center green white--text">
        <h1>{{ dashboard.cancelled || 0 }}</h1>
        <p>Cancelled Appointments</p>
      </v-card>
      <v-card class="pa-5 text-center pink white--text">
        <h1>{{ dashboard.completed || 0 }}</h1>
        <p>Completed Appointments</p>
      </v-card>
    </div>
    <div class="pt-3">
      <data-table
          :loader="loadData"
          :headers="headers"
          title="Today's Appointments"
          :allow-add="false"
          @done="$router.back()"
          :edit-handler="edit"
      >
        <template #person="{ item }">
          <span>{{ item.person.first_name + ' ' + item.person.last_name }}</span>
        </template>
        <template #type="{ item }">
          <span>{{ getAppointmentType(item.type) }}</span>
        </template>
        <template #service="{ item }">
          <span>{{ getServiceType(item.service) }}</span>
        </template>
        <template #date="{ item }">
        <span :class="compareDates(item.date, new Date()) ? 'chip light-green' : 'chip red'">{{
            formatDate(item.date)
          }}</span>
        </template>
      </data-table>
      <loading-dialog v-model="loadingDialog" message="Loading..."/>
    </div>
  </div>
</template>

<script>

import DataTable from '../components/DataTable';
import {AppointmentsService} from '@/services/appointments-service';
import LoadingDialog from "../components/LoadingDialog";
import {getUser, getAppointmentType, getServiceType, formatDate, compareDates} from '@/utils/local';
import axios from "axios";

export default {
  name: 'Home',
  components: {LoadingDialog, DataTable},
  data: () => ({
    loadingDialog: false,
    service: new AppointmentsService(),
    dashboard: {},
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
      }
    ]
  }),
  mounted() {
    this.getDashboardData()
  },
  methods: {
    async getDashboardData() {
      this.dashboard = (await axios.get('/appointment/dashboard/')).data
    },
    getUser,
    getAppointmentType,
    getServiceType,
    formatDate,
    compareDates,
    edit(item) {
      this.$router.push(`/appointment?id=${item._id}`);
    },
    loadData() {
      return this.dashboard.today;
    },
  },

};
</script>

<style scoped>
.dashboard-cards {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
}

@media screen and (min-width: 580px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (min-width: 1000px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

</style>
