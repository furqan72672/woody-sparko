<template>
  <div>
    <data-table
        :loader="loadData"
        :headers="headers"
        title="Time Slots"
        :allow-add="true"
        @add-new="addNew"
        @done="$router.back()"
        :delete-handler="service.delete"
        delete-length-check
        :edit-handler="edit"
    >
      <template #from="{ item }">
        <span>{{ getTimeSlotValue(item.from) }}</span>
      </template>
      <template #to="{ item }">
        <span>{{ getTimeSlotValue(item.to) }}</span>
      </template>
    </data-table>

    <loading-dialog v-model="loadingDialog" message="Loading..."/>
  </div>
</template>

<script>
import DataTable from '../../components/DataTable';
import LoadingDialog from "../../components/LoadingDialog";
import {TimeSlotService} from "@/services/time_slots-service";
import {getTimeSlotValue} from "@/utils/local";


export default {
  components: {LoadingDialog, DataTable},

  data: () => ({
    loading: false,
    loadingDialog: false,
    service: new TimeSlotService(),

    headers: [
      {
        text: 'From',
        value: 'from',
        sortable: false
      },
      {
        text: 'To',
        value: 'to',
        sortable: false
      },
    ]
  }),

  methods: {
    getTimeSlotValue,
    edit(item) {
      this.$router.push(`/time-slot?id=${item._id}`);
    },
    addNew() {
      this.$router.push('/time-slot');
    },
    loadData() {
      return this.service.fetchAll();
    }
  }
};
</script>

<style lang="sass" scoped>
.chip
  font-weight: 500
  padding: 5px 10px
  border-radius: 50px
  background: lightgray
</style>
