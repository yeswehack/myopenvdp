import { boot } from 'quasar/wrappers'
import VuePlugin from 'quasar-ui-my-open-vdp'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
