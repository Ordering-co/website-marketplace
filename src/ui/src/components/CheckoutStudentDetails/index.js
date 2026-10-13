import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useCartStudent } from '~components/hooks/useCartStudent'
import { useSelectedStudent } from '~components/hooks/useSelectedStudent'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useToast, ToastType } from '~components/contexts/ToastContext'
import { Select } from '~ui/src/styles/Select'
import { assignCartStudentIfChanged } from './schoolCartStudent'
import { Header } from '../UserDetails/styles'
import { StudentFormModal } from '../StudentFormModal'
import { Container, SelectWrapper, Actions, EditLink, Info } from './styles'

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

export const CheckoutStudentDetails = (props) => {
  const { cart, onStudentAssigned } = props
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const { students, loading, loaded, refresh } = useSchoolStudents()
  const { assignStudent } = useCartStudent()
  const { studentId: selectedStudentId, setStudentId } = useSelectedStudent(cart?.business?.slug)
  const cartStudentId = cart?.student_id ?? cart?.student?.id ?? null
  const [currentId, setCurrentId] = useState(cartStudentId)
  const [editOpen, setEditOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const assignedRef = useRef(cartStudentId)
  const seenCartRef = useRef({ uuid: cart?.uuid ?? null, studentId: cartStudentId })

  const schoolStudents = students.filter((s) => Number(s.school_id ?? s.school?.id) === Number(cart?.business_id ?? cart?.business?.id))

  const syncCart = async (sid) => {
    const result = await assignCartStudentIfChanged({
      cartUuid: cart?.uuid,
      nextStudentId: sid ?? null,
      assignedStudentId: assignedRef.current,
      assignStudent
    })
    assignedRef.current = result.assignedStudentId
    if (result.error) {
      const message = result.error[0]
      showToast(ToastType.Error, t(message, String(message).replace(/_/g, ' ')))
    } else if (result.didAssign) {
      onStudentAssigned?.(result.assignedStudentId)
    }
    return result
  }

  const selectStudent = async (value) => {
    setCurrentId(value)
    const result = await syncCart(value)
    if (String(result.assignedStudentId ?? '') === String(value ?? '')) {
      setStudentId(value)
      return
    }
    setCurrentId(result.assignedStudentId)
  }

  useEffect(() => {
    const seen = seenCartRef.current
    const uuidChanged = (seen.uuid ?? null) !== (cart?.uuid ?? null)
    const studentChanged = String(seen.studentId ?? '') !== String(cartStudentId ?? '')
    if (uuidChanged || studentChanged) {
      seenCartRef.current = { uuid: cart?.uuid ?? null, studentId: cartStudentId }
      assignedRef.current = cartStudentId
      if (!uuidChanged) {
        setCurrentId(cartStudentId)
        if (String(selectedStudentId ?? '') !== String(cartStudentId ?? '')) setStudentId(cartStudentId)
        onStudentAssigned?.(cartStudentId)
        return
      }
    }
    if (loading || !loaded) return
    const cartSid = cartStudentId
    if (selectedStudentId) {
      if (schoolStudents.some((s) => s.id === Number(selectedStudentId))) {
        syncCart(selectedStudentId).then((result) => {
          if (result.error) setStudentId(null)
        })
      } else {
        setStudentId(null)
      }
      return
    }
    if (cartSid && schoolStudents.some((s) => s.id === Number(cartSid))) setStudentId(cartSid)
    else if (schoolStudents.length === 1) selectStudent(schoolStudents[0].id)
    else if (cartSid) syncCart(null)
  }, [loading, loaded, selectedStudentId, cartStudentId, cart?.uuid, students])

  const studentId = selectedStudentId ?? currentId ?? cart?.student_id ?? cart?.student?.id
  const student = students.find((s) => s.id === Number(studentId)) || cart?.student
  const studentOptions = schoolStudents.map((s) => ({ value: s.id, content: `${s.name} ${s.lastname}` }))
  const allergies = toArray(student?.allergies)
  const dietary = toArray(student?.dietary_tags)

  const handleChange = (value) => {
    selectStudent(value)
  }

  const handleCreated = (createdStudent) => {
    refresh()
    if (createdStudent?.id) handleChange(createdStudent.id)
    setCreateOpen(false)
  }

  return (
    <Container>
      <Header className='user-form'>
        <h1>{t('SCHOOL_STUDENT', 'Student')}</h1>
      </Header>
      {schoolStudents.length > 0 && (
        <SelectWrapper>
          <Select
            notReload
            placeholder={t('SCHOOL_SELECT_STUDENT', 'Select a student')}
            options={studentOptions}
            defaultValue={studentId ? Number(studentId) : null}
            onChange={(value) => handleChange(value)}
          />
        </SelectWrapper>
      )}
      {student && (
        <Info>
          {student.classroom?.name && <p>{t('SCHOOL_CLASSROOM', 'Classroom')}: {student.classroom.name}</p>}
          {student.grade?.name && <p>{t('SCHOOL_GRADE', 'Grade')}: {student.grade.name}</p>}
          {allergies.length > 0 && <p>{t('SCHOOL_ALLERGIES', 'Allergies')}: {allergies.join(', ')}</p>}
          {dietary.length > 0 && <p>{t('SCHOOL_DIETARY_TAGS', 'Dietary tags')}: {dietary.join(', ')}</p>}
        </Info>
      )}
      <Actions>
        {student && (
          <EditLink type='button' onClick={() => setEditOpen(true)}>
            {t('SCHOOL_EDIT_STUDENT_DETAILS', 'Edit student details')}
          </EditLink>
        )}
        <EditLink type='button' onClick={() => setCreateOpen(true)}>
          {t('SCHOOL_ADD_STUDENT', 'Add student')}
        </EditLink>
      </Actions>
      {editOpen && (
        <StudentFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          student={student}
          onSaved={() => refresh()}
        />
      )}
      {createOpen && (
        <StudentFormModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          defaultSchoolId={cart?.business_id ?? cart?.business?.id}
          onSaved={handleCreated}
        />
      )}
    </Container>
  )
}

CheckoutStudentDetails.propTypes = {
  cart: PropTypes.object,
  onStudentAssigned: PropTypes.func
}
