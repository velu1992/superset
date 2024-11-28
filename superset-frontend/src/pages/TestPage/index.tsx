import React from 'react';
import withToasts from 'src/components/MessageToasts/withToasts';
const TestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to the Custom Page</h1>
      <p>This is a sample message displayed on a custom page in Apache Superset.</p>
    </div>
  );
};


export default withToasts(TestPage);
