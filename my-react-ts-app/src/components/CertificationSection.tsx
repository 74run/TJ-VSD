import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';


interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  isEditing?: boolean;
}

interface CertificationProps {
  Certifications: Certification[];
  onEdit: (id: string, data: { name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string }) => void;
  onDelete: (id: string) => void;
}

const CertificationSection: React.FC<CertificationProps> = ({ Certifications, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string } | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newCertification, setNewCertification] = useState<Certification>({
    _id: '',
    name: '',
    issuedBy: '',
    issuedDate: { month: '', year: '' },
    expirationDate: { month: '', year: '' },
    url: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  const handleEditClick = (
    id: string,
    name: string,
    issuedBy: string,
    issuedDate: { month: string; year: string },
    expirationDate: { month: string; year: string },
    url: string
  ) => {
    setEditData({ id, name, issuedBy, issuedDate, expirationDate, url });
  };
  

  

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, { name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate, url: editData.url });
      
      const updatedItems = certifications.map((certification) =>
        certification._id === editData.id
          ? { ...certification, name: editData.name, issuedBy: editData.issuedBy, issuedDate: editData.issuedDate, expirationDate: editData.expirationDate, url: editData.url }
          : certification
      );

      setCertifications(updatedItems);
      
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedCertification = {
      ...newCertification,
      issuedDate: {
        month: newCertification.issuedDate.month,
        year: newCertification.issuedDate.year,
      },
      expirationDate: {
        month: newCertification.expirationDate.month,
        year: newCertification.expirationDate.year,
      },
    };
    axios.post(`http://localhost:3001/api/userprofile/${userID}/certification`, formattedCertification)
    .then((response) => {
      const newCertificationFromServer = response.data.certification;
      const newCertData = newCertificationFromServer[newCertificationFromServer.length-1]
        setCertifications([...certifications, newCertData]);
  
        // Reset the newCertification state
        setNewCertification({
          _id: '',
          name: '',
          issuedBy: '',
          issuedDate: { month: '', year: '' },
          expirationDate: { month: '', year: '' },
          url: '',
        });
  
        // Set isAdding to false
        setIsAdding(false);
      })
      .catch((error) => {
        // Handle errors by logging them to the console
        console.error('Error saving certification:', error.message);
      });
  };
  

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3001/api/userprofile/${userID}/certification/${id}`)
      .then((response) => {
        // Update the state to remove the deleted certification
        const updatedCertifications = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedCertifications);

        // Reset the editData state
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting certification:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewCertification({
      _id: '',
      name: '',
      issuedBy: '',
      issuedDate: { month: '', year: '' },
      expirationDate: { month: '', year: '' },
      url: '',
    });
    setIsAdding(true);
  };

  // useEffect(() => {
  //   fetch('http://localhost:3001/api/certifications')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCertifications(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching certifications:', error);
  //     });
  // }, []);

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2>Certifications</h2>
      {certifications.map((certification) => (
        <div key={certification._id} className="mb-3">
          {editData && editData.id === certification._id ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })}
              />
              <div className="date-dropdowns">
                <label>Issued Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.issuedDate.month}
                    onChange={(e) => setEditData({ ...editData, issuedDate: { ...editData.issuedDate, month: e.target.value } })}
                  >
                    {!editData.issuedDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.issuedDate.year}
                    onChange={(e) => setEditData({ ...editData, issuedDate: { ...editData.issuedDate, year: e.target.value } })}
                  >
                    {!editData.issuedDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="date-dropdowns">
                <label>Expiration Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={editData.expirationDate.month}
                    
                    onChange={(e) => setEditData({ ...editData, expirationDate: { ...editData.expirationDate, month: e.target.value } })}
                  >
                    {!editData.expirationDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={editData.expirationDate.year}
                    onChange={(e) => setEditData({ ...editData, expirationDate: { ...editData.expirationDate, year: e.target.value } })}
                  >
                    {!editData.expirationDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certificate URL"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              />
              <button
                className="btn btn-primary me-2"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h3>{certification.name}</h3>
              <p>Issued By: {certification.issuedBy}</p>
              <p>Issued Date: {certification.issuedDate.month} {certification.issuedDate.year}</p>
              <p>Expiration Date: {certification.expirationDate.month} {certification.expirationDate.year}</p>
              
              <p>Certificate URL: {certification.url}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(certification._id, certification.name, certification.issuedBy, certification.issuedDate, certification.expirationDate, certification.url)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(certification._id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add certification entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Certification Name"
            value={newCertification.name}
            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Issued By"
            value={newCertification.issuedBy}
            onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
          />
          <div className="date-dropdowns">
                <label>Issued Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={newCertification.issuedDate.month}
                    onChange={(e) => setNewCertification({ ...newCertification, issuedDate: { ...newCertification.issuedDate, month: e.target.value } })}
                  >
                    {!newCertification.issuedDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={newCertification.issuedDate.year}
                    onChange={(e) => setNewCertification({ ...newCertification, issuedDate: { ...newCertification.issuedDate, year: e.target.value } })}
                  >
                    {!newCertification.issuedDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="date-dropdowns">
                <label>Expiration Date:</label>
                <div className="flex-container">
                  <select
                    className="form-control mb-2"
                    value={newCertification.expirationDate.month}
                    onChange={(e) => setNewCertification({ ...newCertification, expirationDate: { ...newCertification.expirationDate, month: e.target.value } })}
                  >
                    {!newCertification.expirationDate.month && (
                      <option value="" disabled>
                        Select Month
                      </option>
                    )}
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-control mb-2"
                    value={newCertification.expirationDate.year}
                    onChange={(e) => setNewCertification({ ...newCertification, expirationDate: { ...newCertification.expirationDate, year: e.target.value } })}
                  >
                    {!newCertification.expirationDate.year && (
                      <option value="" disabled>
                        Select Year
                      </option>
                    )}
                    {graduationYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
          <input
                type="text"
                className="form-control mb-2"
                placeholder="Certificate URL"
                value={newCertification.url}
                onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
              />
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        // Show "Add Certification" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Certification
        </button>
      )}
    </div>
  );
}

export default CertificationSection;
