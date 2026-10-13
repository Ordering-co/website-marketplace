const hasValue = (value) => value !== null && value !== undefined && value !== ''

export const isSchoolCart = (cart) => {
  if (!cart || typeof cart !== 'object') return false
  return cart.vertical === 'school' || cart.business?.vertical === 'school'
}

export const doesSchoolCartNeedStudent = ({ isSchool, studentId }) => {
  if (!isSchool) return false
  return !hasValue(studentId)
}

export const doesAnySchoolCartNeedStudent = (carts, assignedByCart = {}) => {
  if (!Array.isArray(carts)) return false
  return carts.some((cart) => doesSchoolCartNeedStudent({
    isSchool: isSchoolCart(cart),
    studentId: cart?.student_id ?? cart?.student?.id ?? assignedByCart?.[cart?.uuid]
  }))
}

export const assignCartStudentIfChanged = async ({ cartUuid, nextStudentId, assignedStudentId, assignStudent }) => {
  const current = assignedStudentId ?? null
  if (!cartUuid) {
    return { assignedStudentId: current, didAssign: false, error: null }
  }
  const next = nextStudentId ?? null
  if (String(current ?? '') === String(next ?? '')) {
    return { assignedStudentId: current, didAssign: false, error: null }
  }
  try {
    const response = await assignStudent(String(cartUuid), next)
    if (response?.error) {
      const result = response.result
      return { assignedStudentId: current, didAssign: false, error: Array.isArray(result) ? result : [result ?? 'ERROR'] }
    }
    return { assignedStudentId: next, didAssign: true, error: null }
  } catch (err) {
    return { assignedStudentId: current, didAssign: false, error: [err?.message ?? 'ERROR'] }
  }
}
