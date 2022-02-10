import TimeSlotsForm from "@/views/time-slots/TimeSlotsForm";
import TimeSlotsView from "@/views/time-slots/TimeSlotsView";

const timeSlotsRoutes = [
    {
        name: 'TimeSlots',
        path: '/time-slots',
        component: TimeSlotsView
    },
    {
        name: 'NewTimeSlot',
        path: '/time-slot',
        component: TimeSlotsForm
    }
];

export const timeSlotsRouter = timeSlotsRoutes.filter(function (x) {
    return x !== null;
})
