// // Home.js
// import React from 'react';
// import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// import CustomerForm from '../components/DataIngestion/CustomerForm';
// import OrderForm from '../components/DataIngestion/OrderForm';
// import AudienceForm from '../components/DataIngestion/AudienceForm';
// import CampaignList from '../components/CampaignListing/CampaignList';
// import HomePage from '../pages/HomePage'; // Import the HomePage component
// import './Home.css';

// const Home = ({ onLogout }) => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await onLogout(); // Wait for logout operation to complete

//     navigate('/login', { replace: true }); // Navigate to login page immediately
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="nav-items">
//           <li>
//             <Link to="/home/customers">Create Customer</Link>
//           </li>
//           <li>
//             <Link to="/home/orders">Create Order</Link>
//           </li>
//           <li>
//             <Link to="/home/audience">Create Audience</Link>
//           </li>
//           <li>
//             <Link to="/home/campaigns">Campaign List</Link>
//           </li>
//           <li className="logout-button">
//             <button onClick={handleLogout}>Logout</button>
//           </li>
//         </ul>
//       </nav>

//       <div className="content">
//         <Routes>
//           <Route path="/customers" element={<CustomerForm />} />
//           <Route path="/orders" element={<OrderForm />} />
//           <Route path="/audience" element={<AudienceForm />} />
//           <Route path="/campaigns" element={<CampaignList />} />
//           <Route path="/" element={<HomePage />} /> {/* Add this route */}
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Home;



import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerForm from '../components/DataIngestion/CustomerForm';
import OrderForm from '../components/DataIngestion/OrderForm';
import AudienceForm from '../components/DataIngestion/AudienceForm';
import CampaignList from '../components/CampaignListing/CampaignList';
import HomePage from '../pages/HomePage'; // Import the HomePage component
import './Home.css';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  // Extract googleId from URL and store it in localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleId = urlParams.get('googleId'); // Get googleId from query params

    if (googleId) {
      localStorage.setItem('googleId', googleId); // Save googleId in local storage
      console.log('googleId stored in localStorage:', googleId);

      // Remove googleId from the URL
      window.history.replaceState({}, document.title, '/home');
    } else {
      const storedGoogleId = localStorage.getItem('googleId');
      if (!storedGoogleId) {
        console.error('googleId not found in URL or localStorage. Redirecting to login.');
        navigate('/login', { replace: true }); // Redirect to login if googleId is missing
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    await onLogout(); // Wait for logout operation to complete
    localStorage.removeItem('googleId'); // Clear googleId from localStorage
    navigate('/login', { replace: true }); // Navigate to login page immediately
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/home/customers">Create Customer</Link>
          </li>
          <li>
            <Link to="/home/orders">Create Order</Link>
          </li>
          <li>
            <Link to="/home/audience">Create Audience</Link>
          </li>
          <li>
            <Link to="/home/campaigns">Campaign List</Link>
          </li>
          <li className="logout-button">
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="content">
        <Routes>
          <Route path="/customers" element={<CustomerForm />} />
          <Route path="/orders" element={<OrderForm />} />
          <Route path="/audience" element={<AudienceForm />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/" element={<HomePage />} /> {/* Add this route */}
        </Routes>
      </div>
    </div>
  );
};

export default Home;