<template>
  <div>
    <data-table
        :loader="loadData"
        :headers="headers"
        :title="getTitle(this.status) +  ' Appointments'"
        :allow-add="false"
        @done="$router.back()"
        :edit-handler="edit"
    >
      <template #extra-actions="{ item }">
        <v-icon v-if="status === 1" color="green" small @click="changeStatus(3, item._id)">mdi-check</v-icon>
        <v-icon v-if="status === 0" color="green" small @click="changeStatus(1, item._id)">mdi-check-circle</v-icon>
        <v-icon v-if="status === 0" color="red" small @click="changeStatus(4, item._id)">mdi-close-circle</v-icon>
        <v-icon v-if="status === 0" color="warning" small @click="editAppointment(item)">mdi-clock</v-icon>
      </template>
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
    <v-dialog v-model="editDialog" width="30%" persistent>
      <v-card>
        <v-card-title>Update Appointment Time</v-card-title>
        <div class="px-5 py-2">
          <v-form ref="editForm" v-if="editItem">
            <v-select
                dense
                v-model="editItem.time_slot"
                :items="editTimeSlots"
                item-text="from to"
                label="Time Slot"
                outlined
                :value-comparator="(a,b) => a && b && a._id === b._id"
            >
              <template v-slot:selection="{ item }">
                <span>{{ getTimeSlotValue(item.from) + ' - ' + getTimeSlotValue(item.to) }} </span>
              </template>
              <template class="white" slot="item" slot-scope="data">
                <span>{{ getTimeSlotValue(data.item.from) + ' - ' + getTimeSlotValue(data.item.to) }} </span>
              </template>
            </v-select>
            <v-text-field outlined dense v-model="editItem.date" type="date"></v-text-field>
            <div class="d-flex justify-end">
              <v-btn @click="cancelEditAppointment" class="mr-2">Cancel</v-btn>
              <v-btn @click="submitEditAppointment" color="primary" elevation="0">Submit</v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DataTable from '../../components/DataTable';
import {AppointmentsService} from '@/services/appointments-service';
import LoadingDialog from "../../components/LoadingDialog";
import {
  getUser,
  getAppointmentType,
  getServiceType,
  formatDate,
  compareDates,
  getTimeSlotValue
} from '@/utils/local';
import {TimeSlotService} from "@/services/time_slots-service";


export default {
  name: "AppointmentsTable",
  components: {LoadingDialog, DataTable},
  props: {
    status: {
      type: Number,
      default: 0,
    },
    headers: {
      default: () => [
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
    }
  },
  data: () => ({
    loading: false,
    loadingDialog: false,
    service: new AppointmentsService(),
    timeSlotService: new TimeSlotService(),
    tab: null,
    editDialog: false,
    editItem: null,
    editTimeSlots: [],
  }),
  methods: {
    getUser,
    getAppointmentType,
    getServiceType,
    formatDate,
    compareDates,
    getTimeSlotValue,
    async getTimeSlots() {
      this.editTimeSlots = await this.timeSlotService.fetchAll()
    },
    edit(item) {
      this.$router.push(`/appointment?id=${item._id}`);
    },
    loadData() {
      return this.service.fetchAll(this.status);
    },
    getTitle(status) {
      switch (status) {
        case 0:
          return 'Pending'
        case 1:
          return 'Approved'
        case 2:
          return 'Cancelled'
        case 3:
          return 'Completed'
        case 4:
          return 'Rejected'
        default:
          return 'Invalid'
      }
    },
    changeStatus(status, id) {
      let data
      let send = false
      if (status === 4) {
        const reason = prompt('Reason for rejection?', 'Time slot not available')
        console.log(reason)
        if (reason) {
          send = true
          data = {
            status: status,
            reason: reason
          }
        }
      } else {
        if (confirm('Are you sure? This appointment will be ' + this.getTitle(status).toLowerCase())) {
          send = true
          data = {
            status: status
          }
        }
      }
      if (send) {
        this.service.updateStatus(data, id);
        document.querySelectorAll(".refresh").forEach(function (item) {
          item.click()
        })
      }
    },
    async editAppointment(item) {
      await this.getTimeSlots()
      this.editItem = {...item}
      this.editItem.date = formatDate(this.editItem.date, "YYYY-MM-DD")
      console.log(this.editItem)
      this.editDialog = true
    },
    cancelEditAppointment() {
      this.editDialog = false
      this.editItem = null
    },
    submitEditAppointment() {
      if (this.$refs.editForm.validate()) {
        this.service.update(this.editItem);
        this.editDialog = false
        document.querySelectorAll(".refresh").forEach(function (item) {
          item.click()
        })
      }
    }
  }

}
</script>
<style lang="sass" scoped>
.chip
  font-weight: 500
  padding: 5px 10px
  border-radius: 50px
  background: lightgray
</style>
