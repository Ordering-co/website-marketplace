const ENABLED_VALUES = [true, 1, '1', 'true']

export const COURIER_TRACKING_PROJECTS = ['quickiedelivery']

export const isTrackingOnlyEnabled = (value) => ENABLED_VALUES.includes(value)

export const resolveTrackingOnly = (theme) => isTrackingOnlyEnabled(theme?.tracking_settings?.tracking_only)

export const isCourierTrackingProject = (project) => !!project && COURIER_TRACKING_PROJECTS.some(key => project.includes(key))
