import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="card">
      <div className="text-center">
        <h1>Welcome to Prosper Health</h1>
        <p className="text-lg mb-6">
          Prosper Health is a telehealth platform dedicated to supporting individuals
          with neurodevelopmental conditions like ADHD and Autism.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="feature-card">
          <div className="icon-circle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <h3>For Clients</h3>
          <p>Sign up as a client to schedule appointments with our specialized clinicians who understand your unique needs.</p>
          <Link to="/signup">
            <button className="mt-4 w-full">Sign Up as Client</button>
          </Link>
        </div>
        
        <div className="feature-card">
          <div className="icon-circle">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3>For Clinicians</h3>
          <p>Access your dashboard to view your clients, manage appointments, and provide specialized care.</p>
          <Link to="/dashboard">
            <button className="mt-4 w-full secondary">Clinician Dashboard</button>
          </Link>
        </div>
      </div>
      
      <div className="mt-12 p-4 bg-indigo-50 rounded-lg">
        <h3 className="text-center mb-3">Our Approach</h3>
        <p className="text-sm text-center">
          At Prosper Health, we believe in personalized care that addresses your specific needs.
          Our clinicians are trained to provide support for ADHD, Autism, and other neurodevelopmental conditions.
        </p>
      </div>
    </div>
  );
}

export default Home; 