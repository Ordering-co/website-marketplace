import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSchools } from '~components/hooks/useSchools'
import { useSchoolStudents } from '~components/hooks/useSchoolStudents'
import { useToast, ToastType } from '~components/contexts/ToastContext'
import { SCHOOL_ALLERGENS, SCHOOL_DIETARY_TAGS } from '~components/constants/school'
import { Select } from '~ui/src/styles/Select'
import { Input } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '../Modal'
import { Form, Field, ChipGroup, Chip, Actions } from './styles'

const emptyForm = { schoolId: null, name: '', lastname: '', classroomId: null, gradeId: null, allergies: [], dietaryTags: [] }
const generateCode = () => `STU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

export const StudentFormModal = (props) => {
  const { open, onClose, onSaved, defaultSchoolId, student } = props
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const filterSchoolId = student ? (student.school?.id ?? student.school_id) : defaultSchoolId
  const { schools, loading: loadingSchools } = useSchools(filterSchoolId, open)
  const { createStudent, updateStudent } = useSchoolStudents()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const isEdit = !!student

  useEffect(() => {
    if (!open) return
    if (student) {
      setForm({
        schoolId: student.school?.id ?? student.school_id ?? null,
        name: student.name || '',
        lastname: student.lastname || '',
        classroomId: student.classroom?.id ?? student.classroom_id ?? null,
        gradeId: student.grade?.id ?? student.grade_id ?? null,
        allergies: Array.isArray(student.allergies) ? student.allergies : [],
        dietaryTags: Array.isArray(student.dietary_tags) ? student.dietary_tags : []
      })
    } else {
      setForm({ ...emptyForm, schoolId: defaultSchoolId ?? null })
    }
  }, [open, student, defaultSchoolId])

  useEffect(() => {
    if (!open || isEdit || form.schoolId) return
    if (schools.length === 1) setForm((f) => ({ ...f, schoolId: schools[0].id }))
  }, [open, isEdit, schools, form.schoolId])

  const selectedSchool = schools.find((s) => s.id === Number(form.schoolId))
  const schoolOptions = schools.map((s) => ({ value: s.id, content: s.name }))
  const classroomOptions = (selectedSchool?.classrooms || []).map((c) => ({ value: c.id, content: c.name }))
  const gradeOptions = [...(selectedSchool?.grades || [])]
    .sort((a, b) => a.id - b.id)
    .map((g) => ({ value: g.id, content: g.name }))

  const toggle = (key, value) => {
    setForm((f) => {
      const current = f[key] || []
      return { ...f, [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] }
    })
  }

  const handleSave = async () => {
    if (!form.schoolId) { showToast(ToastType.Error, t('SCHOOL_SELECT_SCHOOL', 'Select a school')); return }
    if (!form.name || !form.lastname) { showToast(ToastType.Error, t('SCHOOL_NAME_REQUIRED', 'Name is required')); return }
    if (!form.classroomId) { showToast(ToastType.Error, t('SCHOOL_CLASSROOM_REQUIRED', 'Classroom is required')); return }
    if (gradeOptions.length > 0 && !form.gradeId) { showToast(ToastType.Error, t('SCHOOL_GRADE_REQUIRED', 'Grade is required')); return }
    setSaving(true)
    const payload = {
      classroom_id: form.classroomId,
      grade_id: form.gradeId || undefined,
      name: form.name,
      lastname: form.lastname,
      allergies: form.allergies,
      dietary_tags: form.dietaryTags
    }
    const { error, result } = isEdit
      ? await updateStudent(student.id, payload)
      : await createStudent({ ...payload, school_id: form.schoolId, code: generateCode() })
    setSaving(false)
    if (error) { showToast(ToastType.Error, Array.isArray(result) ? result[0] : result); return }
    showToast(ToastType.Success, t('SCHOOL_CHANGES_SAVED', 'Changes saved'))
    onSaved && onSaved(result)
    onClose && onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? t('SCHOOL_EDIT_STUDENT', 'Edit student') : t('SCHOOL_ADD_STUDENT', 'Add student')}
      width='520px'
    >
      <Form>
        <Select
          notReload
          placeholder={t('SCHOOL_SELECT_SCHOOL', 'Select a school')}
          options={schoolOptions}
          defaultValue={form.schoolId ? Number(form.schoolId) : null}
          onChange={(value) => setForm((f) => ({ ...f, schoolId: value, classroomId: null, gradeId: null }))}
          isDisabled={isEdit}
        />
        <Input
          className='form'
          value={form.name}
          placeholder={t('NAME', 'Name')}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <Input
          className='form'
          value={form.lastname}
          placeholder={t('LASTNAME', 'Lastname')}
          onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))}
        />
        <Select
          notReload
          placeholder={form.schoolId ? t('SCHOOL_SELECT_CLASSROOM', 'Select a classroom') : t('SCHOOL_SELECT_SCHOOL_FIRST', 'Select a school first')}
          options={classroomOptions}
          defaultValue={form.classroomId ? Number(form.classroomId) : null}
          onChange={(value) => setForm((f) => ({ ...f, classroomId: value }))}
          isDisabled={!form.schoolId}
        />
        <Select
          notReload
          placeholder={form.schoolId ? t('SCHOOL_SELECT_GRADE', 'Select a grade') : t('SCHOOL_SELECT_SCHOOL_FIRST', 'Select a school first')}
          options={gradeOptions}
          defaultValue={form.gradeId ? Number(form.gradeId) : null}
          onChange={(value) => setForm((f) => ({ ...f, gradeId: value }))}
          isDisabled={!form.schoolId}
        />
        <Field>
          <label>{t('SCHOOL_ALLERGIES', 'Allergies')}</label>
          <ChipGroup>
            {SCHOOL_ALLERGENS.map((a) => (
              <Chip key={a.value} type='button' active={form.allergies.includes(a.value)} onClick={() => toggle('allergies', a.value)}>
                {t(`SCHOOL_ALLERGEN_${a.value.toUpperCase()}`, a.name)}
              </Chip>
            ))}
          </ChipGroup>
        </Field>
        <Field>
          <label>{t('SCHOOL_DIETARY_TAGS', 'Dietary tags')}</label>
          <ChipGroup>
            {SCHOOL_DIETARY_TAGS.map((d) => (
              <Chip key={d.value} type='button' active={form.dietaryTags.includes(d.value)} onClick={() => toggle('dietaryTags', d.value)}>
                {t(`SCHOOL_DIETARY_${d.value.toUpperCase()}`, d.name)}
              </Chip>
            ))}
          </ChipGroup>
        </Field>
        <Actions>
          <Button color='primary' type='button' onClick={handleSave} disabled={saving || loadingSchools}>
            {saving ? t('LOADING', 'Loading') : t('SAVE', 'Save')}
          </Button>
        </Actions>
      </Form>
    </Modal>
  )
}

StudentFormModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSaved: PropTypes.func,
  defaultSchoolId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  student: PropTypes.object
}
