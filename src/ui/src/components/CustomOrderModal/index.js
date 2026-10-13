import React, { useState, useEffect } from 'react'
import { useApi } from '~components/contexts/ApiContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'
import { useEvent } from '~components/contexts/EventContext'
import { Modal } from '~ui/src/components/Modal'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { fetchPluginConfig, createCustomOrder } from '../../utils/customOrder'

export const CustomOrderModal = ({ open, onClose }) => {
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [{ token }] = useSession()
  const [events] = useEvent()

  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState(null)
  const [step2Data, setStep2Data] = useState(null)
  const [pluginConfig, setPluginConfig] = useState({})
  const [actionState, setActionState] = useState({ loading: false, error: null })

  useEffect(() => {
    if (!open) return
    const loadConfig = async () => {
      const config = await fetchPluginConfig(ordering?.project)
      setPluginConfig(config)
    }
    loadConfig()
  }, [open])

  const handleStep1Continue = (data) => {
    setStep1Data(data)
    setStep(2)
  }

  const handlePlaceOrder = async ({ items, paymethod, instructions, declaredValue }) => {
    setActionState({ loading: true, error: null })

    const body = {
      paymethod_gateway: paymethod,
      address_id: step1Data.addressId,
      pickup: {
        name: step1Data.pickupName || step1Data.pickupAddress,
        address: step1Data.pickupAddress,
        location: step1Data.pickupLocation
      },
      products: items.map(item => ({ name: item.name, quantity: item.quantity })),
      ...(instructions && { comment: instructions }),
      ...(declaredValue && { declared_value: parseFloat(declaredValue) })
    }

    try {
      const content = await createCustomOrder(ordering?.project, token, body)

      if (!content.error) {
        setActionState({ loading: false, error: null })
        handleClose()
        if (content.result?.uuid) {
          events.emit('go_to_page', { page: 'order_detail', params: { orderId: content.result.uuid } })
        }
      } else {
        const errorMsg = Array.isArray(content.result) ? content.result.join(', ') : content.result
        setActionState({ loading: false, error: errorMsg })
      }
    } catch (err) {
      setActionState({ loading: false, error: err.message })
    }
  }

  const handleClose = () => {
    setStep(1)
    setStep1Data(null)
    setStep2Data(null)
    setActionState({ loading: false, error: null })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={step === 1
        ? t('CUSTOM_ORDER_STEP1_TITLE', 'Where do we pickup and deliver?')
        : t('CUSTOM_ORDER_STEP2_TITLE', 'What do you want us to pickup or buy the product?')
      }
      width='600px'
      hideScrollbar
      disableDefaultStyleOnRender
    >
      {step === 1 && (
        <Step1
          pluginConfig={pluginConfig}
          initialData={step1Data}
          onContinue={handleStep1Continue}
        />
      )}
      {step === 2 && step1Data && (
        <Step2
          distanceKm={step1Data.distanceKm}
          pluginConfig={pluginConfig}
          actionState={actionState}
          initialData={step2Data}
          onPlaceOrder={handlePlaceOrder}
          onBack={(data) => { setStep2Data(data); setStep(1) }}
        />
      )}
    </Modal>
  )
}

export default CustomOrderModal
