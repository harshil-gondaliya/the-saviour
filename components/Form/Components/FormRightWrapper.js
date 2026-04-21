import styled from 'styled-components';
import { FormState } from '../Form';

import { useContext } from 'react';

const FormRightWrapper = () => {
  const Handler = useContext(FormState);

  return (
    <FormRight>

      <FormInput>
        <label>Required Amount</label>
        <Input 
          onChange={Handler.FormHandler} 
          value={Handler.form.requiredAmount} 
          name="requiredAmount" 
          type="number" 
          placeholder='Required Amount' 
        />
      </FormInput>

      <FormInput>
        <label>Choose Category</label>
        <Select 
          onChange={Handler.FormHandler} 
          value={Handler.form.category} 
          name="category"
        >
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          <option value="Animal">Animal</option>
        </Select>
      </FormInput>

      {/* Start Campaign Button */}
      <Button 
        type="button"
        onClick={Handler.startCampaign}
      >
        Start Campaign
      </Button>
    </FormRight>
  );
};

const FormRight = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'poppins';
  margin-bottom: 25px;
  
  label {
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 0.95rem;
    color: ${(props) => props.theme.color};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    
    label {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 18px;
    
    label {
      font-size: 0.85rem;
    }
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  background-color: ${(props) => props.theme.bgSubDiv};
  color: ${(props) => props.theme.color};
  margin-top: 0;
  border: 2px solid ${(props) => props.theme.bgDiv};
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  font-family: inherit;
  box-sizing: border-box;
  
  &:focus {
    border-color: #00b712;
    box-shadow: 0 0 0 3px rgba(0, 183, 18, 0.1);
    background-color: ${(props) => props.theme.bgSubDiv};
  }
  
  &:hover {
    border-color: rgba(0, 183, 18, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 16px;
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  background-color: ${(props) => props.theme.bgSubDiv};
  color: ${(props) => props.theme.color};
  margin-top: 0;
  border: 2px solid ${(props) => props.theme.bgDiv};
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;
  
  &:focus {
    border-color: #00b712;
    box-shadow: 0 0 0 3px rgba(0, 183, 18, 0.1);
    background-color: ${(props) => props.theme.bgSubDiv};
  }
  
  &:hover {
    border-color: rgba(0, 183, 18, 0.5);
  }
  
  option {
    background-color: ${(props) => props.theme.bgDiv};
    color: ${(props) => props.theme.color};
  }
  
  @media (max-width: 768px) {
    padding: 12px 40px 12px 14px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 40px 11px 12px;
    font-size: 16px;
  }
`;

const Image = styled.input`
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline: none;
    border: none;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 32px;
  color: white;
  background: linear-gradient(135deg, #00b712 0%, #5aff15 100%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: 700;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  font-size: 1rem;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(0, 183, 18, 0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 183, 18, 0.4);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    padding: 14px 28px;
    font-size: 0.95rem;
    margin-top: 25px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 24px;
    font-size: 0.9rem;
    margin-top: 20px;
    border-radius: 8px;
  }
`;

export default FormRightWrapper;
