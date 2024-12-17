import { React, useContext } from 'react';
import { Navbar, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundImage from '../Images/kirunaChurch.jpg';
import { AppContext } from "../context/AppContext.jsx";

const LandingPage = ({ handleLogout, navigateToMap, navigateToDiagram, onLoginClick }) => {

    const { isLoggedIn } = useContext(AppContext);

    return (
        <div style={{ 
            backgroundImage: `url(${backgroundImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            height: '100vh', 
            width: '100%', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
        }}>
            <header
                className={`d-flex justify-content-between align-items-center p-3 w-100 position-relative`}
                style={{ color: 'white' }} >
                <div className="d-flex align-items-center">
                    <h1 className="m-0" style={{ fontFamily: "fantasy" }}>Kiruna eXplorer</h1>
                </div>
                <div>
                    {isLoggedIn ? (
                        <button
                            className={`btn btn-light`}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        location.pathname !== "/login" && (
                            <Link
                                to="/login"
                                className={`btn btn-light`}
                            >
                                Login
                            </Link>
                        )
                    )}
                </div>
            </header>
                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}>
                    <Card style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '2rem',
                        borderRadius: '0.5rem',
                        color: 'white',
                    }}>
                        <Card.Body >
                            <h1>Welcome to Kiruna Explorer</h1>
                            <p>Discover the project of Kiruna, Sweden.</p>
                            <div className='d-grid gap-2'>
                                <Button variant="secondary" size="lg" onClick={navigateToMap}>Go to Map</Button>
                                <Button variant="secondary" size="lg" onClick={navigateToDiagram}>Go to Diagram</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </main>
        </div>
    );
};

export default LandingPage;
