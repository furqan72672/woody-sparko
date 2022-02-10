import AppointmentsView from "@/views/appointments/AppointmentsView";
import AppointmentForm from "@/views/appointments/AppointmentForm";

const appointmentsRoutes = [
        {
            name: 'Appointments',
            path: '/appointments',
            component: AppointmentsView
        },
        {
            name: 'NewAppointment',
            path: '/appointment',
            component: AppointmentForm
        }
];

export const appointmentsRouter = appointmentsRoutes.filter(function(x) {
    return x !== null;
})
