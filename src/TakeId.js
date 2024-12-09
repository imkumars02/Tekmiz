import React, { useState } from 'react';
import './style.css';

const TakeId = () => {
  const [id, setId] = useState('');

  const submitBtn = (e) => {
    e.preventDefault();
    if (id) {
      window.location.href = `/Converter/${id}`;
    } else {
      alert('Please enter an ID');
    }
  };

  return (
    <div className='takeId'>
      <form name="takeIdForm">
        <h2>Take Id</h2>
        <div className='field'>
          <label htmlFor='id'>Enter Id :</label>
          <input
            type='number'
            placeholder='Enter Id'
            name='id'
            id='id'
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <button type='submit' onClick={submitBtn}>Submit</button>
      </form>
    </div>
  );
};

export default TakeId;
