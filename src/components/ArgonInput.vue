<template>
  <div class="form-group">
    <div :class="hasIcon(icon)">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <input :type="type" @keyup='verif( $event.target.value)' class="form-control" :class="getClasses(size, valid)"
        :name="name" :id="id" :placeholder="placeholder" :isRequired="isRequired" :value='modelValue'
        @input='$emit("update:modelValue", $event.target.value)' />
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { FormatData } from '../boot/FormatData';

export default {
  name: "argon-input",
  props: {
    size: {
      type: String,
      default: "default",
    },
    valid: {
      type: Boolean,
      default: false,
    },
    icon: String,
    iconDir: String,
    name: String,
    id: String,
    placeholder: String,
    type: String,
    isRequired: Boolean, modelValue: String
  },
  methods: {
    getClasses: (size, valid) => {
      // let sizeValue, isValidValue;

      // sizeValue = size ? `form-control-${size}` : null;

      // isValidValue = valid ? `${valid}` : "invalid";

      // return `${sizeValue} ${isValidValue}`;
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    getIcon: (icon) => (icon ? icon : null),
    hasIcon: (icon) => (icon ? "input-group" : null),
  },
  setup(props, { emit }) {
    // const emit = defineEmits()
      const verif = (data) => {
        if (props.type == 'phone') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        data = new FormatData().verifNumber(data.toString())
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        emit("update:modelValue", data);
        console.log('yyy', data)

      }
    }
    return {

      verif
    };
  },
};
</script>
