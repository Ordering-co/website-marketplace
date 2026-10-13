import styled, { css } from 'styled-components'

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 20px 20px;
  min-height: 400px;
`

export const StepSubtitle = styled.p`
  margin: 8px 0 24px;
  font-size: 15px;
  color: ${props => props.theme.colors?.headingColor || '#1a1a2e'};
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
`

/* Stepper layout (inputs + dots) */
export const StepperContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`

export const StepperDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${props => props.active ? (props.theme.colors?.primary || '#4169E1') : '#ccc'};
  background: ${props => props.filled ? (props.theme.colors?.primary || '#4169E1') : 'transparent'};
  flex-shrink: 0;
`

export const StepperLine = styled.div`
  flex: 1;
  border-left: 2px dashed ${props => props.theme.colors?.primary || '#4169E1'};
  opacity: 0.4;
`

export const AddressInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  height: 56px;
  background: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:hover {
    border-color: #bbb;
  }

  &:focus-within {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }

  svg.location-icon {
    font-size: 20px;
    color: ${props => props.theme.colors?.primary || '#4169E1'};
    margin-right: 12px;
    flex-shrink: 0;
  }

  .address-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .floating-label {
    font-size: 11px;
    color: #999;
    line-height: 1.2;
    margin-bottom: 4px;
  }

  input {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 14px !important;
    width: 100% !important;
    background: transparent !important;
    height: auto !important;
    font-weight: 500 !important;
    color: #1a1a2e !important;
  }
`

export const MapWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
  background: #f0f0f0;
  position: relative;

  > div {
    width: 100% !important;
    height: 100% !important;
    border-radius: 12px;
  }
`

export const DistanceInfo = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors?.headingColor || '#1a1a2e'};
  margin-bottom: 4px;

  ${({ exceeded }) => exceeded && css`
    color: #e53935;
    font-weight: 600;
  `}
`

export const StepActions = styled.div`
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const BackButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: transparent;
  color: ${props => props.theme.colors?.headingColor || '#1a1a2e'};
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover:not(:disabled) {
    border-color: #bbb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ContinueButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background: ${props => props.disabled ? '#b0c4de' : (props.theme.colors?.primary || '#4169E1')};
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background 0.2s;
  position: relative;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  svg {
    position: absolute;
    right: 20px;
    font-size: 18px;
  }
`

export const TextAreaInput = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 72px;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }
`

export const NumberInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }
`

export const MinMaxRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #888;
`

export const PickupNameInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 4px;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }

  &::placeholder {
    color: #999;
    font-weight: 400;
  }
`

/* ─── Step 2: Item input ──────────────────────────────────────────── */

export const ItemList = styled.div`
  margin-bottom: 16px;
`

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 16px;
  height: 40px;
  margin-bottom: 10px;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }

  .item-name-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a2e;
    background: transparent;
    min-width: 0;

    &::placeholder {
      color: #999;
      font-weight: 400;
    }
  }

  .item-qty-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 12px;
    flex-shrink: 0;
  }

  .qty-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #999;

    &:hover {
      color: #555;
    }
  }

  .qty-value {
    font-size: 14px;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
  }
`

export const AddProductLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors?.primary || '#4169E1'};
  font-size: 14px;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 16px;

  &:hover {
    text-decoration: underline;
  }
`

/* ─── Payment selector ────────────────────────────────────────────── */

export const PaymentOptions = styled.div`
  display: flex;
  gap: 10px;
`

export const PaymentOption = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid ${props => props.selected ? (props.theme.colors?.primary || '#4169E1') : '#e0e0e0'};
  border-radius: 10px;
  background: ${props => props.selected ? (props.theme.colors?.primary ? `${props.theme.colors.primary}10` : '#4169E110') : '#fff'};
  color: ${props => props.selected ? (props.theme.colors?.primary || '#4169E1') : '#666'};
  font-size: 14px;
  font-weight: ${props => props.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors?.primary || '#4169E1'};
  }
`

/* ─── Delivery fee display ────────────────────────────────────────── */

export const DeliveryFeeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;

  .fee-label {
    color: #666;
  }

  .fee-value {
    font-weight: 600;
    color: ${props => props.theme.colors?.headingColor || '#1a1a2e'};
  }
`
