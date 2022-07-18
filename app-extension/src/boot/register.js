import { boot } from 'quasar/wrappers'
import VuePlugin from 'quasar-ui-vdp-form'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
