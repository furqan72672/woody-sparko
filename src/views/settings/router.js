import SettingForm from "@/views/settings/SettingForm";

const settingsRoutes = [
    {
        name: 'Setting',
        path: '/settings',
        component: SettingForm
    },
];

export const settingsRouter = settingsRoutes.filter(function (x) {
    return x !== null;
})
