import { validationMixin } from 'vuelidate';
import { VariadicCallbackFunction } from '@/types';

export default {
  methods: {
    submit(successCallback: VariadicCallbackFunction) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        for (const field in this.$v.$params) {
          this.validateField(field);
        }
      } else {
        successCallback();
      }
    },
    validateField(field: string) {
      this.$v[field].$touch();
    }
  },
  mixins: [validationMixin],
}