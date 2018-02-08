import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.component('float-input', {
    template: '\
    <span>\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)">\
    </span>\
  ',
    props: ['value'],
    methods: {
        // Instead of updating the value directly, this
        // method is used to format and place constraints
        // on the input's value
        updateValue: function (value) {
            var formattedValue = value
            // Remove whitespace on either side
                .trim()
                // Shorten to 2 decimal places
                .slice(
                    0,
                    value.indexOf('.') === -1
                        ? value.length
                        : value.indexOf('.') + 3
                )
            // If the value was not already normalized,
            // manually override it to conform
            if (formattedValue !== value) {
                this.$refs.input.value = formattedValue
            }
            // Emit the number value through the input event
            this.$emit('input', Number(formattedValue))
        }
    }
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
