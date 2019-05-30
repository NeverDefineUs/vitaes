import React from 'react';
import TypeForm from 'Typeform';
import TextInput from 'Typeform/TextInput';

function BuilderV2() {
  return (
    <div className="d-flex flex-row h-100 align-items-center">
      <div className="d-flex flex-column justify-content-left">
        <div style={{ height: '300px', border: '2px solid black', width: '250px' }} />
        <div style={{ height: '100px', border: '2px solid black', width: '250px' }} />
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <TypeForm>
          <TextInput />
        </TypeForm>
        <TypeForm />
        <TypeForm />
      </div>
    </div>
  );
}

export default BuilderV2;
