import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import Spinner from '../utils/Spinner';
import ErrorMessage from '../utils/ErrorMessage';

// Debug mode flag - set to true to see debug information
const DEBUG_MODE = true;

function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clinicianId: '',
    date: '',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Debugging effect
  useEffect(() => {
    if (DEBUG_MODE) {
      console.log('Dashboard component mounted or updated');
      console.log('Current state:', { 
        selectedClientId, 
        showAppointmentForm, 
        formData,
        formErrors
      });
    }
    return () => {
      if (DEBUG_MODE) console.log('Dashboard component will unmount');
    };
  }, [selectedClientId, showAppointmentForm, formData, formErrors]);

  // Fetch clients with loading and error states
  const {
    data: clients,
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients
  } = trpc.client.list.useQuery();

  // Fetch clinicians with loading and error states
  const {
    data: clinicians,
    isLoading: isLoadingClinicians,
    error: cliniciansError,
    refetch: refetchClinicians
  } = trpc.clinician.list.useQuery();

  // Fetch appointments for selected client
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    error: appointmentsError,
    refetch: refetchAppointments
  } = trpc.appointment.listByClientId.useQuery(
    selectedClientId || '',
    { enabled: !!selectedClientId }
  );

  // Overall loading state
  const isLoading = isLoadingClients || isLoadingClinicians;
  
  // Handle errors
  if (clientsError || cliniciansError) {
    return (
      <div className="card">
        <h1>Clinician Dashboard</h1>
        {clientsError && (
          <ErrorMessage 
            message={`Error loading clients: ${clientsError.message}`} 
            onRetry={() => refetchClients()}
          />
        )}
        {cliniciansError && (
          <ErrorMessage 
            message={`Error loading clinicians: ${cliniciansError.message}`} 
            onRetry={() => refetchClinicians()}
          />
        )}
      </div>
    );
  }

  // Create appointment mutation
  const createAppointment = trpc.appointment.create.useMutation({
    onSuccess: (data) => {
      console.log('Appointment created successfully:', data);
      refetchAppointments();
      setShowAppointmentForm(false);
      setFormData({
        clientId: '',
        clinicianId: '',
        date: '',
      });
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
      alert(`Error creating appointment: ${error.message}`);
    },
  });

  // Delete appointment mutation
  const deleteAppointment = trpc.appointment.delete.useMutation({
    onSuccess: () => {
      refetchAppointments();
    },
  });

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    // Pre-fill the client ID in the form
    setFormData(prev => ({ ...prev, clientId }));
  };

  const validateAppointmentForm = () => {
    const errors: string[] = [];
    
    if (!formData.clientId) errors.push('Client is required');
    if (!formData.clinicianId) errors.push('Clinician is required');
    if (!formData.date) errors.push('Date and time are required');
    
    // Check if the date is in the future
    if (formData.date && new Date(formData.date) <= new Date()) {
      errors.push('Appointment date must be in the future');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting appointment form with data:', formData);
    
    // Clear previous errors
    setFormErrors([]);
    
    // Validate form
    if (!validateAppointmentForm()) {
      console.error('Form validation failed:', formErrors);
      return;
    }

    try {
      // Convert date string to proper ISO string format
      const rawDate = new Date(formData.date);
      const isoDate = rawDate.toISOString();
      
      console.log('Date conversion debug:', {
        originalDateString: formData.date,
        convertedDate: rawDate,
        isoString: isoDate
      });
      
      // Send the raw data as strings and let the backend handle conversion
      createAppointment.mutate({
        clientId: formData.clientId,
        clinicianId: formData.clinicianId,
        date: isoDate,
      });
    } catch (error) {
      console.error('Exception caught while creating appointment:', error);
      alert(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      deleteAppointment.mutate({ id: appointmentId });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="card">
      <h1>Clinician Dashboard</h1>
      
      {isLoading ? (
        <div className="my-8">
          <Spinner size="large" />
          <p className="text-center mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="client-list">
            <h2>Clients</h2>
            <ul>
              {clients?.map((client) => (
                <li
                  key={client.id}
                  className={`client-item ${selectedClientId === client.id ? 'selected' : ''}`}
                  onClick={() => handleClientSelect(client.id)}
                >
                  <strong>{client.name}</strong>
                  <p>{client.email}</p>
                  <span className="badge">{client.neurotype}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="appointment-view">
            <div className="flex justify-between items-center mb-4">
              <h2>Appointments</h2>
              {selectedClientId && (
                <button 
                  onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  {showAppointmentForm ? 'Cancel' : 'Schedule Appointment'}
                </button>
              )}
            </div>
            
            {showAppointmentForm && (
              <form onSubmit={handleCreateAppointment} className="card mb-4">
                {formErrors.length > 0 && (
                  <div className="mb-4">
                    <ErrorMessage
                      message={`Please fix the following errors (${formErrors.length})`}
                    />
                    <ul className="list-disc pl-5 mt-1 text-red-700 text-sm">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="clientId">Client</label>
                  <select
                    id="clientId"
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    required
                    disabled={createAppointment.isLoading}
                  >
                    <option value="">Select a client</option>
                    {clients?.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="clinicianId">Clinician</label>
                  <select
                    id="clinicianId"
                    name="clinicianId"
                    value={formData.clinicianId}
                    onChange={handleChange}
                    required
                    disabled={createAppointment.isLoading}
                  >
                    <option value="">Select a clinician</option>
                    {clinicians?.map((clinician) => (
                      <option key={clinician.id} value={clinician.id}>
                        {clinician.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date and Time</label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={createAppointment.isLoading}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={createAppointment.isLoading}
                  className="relative"
                >
                  {createAppointment.isLoading ? (
                    <>
                      <span className="opacity-0">Schedule</span>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Spinner size="small" />
                        <span className="ml-2">Scheduling...</span>
                      </span>
                    </>
                  ) : (
                    'Schedule Appointment'
                  )}
                </button>
                
                {DEBUG_MODE && (
                  <div className="mt-4 p-4 border border-orange-300 bg-orange-50 rounded text-xs">
                    <h4 className="font-bold mb-2">Debug Information</h4>
                    <div className="mb-2">
                      <strong>Form State:</strong> 
                      <pre className="bg-white p-1 mt-1 overflow-auto max-h-20">
                        {JSON.stringify(formData, null, 2)}
                      </pre>
                    </div>
                    <div className="mb-2">
                      <strong>Selected Client:</strong> {selectedClientId}
                    </div>
                    <div className="mb-2">
                      <strong>Create Appointment State:</strong>
                      <pre className="bg-white p-1 mt-1 overflow-auto max-h-20">
                        {JSON.stringify({
                          isLoading: createAppointment.isLoading,
                          isError: createAppointment.isError,
                          error: createAppointment.error ? createAppointment.error.message : null,
                          data: createAppointment.data
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </form>
            )}

            {selectedClientId ? (
              <>
                {appointmentsError && (
                  <ErrorMessage 
                    message={`Error loading appointments: ${appointmentsError.message}`} 
                    onRetry={() => refetchAppointments()}
                  />
                )}
                
                {isLoadingAppointments ? (
                  <div className="my-4">
                    <Spinner size="medium" />
                    <p className="text-center mt-2 text-gray-500">Loading appointments...</p>
                  </div>
                ) : appointments && appointments.length > 0 ? (
                  <ul className="appointment-list">
                    {appointments.map((appt) => (
                      <li key={appt.id} className="appointment-item">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="appointment-date">
                              {new Date(appt.date).toLocaleDateString()}
                            </div>
                            <div className="appointment-time">
                              {new Date(appt.date).toLocaleTimeString()}
                            </div>
                            <div className="appointment-clinician">
                              {clinicians?.find(c => c.id === appt.clinicianId)?.name}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAppointment(appt.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded flex items-center bg-red-50 hover:bg-red-100 border border-red-200"
                            title="Cancel appointment"
                            disabled={deleteAppointment.isLoading && deleteAppointment.variables?.id === appt.id}
                          >
                            {deleteAppointment.isLoading && deleteAppointment.variables?.id === appt.id ? (
                              <>
                                <Spinner size="small" />
                                <span className="ml-1 text-xs">Canceling...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <span className="ml-1 text-xs">Cancel</span>
                              </>
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments scheduled for this client.</p>
                )}
              </>
            ) : (
              <p className="select-prompt">Select a client to view their appointments</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 