import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSelectedStudent } from '~components/hooks/useSelectedStudent'
import { useSession } from '~components/contexts/SessionContext'
import { Modal } from '../Modal'
import { StudentFormModal } from '../StudentFormModal'
import { Content, StudentButton, EmptyMessage, CreateButton } from './styles'

export const StudentOnboardingPopup = (props) => {
  const { business, forceOpen, onForceClose } = props
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const { students, loading, refresh } = useSchoolStudents()
  const { studentId: selected, setStudentId } = useSelectedStudent(business?.slug)
  const [dismissed, setDismissed] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const controlled = forceOpen !== undefined
  const isSchool = business?.vertical === 'school'
  const schoolStudents = students.filter((s) => Number(s.school_id ?? s.school?.id) === Number(business?.id))
  const open = isSchool && auth && !formOpen &&
    (controlled ? forceOpen : (!selected && !dismissed && !loading && schoolStudents.length > 1))

  const handleClose = () => {
    if (controlled) onForceClose && onForceClose()
    else setDismissed(true)
  }

  useEffect(() => {
    document.body.style.overflowY = open ? 'hidden' : 'auto'
  }, [open])

  const pick = (studentId) => {
    setStudentId(studentId)
    setDismissed(true)
    if (controlled) onForceClose && onForceClose()
  }

  const handleSaved = (createdStudent) => {
    refresh()
    if (createdStudent?.id) pick(createdStudent.id)
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={t('SCHOOL_WHO_ORDERING_FOR', 'Who are you ordering for?')}
        width='480px'
      >
        <Content>
          {schoolStudents.length === 0
            ? <EmptyMessage>{t('SCHOOL_NO_STUDENTS_REGISTERED', 'You have no registered students for this school yet. Add one to start ordering.')}</EmptyMessage>
            : schoolStudents.map((student) => (
              <StudentButton key={student.id} onClick={() => pick(student.id)}>
                {student.name} {student.lastname}
              </StudentButton>
            ))}
          <CreateButton type='button' onClick={() => setFormOpen(true)}>
            {t('SCHOOL_ADD_STUDENT', 'Add student')}
          </CreateButton>
        </Content>
      </Modal>
      {formOpen && (
        <StudentFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          defaultSchoolId={business?.id}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

StudentOnboardingPopup.propTypes = {
  business: PropTypes.object,
  forceOpen: PropTypes.bool,
  onForceClose: PropTypes.func
}
