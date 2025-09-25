// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import MultiStepFormManager from '../components/forms/MultiStepFormManager';
// import '../styles/GlobalStyles.css';

// const AddRisk = () => {
//   const history = useHistory();

//   const handleSubmit = (formData) => {
//     console.log('Risk Assessment Data:', formData);
//     // Here you would typically save the data to your backend or state management
//     // For now, we'll just redirect to the saved risks page
//     alert('Risk Assessment submitted successfully!');
//     history.push('/risk-assessment');
//   };

//   const handleCancel = () => {
//     history.push('/risk-assessment');
//   };

//   return (
//     <div className="page-container">
//       <div className="page-header">
//         <h1>Add New Risk Assessment</h1>
//       </div>
      
//       <MultiStepFormManager 
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//       />
//     </div>
//   );
// };

// export default AddRisk;


import React from 'react';
import { useLocation } from 'react-router-dom';
import MultiStepFormManager from '../components/forms/MultiStepFormManager';

const AddRisk = () => {
  const location = useLocation();
  const focusArea = location.state?.focusArea || 'risk';

  const handleSubmit = (formData) => {
    console.log('Risk Assessment Data:', formData);
  };

  return (
    <div>
      <MultiStepFormManager onSubmit={handleSubmit} focusArea={focusArea} />
    </div>
  );
};

export default AddRisk;

