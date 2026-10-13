import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useCartStudent } from '~components/hooks/useCartStudent'
import { useSelectedStudent } from '~components/hooks/useSelectedStudent'
import { useSession } from '~components/contexts/SessionContext'
import { useTheme } from 'styled-components'
import { Select } from '~ui/src/styles/Select'
import { Modal } from '~ui/src/components/Modal'
import { LoginForm } from '~ui/src/components/LoginForm'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { ForgotPasswordForm } from '~ui/src/components/ForgotPasswordForm'
import { StudentFormModal } from '../StudentFormModal'
import { assignCartStudentIfChanged } from '../CheckoutStudentDetails/schoolCartStudent'
import { Container, Label, Notice, AddStudentLink } from './styles'

export const StudentSelector = (props) => {
  const { business } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ auth }, { login }] = useSession()
  const { students, loading, loaded, refresh } = useSchoolStudents()
  const [orderState] = useOrder()
  const { assignStudent } = useCartStudent()
  const { studentId: selected, setStudentId } = useSelectedStudent(business?.slug)
  const [formOpen, setFormOpen] = useState(false)
  const [selectKey, setSelectKey] = useState(0)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authPage, setAuthPage] = useState('login')

  const cart = business?.id ? orderState?.carts?.[`businessId:${business.id}`] : null
  const cartStudentId = cart?.student_id ?? cart?.student?.id ?? null
  const isSchool = business?.vertical === 'school'
  const schoolStudents = students.filter((s) => Number(s.school_id ?? s.school?.id) === Number(business?.id))
  const selectedStudent = selected ? students.find((s) => s.id === Number(selected)) : null
  const assignedRef = useRef(cartStudentId)
  const seenCartRef = useRef({ uuid: cart?.uuid ?? null, studentId: cartStudentId })

  const syncCart = async (sid) => {
    const result = await assignCartStudentIfChanged({
      cartUuid: cart?.uuid,
      nextStudentId: sid ?? null,
      assignedStudentId: assignedRef.current,
      assignStudent
    })
    assignedRef.current = result.assignedStudentId
    return result
  }

  useEffect(() => {
    const seen = seenCartRef.current
    const uuidChanged = (seen.uuid ?? null) !== (cart?.uuid ?? null)
    const studentChanged = String(seen.studentId ?? '') !== String(cartStudentId ?? '')
    if (uuidChanged || studentChanged) {
      seenCartRef.current = { uuid: cart?.uuid ?? null, studentId: cartStudentId }
      assignedRef.current = cartStudentId
      if (!uuidChanged && isSchool) {
        if (String(selected ?? '') !== String(cartStudentId ?? '')) setStudentId(cartStudentId)
        return
      }
    }
    if (!cart?.uuid) return
    if (!isSchool) {
      syncCart(null)
      if (selected) setStudentId(null)
      return
    }
    if (loading || !loaded) return
    if (selected) {
      if (schoolStudents.some((s) => s.id === Number(selected))) syncCart(selected)
      else setStudentId(null)
      return
    }
    if (cartStudentId && schoolStudents.some((s) => s.id === Number(cartStudentId))) setStudentId(cartStudentId)
    else if (schoolStudents.length === 1) setStudentId(schoolStudents[0].id)
    else if (cartStudentId) syncCart(null)
  }, [isSchool, selected, cart?.uuid, cartStudentId, loading, loaded, students])

  if (!isSchool) return null

  const studentOptions = schoolStudents.map((student) => ({ value: student.id, content: `${student.name} ${student.lastname}` }))

  const handleChange = (value) => {
    setStudentId(value)
  }

  const handleAddStudent = () => {
    if (!auth) { setAuthModalOpen(true); return }
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setSelectKey((k) => k + 1)
  }

  const handleSaved = (createdStudent) => {
    refresh()
    if (createdStudent?.id) setStudentId(createdStudent.id)
    closeForm()
  }

  const closeAuthModal = () => {
    setAuthModalOpen(false)
    setAuthPage('login')
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setAuthPage(page)
  }

  const handleSuccessLogin = (user) => {
    if (user) closeAuthModal()
  }

  const handleSuccessSignup = (user) => {
    login({ user, token: user?.session?.access_token })
    closeAuthModal()
  }

  return (
    <>
      <Container>
        {schoolStudents.length > 0 && (
          <>
            <Label>{t('SCHOOL_ORDERING_FOR', 'Ordering for')}</Label>
            <Select
              key={selectKey}
              notReload
              placeholder={loading ? t('LOADING', 'Loading') : t('SCHOOL_SELECT_STUDENT', 'Select a student')}
              options={studentOptions}
              defaultValue={selected ? Number(selected) : null}
              onChange={(value) => handleChange(value)}
            />
          </>
        )}
        <AddStudentLink type='button' onClick={handleAddStudent}>
          {t('SCHOOL_ADD_STUDENT', 'Add student')}
        </AddStudentLink>
      </Container>
      {selectedStudent && (
        <Notice>
          {t('SCHOOL_MENU_FILTERED_FOR', 'Showing the menu filtered for')} <strong>{selectedStudent.name} {selectedStudent.lastname}</strong>, {t('SCHOOL_BASED_ON_ALLERGIES_DIET', 'based on their allergies and dietary needs.')}
        </Notice>
      )}
      {formOpen && (
        <StudentFormModal
          open={formOpen}
          onClose={closeForm}
          defaultSchoolId={business?.id}
          onSaved={handleSaved}
        />
      )}
      {authModalOpen && !auth && (
        <Modal
          open={authModalOpen}
          onRemove={closeAuthModal}
          onClose={closeAuthModal}
          width='50%'
          authModal
        >
          {authPage === 'login' && (
            <LoginForm
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a onClick={(e) => handleCustomModalClick(e, { page: 'signup' })} href='#'>
                  {t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a onClick={(e) => handleCustomModalClick(e, { page: 'forgotpassword' })} href='#'>
                  {t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset Password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {authPage === 'signup' && (
            <SignUpForm
              elementLinkToLogin={
                <a onClick={(e) => handleCustomModalClick(e, { page: 'login' })} href='#'>
                  {t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              useLoginByCellphone
              useChekoutFileds
              handleSuccessSignup={handleSuccessSignup}
              isPopup
              closeModal={closeAuthModal}
            />
          )}
          {authPage === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a onClick={(e) => handleCustomModalClick(e, { page: 'login' })} href='#'>
                  {t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
    </>
  )
}

StudentSelector.propTypes = {
  business: PropTypes.object
}
