<template>
  <SimpleForm :disabled="true" :onSubmit="submit" @done="$router.back()">
    <p class="span-2 form__title">{{ isEdit ? 'Update Appointment' : 'Create Appointment' }}</p>

    <v-text-field
        :value="getAppointmentType(appointment.type)"
        dense
        label="Appointment Type"
        outlined
        readonly
        class="span-2"
    />
    <v-text-field
        :value="getServiceType(appointment.service)"
        dense
        label="Service Type"
        outlined
        readonly
        class="span-2"
    />

    <v-textarea
        v-model="appointment.description"
        label="Description"
        dense
        readonly
        outlined
        persistent-hint
        class="span-2"
    />

    <v-text-field
        :value="formatDate(appointment.date)"
        dense
        label="Preferred Date"
        outlined
        readonly
        class="span-2"
    />
    <v-text-field
        :value="getTimeSlot(appointment.time_slot)"
        dense
        label="Preferred Time Slot"
        outlined
        readonly
        class="span-2"
    />
    <div v-if="appointment.type === 0" style="display: grid;grid-template-columns: 1fr 1fr;grid-column-gap: 20px;"
         class="span-2">
      <p class="span-2">Address</p>
      <v-text-field
          :value="appointment.address"
          dense
          label="Address"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.state"
          dense
          label="State"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.city"
          dense
          label="City"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.zip"
          dense
          label="Zip Code"
          outlined
          readonly
      />
    </div>

    <div v-if="appointment.vehicle" style="display: grid;grid-template-columns: 1fr 1fr;grid-column-gap: 20px;"
         class="span-2">
      <p class="span-2">Vehicle Detail</p>
      <v-text-field
          :value="appointment.vehicle.year"
          dense
          label="Year"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.vehicle.make"
          dense
          label="Make"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.vehicle.model"
          dense
          label="Model"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.vehicle.vin"
          dense
          label="VIN"
          outlined
          readonly
      />
    </div>
    <div v-if="appointment.person" style="display: grid;grid-template-columns: 1fr 1fr;grid-column-gap: 20px;"
         class="span-2">
      <p class="span-2">Client Detail</p>
      <v-text-field
          :value="appointment.person.first_name"
          dense
          label="First Name"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.person.last_name"
          dense
          label="Last Name"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.person.username"
          dense
          label="Email"
          outlined
          readonly
      />
      <v-text-field
          :value="appointment.person.phone"
          dense
          label="Phone #"
          outlined
          readonly
      />
    </div>
    <template #actions>
      <v-btn v-if="appointment.status === 0" color="red" class="mr-3" @click="changeStatus(4)" elevation="0">Reject</v-btn>
      <v-btn v-if="appointment.status === 0" color="green" class="mr-3" @click="changeStatus(1)" elevation="0">Approve</v-btn>
    </template>
    <loading-dialog v-model="loading" message="Loading..."/>
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import LoadingDialog from '../../components/LoadingDialog';
import {required} from '@/utils/validators';
import {AppointmentsService} from "@/services/appointments-service";
import {getAppointmentType, getServiceType, formatTime, formatDate, getTimeSlot} from '@/utils/local';

export default {
  name: 'Form',
  components: {LoadingDialog, SimpleForm},

  data: () => ({
    isEdit: false,
    loading: false,
    service: new AppointmentsService(),
    appointment: {},
    errors: [],

    appointmentTypes: [
      {
        label: 'AC/Heating Issue',
        value: 1
      },
      {
        label: 'Transmission Concern',
        value: 2
      },
      {
        label: 'Battery Concern',
        value: 3
      },
      {
        label: 'Brake Systems',
        value: 4
      },
      {
        label: 'Engine or Electrical',
        value: 5
      },
      {
        label: 'Radio/Nav Concern',
        value: 6
      },
      {
        label: 'Steering/Suspension Concern',
        value: 7
      },
      {
        label: 'General Maintenance',
        value: 8
      },
      {
        label: 'Other',
        value: 9
      },
    ],
  }),

  mounted() {
    this.loadAppointment();
  },

  methods: {
    required,
    getAppointmentType,
    getServiceType,
    formatTime,
    formatDate,
    getTimeSlot,
    async loadAppointment() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.appointment = await this.service.fetchOne(this.$route.query.id);
      this.loading = false;
    },
    preCheck(context) {
      if (!context.validate()) return false;

      return true;
    },
    async submit(context) {
      if (this.preCheck(context)) {
        if (this.isEdit) {
          context.changeLoadingMessage('Updating Appointment');
          try {
            await this.service.update(this.appointment);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while updating Appointment',
              description: e.toString()
            });
            return false
          }
        } else {
          try {
            context.changeLoadingMessage('Creating A New Appointment');
            await this.service.create(this.appointment);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while creating Appointment',
              description: e.toString()
            });
            return false
          }
        }
      }
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
    changeStatus(status) {
      if (confirm('Are you sure? This appointment will be ' + this.getTitle(status).toLowerCase())) {
        this.service.updateStatus(status, this.appointment._id).then(() => {
          this.loadAppointment()
        });
      }
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
