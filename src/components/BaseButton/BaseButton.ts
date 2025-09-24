import { computed, type PropType } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'link'
type ButtonSize = 'sm' | 'lg' | ''
type ButtonType = 'button' | 'submit' | 'reset'

export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'primary'
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as PropType<ButtonType>,
      default: 'button'
    },
    icon: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props: {
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
    loading: boolean;
    type: ButtonType;
    icon: string;
    block: boolean;
  }, { emit }: { emit: (event: 'click', ...args: any[]) => void }) {
    const buttonClasses = computed(() => [
      'btn',
      `btn-${props.variant}`,
      {
        [`btn-${props.size}`]: props.size,
        'w-100': props.block,
        'disabled': props.disabled || props.loading
      }
    ])

    function handleClick(event: MouseEvent): void {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }

    return {
      buttonClasses,
      handleClick
    }
  }
}