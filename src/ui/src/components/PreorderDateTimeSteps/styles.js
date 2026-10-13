import styled, { css } from 'styled-components'
import { rgba } from 'polished'

export const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const AccordionStep = styled.div`
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.grayDividerColor || '#E9ECEF'};
  background: ${props => props.theme.colors.backgroundPage};

  ${({ isLocked }) => isLocked && css`
    opacity: 0.65;
    pointer-events: none;
  `}
`

export const AccordionHeader = styled.button`
  appearance: none;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: ${props => props.theme.colors.grayDividerColor || '#F8F9FA'};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => rgba(props.theme.colors.primary, 0.06)};
  }

  &:disabled {
    cursor: default;
  }

  ${({ isExpanded, theme }) => isExpanded && css`
    background: ${rgba(theme.colors.primary, 0.08)};
    border-bottom: 1px solid ${theme.colors.grayDividerColor || '#E9ECEF'};
  `}
`

export const StepBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;

  ${({ completed, active, theme }) => completed && css`
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
  `}

  ${({ completed, active, theme }) => !completed && active && css`
    background: ${rgba(theme.colors.primary, 0.12)};
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};
  `}

  ${({ completed, active, theme }) => !completed && !active && css`
    background: ${theme.colors.grayDividerColor || '#E9ECEF'};
    color: ${theme.colors.darkGray || '#6c757d'};
  `}
`

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const StepTitle = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: ${props => props.theme.colors.black};
`

export const StepSubtitle = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.darkGray || '#6c757d'};
  line-height: 1.35;
`

export const StepSelectedValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  line-height: 1.35;
`

export const HeaderChevron = styled.span`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.darkGray || '#6c757d'};
  transition: transform 0.25s ease;
  transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0)'};
  flex-shrink: 0;

  svg {
    font-size: 18px;
  }
`

export const AccordionBody = styled.div`
  /* When expanded, render the full content (no inner scroll, no max-height clip)
     so the surrounding modal Container is the SINGLE scroll region — avoids the
     double scrollbar, and the already-sticky Save stays reachable.
     Collapsed it clips to 0 for the open/close transition. */
  overflow: ${({ isExpanded }) => isExpanded ? 'visible' : 'hidden'};
  max-height: ${({ isExpanded }) => isExpanded ? 'none' : '0'};
  opacity: ${({ isExpanded }) => isExpanded ? 1 : 0};
  transition: opacity 0.25s ease;
`

export const AccordionBodyInner = styled.div`
  padding: 12px 14px 16px;
`

export const StepHint = styled.p`
  margin: 0;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.45;
  color: ${props => props.theme.colors.darkGray || '#6c757d'};
  background: ${props => props.theme.colors.grayDividerColor || '#F8F9FA'};
  border-radius: 12px;
  text-align: center;
`

export const TimeGrid = styled.div`
  /* Two columns per row. */
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`

export const TimeGridItem = styled.button`
  appearance: none;
  border: 1px solid ${props => props.theme.colors.grayDividerColor || '#E9ECEF'};
  background: ${props => props.theme.colors.backgroundPage};
  border-radius: 12px;
  padding: 12px 6px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
  font-family: inherit;
  color: ${props => props.theme.colors.black};
  min-height: 48px;

  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => rgba(props.theme.colors.primary, 0.08)};
  }

  ${({ active, theme }) => active && css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-weight: 600;

    &:hover:not(:disabled) {
      background: ${theme.colors.primary};
      border-color: ${theme.colors.primary};
    }
  `}

  ${({ disabled }) => disabled && css`
    pointer-events: none;
    opacity: 0.55;
    cursor: not-allowed;
  `}

  ${({ busy }) => busy && css`
    pointer-events: none;
    opacity: 0.4;
    text-decoration: line-through;
  `}
`

export const TimeGridLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  /* Keep the range ("9:00 AM – 9:30 AM") on one line within a 2-column cell. */
  font-size: 14px;
  white-space: nowrap;
  width: 100%;
`
