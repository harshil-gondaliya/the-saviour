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
  width: 48%;
  display: flex;
  flex-direction: column;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'poppins';
  margin-top: 15px;
`;

const Input = styled.input`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
  min-height: 160px;
  resize: vertical;
`;

export default FormLeftWrapper;
