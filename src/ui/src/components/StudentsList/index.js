import React, { useState } from 'react'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useLanguage } from '~components/contexts/LanguageContext'
import { StudentFormModal } from '../StudentFormModal'
import { Wrapper, Header, AddButton, StudentCard, Empty } from './styles'

export const StudentsList = () => {
  const [, t] = useLanguage()
  const { students, loading, refresh } = useSchoolStudents()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (student) => { setEditing(student); setFormOpen(true) }

  return (
    <Wrapper>
      <Header>
        <h1>{t('SCHOOL_MY_STUDENTS', 'My students')}</h1>
        <AddButton type='button' onClick={openCreate}>{t('SCHOOL_ADD_STUDENT', 'Add student')}</AddButton>
      </Header>

      {loading
        ? <Empty>{t('LOADING', 'Loading')}</Empty>
        : students.length === 0
          ? <Empty>{t('SCHOOL_NO_STUDENTS_YET', 'You have no registered students yet. Add one to start ordering for them.')}</Empty>
          : students.map((student) => (
            <StudentCard key={student.id} onClick={() => openEdit(student)}>
              <strong>{student.name} {student.lastname}</strong>
              <span>{[student.school?.name, student.classroom?.name, student.grade?.name].filter(Boolean).join(' · ') || '-'}</span>
            </StudentCard>
          ))}

      {formOpen && (
        <StudentFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          student={editing}
          onSaved={() => refresh()}
        />
      )}
    </Wrapper>
  )
}
