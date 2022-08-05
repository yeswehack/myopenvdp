import VdpForm from './components/VdpForm.vue';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const version = __UI_VERSION__;

function install(app) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  app.component('VdpForm', VdpForm);
}

export { version, VdpForm, install };
