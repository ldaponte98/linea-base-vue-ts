import { watch, onBeforeUnmount } from 'vue'

export interface ConfirmModalProps {
  isVisible: boolean
  title?: string
  message: string
}

export default {
  name: 'ConfirmModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar'
    },
    message: {
      type: String,
      required: true
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props: ConfirmModalProps, { emit }: { emit: (event: 'confirm' | 'cancel') => void }) {
    // Métodos
    function onConfirm(): void {
      emit('confirm')
    }

    function onCancel(): void {
      emit('cancel')
    }

    // Efectos de ciclo de vida
    function updateBodyClass(isVisible: boolean): void {
      if (isVisible) {
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
      }
    }

    // watch para isVisible
    watch(() => props.isVisible, (newVal: boolean) => {
      updateBodyClass(newVal)
    })

    // Limpieza al desmontar
    onBeforeUnmount(() => {
      document.body.classList.remove('modal-open')
    })

    return {
      onConfirm,
      onCancel
    }
  }
}