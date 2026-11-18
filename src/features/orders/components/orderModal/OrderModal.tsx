import type { ReactElement } from 'react'
import type { Instrument } from '@/features/instruments/domain/instrument.types'
import { Modal } from '@/shared/ui'
import './OrderModal.scss'
import { OrderForm } from './OrderForm'

interface OrderModalProps {
  readonly instrument: Instrument | null
  readonly open: boolean
  readonly onClose: () => void
}

export function OrderModal({ instrument, open, onClose }: OrderModalProps): ReactElement {
  return (
    <Modal title="Operar" open={open} onClose={onClose}>
      {instrument === null ? null : (
        <OrderForm key={instrument.id} instrument={instrument} onClose={onClose} />
      )}
    </Modal>
  )
}