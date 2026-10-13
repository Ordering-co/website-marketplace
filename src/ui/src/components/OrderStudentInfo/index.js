import React from 'react'
import PropTypes from 'prop-types'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Container } from './styles'

export const OrderStudentInfo = (props) => {
  const { order } = props
  const [, t] = useLanguage()
  const { students } = useSchoolStudents()

  const studentId = order?.student?.id ?? order?.student_id
  if (!studentId) return null
  const student = order?.student || students.find((s) => s.id === Number(studentId))
  if (!student) return null

  return (
    <Container>
      <h1>{t('SCHOOL_STUDENT', 'Student')}</h1>
      <div className='name'>{student.name} {student.lastname}</div>
      {(student.classroom?.name || student.grade?.name) && (
        <div className='meta'>
          {[student.classroom?.name, student.grade?.name].filter(Boolean).join(' · ')}
        </div>
      )}
    </Container>
  )
}

OrderStudentInfo.propTypes = {
  order: PropTypes.object
}
