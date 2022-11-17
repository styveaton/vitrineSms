/* eslint-disable prettier/prettier */
<template>
  <a
    class="btn mb-0"
    :class="getClasses(variant, color, size, fullWidth, active)"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'argon-button',
  props: {
    color: {
      type: String,
      default: 'info',
    },
    size: {
      type: String,
      default: 'md',
    },
    variant: {
      type: String,
      default: 'fill',
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    getClasses: (variant, color, size, fullWidth, active) => {
      let colorValue, sizeValue, fullWidthValue, activeValue;

      // Setting the button variant and color
      if (variant === 'gradient') {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        colorValue = `bg-gradient-${color}`;
      } else if (variant === 'outline') {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        colorValue = `btn-outline-${color}`;
      } else {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        colorValue = `btn-${color}`;
      }

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      sizeValue = size ? `btn-${size}` : null;

      fullWidthValue = fullWidth ? 'w-100' : null;

      activeValue = active ? 'active' : null;

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${colorValue} ${sizeValue} ${fullWidthValue} ${activeValue}`;
    },
  },
};
</script>
