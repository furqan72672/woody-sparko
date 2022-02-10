<template>
  <SimpleForm :onSubmit="submit" @done="$router.back()">
    <p class="span-2 form__title">{{ isEdit ? 'Update Time Slot' : 'Create Time Slot' }}</p>

    <p class="span-2">Timeslot From</p>
    <v-select
        v-model="timeslot.from"
        dense
        :items="hours"
        :rules="[requiredV2]"
        label="Hour"
        outlined
    />
    <v-select
        v-model="timeslot.fromType"
        dense
        :items="type"
        :rules="[required('AM / PM is required')]"
        label="AM / PM"
        outlined
    />
    <p class="span-2">Timeslot To</p>
    <v-select
        v-model="timeslot.to"
        dense
        :items="hours"
        :rules="[requiredV2]"
        label="Hour"
        outlined
    />
    <v-select
        v-model="timeslot.toType"
        dense
        :items="type"
        :rules="[required('AM / PM is required')]"
        label="AM / PM"
        outlined
    />


    <loading-dialog v-model="loading" message="Loading..."/>
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import LoadingDialog from '../../components/LoadingDialog';
import {required, requiredV2} from '@/utils/validators';
import {TimeSlotService} from "@/services/time_slots-service";
import {getTimeSlotValue} from "@/utils/local";


export default {
  name: 'Form',
  components: {LoadingDialog, SimpleForm},

  data: () => ({
    isEdit: false,
    loading: false,
    service: new TimeSlotService(),
    timeslot: {},
    errors: [],
    hours: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
    ],
    type: [
      'AM', 'PM'
    ],
    data: {}
  }),

  mounted() {
    this.loadTimeslot();
  },

  methods: {
    required,
    requiredV2,
    getTimeSlotValue,
    async loadTimeslot() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.timeslot = await this.service.fetchOne(this.$route.query.id);
      let data = this.getTimeSlotValue(this.timeslot.from).split(' ')
      this.timeslot.from = parseInt(data[0])
      this.timeslot.fromType = data[1]
      data = this.getTimeSlotValue(this.timeslot.to).split(' ')
      this.timeslot.to = parseInt(data[0])
      this.timeslot.toType = data[1]
      this.loading = false;
    },
    preCheck(context) {
      if (!context.validate()) return false;

      this.data = {
        from: this.timeslot.from,
        to: this.timeslot.to,
      }
      if (this.timeslot.fromType === 'AM' && this.timeslot.from === 12) {
        this.data.from = 0
      }
      if (this.timeslot.toType === 'AM' && this.timeslot.to === 12) {
        this.data.to = 0
      }
      if (this.timeslot.fromType === 'PM' && this.timeslot.from !== 12) {
        this.data.from = this.timeslot.from + 12
      }
      if (this.timeslot.toType === 'PM' && this.timeslot.to !== 12) {
        this.data.to = this.timeslot.to + 12
      }

      if (this.data.from >= this.data.to && this.data.to !== 0 ) {
        context.reportError({
          title: 'Invalid Time Slots',
          description:
              'From slot should be less then To slot'
        });

        return false;
      }

      return true;
    },
    async submit(context) {
      if (this.preCheck(context)) {
        if (this.isEdit) {
          context.changeLoadingMessage('Updating Timeslot');
          try {
            this.data._id = this.timeslot._id
            await this.service.update(this.data);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while updating Timeslot',
              description: e.data.message.toString()
            });
            return false
          }
        } else {
          try {
            context.changeLoadingMessage('Creating A New Timeslot');
            await this.service.create(this.data);
            return true
          } catch (e) {
            context.reportError({
              title: 'Error occurred while creating Timeslot',
              description: e.data.message.toString()
            });
            return false
          }
        }
      }
    },
  }
};
</script>

<style scoped>
p {
  font-weight: bold;
  text-align: left;
}
</style>
