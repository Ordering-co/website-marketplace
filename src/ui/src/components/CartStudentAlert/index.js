import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '../Modal'
import { Content, Intro, ItemList, Item, Actions } from './styles'

const toArray = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      return []
    }
  }
  return []
}

const conflictReasons = (product, student) => {
  const reasons = { allergens: [], missingDietary: [] }
  const studentAllergies = toArray(student?.allergies)
  const studentDietary = toArray(student?.dietary_tags)
  const productAllergens = toArray(product?.allergens)
  reasons.allergens = productAllergens.filter((a) => studentAllergies.includes(a))
  if (product?.dietary_tags !== undefined && product?.dietary_tags !== null) {
    const productDietary = toArray(product.dietary_tags)
    reasons.missingDietary = studentDietary.filter((d) => !productDietary.includes(d))
  }
  return reasons
}

const hasConflict = (reasons) => reasons.allergens.length > 0 || reasons.missingDietary.length > 0

export const CartStudentAlert = (props) => {
  const { cart } = props
  const [, t] = useLanguage()
  const { students } = useSchoolStudents()
  const [, { removeProduct }] = useOrder()
  const [dismissedSig, setDismissedSig] = useState(null)
  const [removing, setRemoving] = useState(false)

  const studentId = cart?.student_id ?? cart?.student?.id
  const student = cart?.student || students.find((s) => s.id === Number(studentId))

  const conflicting = useMemo(() => {
    if (!student) return []
    return (cart?.products || [])
      .map((product) => ({ product, reasons: conflictReasons(product, student) }))
      .filter((entry) => hasConflict(entry.reasons))
  }, [cart?.products, student])

  const signature = conflicting.map((e) => e.product.code ?? e.product.id).sort().join(',')
  const open = conflicting.length > 0 && signature !== dismissedSig

  useEffect(() => {
    document.body.style.overflowY = open ? 'hidden' : 'auto'
  }, [open])

  const handleKeep = () => setDismissedSig(signature)

  const handleRemove = async () => {
    setRemoving(true)
    for (const entry of conflicting) {
      try { await removeProduct(entry.product, cart) } catch (err) {}
    }
    setRemoving(false)
    setDismissedSig(signature)
  }

  const reasonText = (reasons) => {
    const parts = []
    if (reasons.allergens.length) {
      parts.push(`${t('SCHOOL_ALLERGIES', 'Allergies')}: ${reasons.allergens.join(', ')}`)
    }
    if (reasons.missingDietary.length) {
      parts.push(`${t('SCHOOL_MISSING_DIETARY', 'Missing dietary')}: ${reasons.missingDietary.join(', ')}`)
    }
    return parts.join(' · ')
  }

  return (
    <Modal
      open={open}
      onClose={handleKeep}
      title={t('SCHOOL_CART_CONFLICT_TITLE', 'Items not suitable for student')}
      width='480px'
    >
      <Content>
        <Intro>
          {t('SCHOOL_CART_CONFLICT_INTRO', 'These items in your cart do not match')}{' '}
          <strong>{student?.name} {student?.lastname}</strong>{t('SCHOOL_CART_CONFLICT_INTRO_2', "'s allergies or dietary needs:")}
        </Intro>
        <ItemList>
          {conflicting.map((entry) => (
            <Item key={entry.product.code ?? entry.product.id}>
              <div className='name'>{entry.product.name}</div>
              <div className='reason'>{reasonText(entry.reasons)}</div>
            </Item>
          ))}
        </ItemList>
        <Actions>
          <Button color='primary' type='button' onClick={handleRemove} disabled={removing}>
            {removing ? t('LOADING', 'Loading') : t('SCHOOL_REMOVE_ITEMS', 'Remove these items')}
          </Button>
          <Button outline type='button' onClick={handleKeep} disabled={removing}>
            {t('SCHOOL_KEEP_ITEMS', 'Keep them')}
          </Button>
        </Actions>
      </Content>
    </Modal>
  )
}

CartStudentAlert.propTypes = {
  cart: PropTypes.object
}
