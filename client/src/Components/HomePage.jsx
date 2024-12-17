import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import LandingPage from './LandingPage';
import LoginModal from './LoginModal';

const HomePage = ({ handleLogout, handleLogin }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigateToMap = () => navigate('/map');
    const navigateToDiagram = () => navigate('/diagram');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle login logic here
            await handleLogin(username, password);
            setShowLoginModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLoginClose = () => setShowLoginModal(false);

    return (
        <div className={location.pathname === '/' ? 'background-image' : ''}>
            <LandingPage 
                navigateToMap={navigateToMap}
                navigateToDiagram={navigateToDiagram}
                handleLogout={handleLogout}
                onLoginClick={() => setShowLoginModal(true)}
            />
            <LoginModal
                show={showLoginModal}
                handleClose={handleLoginClose}
                handleSubmit={handleLoginSubmit}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                error={error}
            />
        </div>
    );
};

HomePage.propTypes = {
    handleLogout: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired,
};

export default HomePage;
