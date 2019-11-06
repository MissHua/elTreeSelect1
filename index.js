// vue-components
import ElTreeSelect from './ElTreeSelect/index.vue'
let components = [
  ElTreeSelect
]
module.exports = {
  install: function(Vue,options){
    components.forEach(component => {
      Vue.component(component.name, component);
    })
  }
}
