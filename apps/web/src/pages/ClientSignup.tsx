import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import Spinner from '../utils/Spinner';
import ErrorMessage from '../utils/ErrorMessage';

function ClientSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    neurotype: 'ADHD',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createClient = trpc.client.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Validate form whenever formData changes and we're in validation mode
  useEffect(() => {
    if (isValidating) {
      validateForm();
    }
  }, [formData, isValidating]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum <= 0) {
        newErrors.age = 'Age must be a positive number';
      } else if (ageNum > 120) {
        newErrors.age = 'Age cannot exceed 120';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);
    
    // Only proceed if validation passes
    if (validateForm()) {
      try {
        createClient.mutate({
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age, 10),
          neurotype: formData.neurotype as 'Autistic' | 'ADHD' | 'Both',
        });
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const handleRetry = () => {
    setError('');
  };

  return (
    <div className="card">
      <h1>Client Signup</h1>
      
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 relative">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold">Success!</p>
              <p className="text-sm">Account created successfully! Redirecting to home...</p>
            </div>
          </div>
        </div>
      ) : null}
      
      {error && <ErrorMessage message={error} onRetry={handleRetry} />}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
            disabled={createClient.isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "border-red-500" : ""}
            disabled={createClient.isLoading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age ? "border-red-500" : ""}
            disabled={createClient.isLoading}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="neurotype">Neurotype</label>
          <select
            id="neurotype"
            name="neurotype"
            value={formData.neurotype}
            onChange={handleChange}
            disabled={createClient.isLoading}
          >
            <option value="ADHD">ADHD</option>
            <option value="Autistic">Autistic</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={createClient.isLoading}
          className="relative w-full"
        >
          {createClient.isLoading ? (
            <>
              <span className="opacity-0">Submit</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner size="small" />
                <span className="ml-2">Creating account...</span>
              </span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}

export default ClientSignup; 