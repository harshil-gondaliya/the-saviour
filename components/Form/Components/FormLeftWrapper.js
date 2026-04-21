import styled from 'styled-components';
import { FormState } from '../Form';
import { useContext } from 'react';

const FormLeftWrapper = () => {
  const Handler = useContext(FormState);

  return (
    <FormLeft>
      <FormInput>
        <label>Campaign Title</label>
        <Input
          type="text"
          name="campaignTitle"
          placeholder="Campaign Title"
          value={Handler.form.campaignTitle}
          onChange={Handler.FormHandler}
        />
      </FormInput>

      <FormInput>
        <label>Story</label>
        <TextArea
          name="story"
          placeholder="Describe Your Story"
          value={Handler.form.story}
          onChange={Handler.FormHandler}
        />
      </FormInput>
    </FormLeft>
  );
};

const FormLeft = styled.div`
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

const TextArea = styled.textarea`
  padding: 14px 16px;
  background-color: ${(props) => props.theme.bgSubDiv};
  color: ${(props) => props.theme.color};
  margin-top: 0;
  border: 2px solid ${(props) => props.theme.bgDiv};
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  width: 100%;
  min-height: 140px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
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
    min-height: 120px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 11px 12px;
    font-size: 16px;
    min-height: 100px;
  }
`;

export default FormLeftWrapper;
