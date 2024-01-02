
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CoverPage from './components/CoverPage';
import ProjectsSection from './components/Projects';
import Skills from './components/Skills';
import EducationSection from './components/Education';
import ExperienceSection from './components/ExperienceSection';
import CertificationSection from './components/CertificationSection';
import InvolvementSection from './components/InvolvementSection';
import SummarySection from './components/SummarySection';
import ProfilePhoto from './components/ProfilePhotoWithUpload';
import NavigationBar from './components/NavigationBar';
import SectionWrapper from './components/SectionWrapper';
import axios from 'axios';
import './index.css';
import './css/profile.css';

import React, { useEffect, useState } from 'react';

interface Education {
  _id: string;
  university: string;
  degree: string;
  major: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
}

interface Experience {
  _id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
}

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  duration: string;
  description: string;
 
}

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  
}

interface Project {
  _id: string;
  name: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  skills: string;
  description: string;
}


const Profile: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [involvements, setInvolvements] = useState<Involvement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch the current profile photo URL from the server on component mount
    axios.get('http://localhost:3001/api/profile-photo')
      .then((response) => {
        setImageUrl(response.data.imageUrl);
      })
      .catch((error) => {
        console.error('Error fetching profile photo:', error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);

    if (newFile) {
      const formData = new FormData();
      formData.append('photo', newFile);

      // Upload the new photo and update the profile photo URL
      axios.post('http://localhost:3001/upload', formData)
        .then((response) => {
          setImageUrl(response.data.imageUrl);
        })
        .catch((error) => {
          console.error('Error uploading photo:', error);
        });
    }
  };



  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then((data) => setEducations(data));
  }, []);

  const handleEditEdu = (id: string, data: {   university: string;
    degree: string;
    major: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };}) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = educations.map((education) =>
          education._id === id ? { ...education, ...data } : education
        );
        setEducations(updatedItems);
      });
  };

  const handleEditExp = (id: string, data: {  jobTitle: string;
    company: string;
    location: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    description: string; }) => {
    fetch(`http://localhost:3001/api/experiences/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.map((experience) =>
          experience._id === id ? { ...experience, ...data } : experience
        );
        setExperiences(updatedItems);
      });
  };

  const handleEditCert = (id: string, data: {  name: string;
    issuedBy: string;
    issuedDate: { month: string; year: string };
    expirationDate: { month: string; year: string };
    url: string; }) => {
    fetch(`http://localhost:3001/api/certifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.map((certification) =>
          certification._id === id ? { ...certification, ...data } : certification
        );
        setCertifications(updatedItems);
      });
  };

  const handleEditInv = (id: string, data: {    organization: string;
    role: string;
    duration: string;
    description: string; }) => {
    fetch(`http://localhost:3001/api/involvements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.map((involvement) =>
          involvement._id === id ? { ...involvement, ...data } : involvement
        );
        setInvolvements(updatedItems);
      });
  };

  const handleEditPro = (id: string, data: {      name: string;
    startDate: { month: string; year: string };
    endDate: { month: string; year: string };
    skills: string;
    description: string; }) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.map((project) =>
          project._id === id ? { ...project, ...data } : project
        );
        setProjects(updatedItems);
      });
  };
  
  // Update onDelete in App.tsx or where you render ItemList
  const handleDeleteEdu = (id: string) => {
    fetch(`http://localhost:3001/api/items/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = educations.filter((education) => education._id !== id);
        setEducations(updatedItems);
      });
  };
  
  const handleDeleteExp = (id: string) => {
    fetch(`http://localhost:3001/api/experiences/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = experiences.filter((experience) => experience._id !== id);
        setExperiences(updatedItems);
      });
  };
  

  const handleDeleteCert = (id: string) => {
    fetch(`http://localhost:3001/api/certifications/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedItems);
      });
  };

  const handleDeleteInv = (id: string) => {
    fetch(`http://localhost:3001/api/involvements/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedItems);
      });
  };

  const handleDeletePro = (id: string) => {
    fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const updatedItems = projects.filter((project) => project._id !== id);
        setProjects(updatedItems);
      });
  };
  
  

  return (
    <>
      
        {/* NavigationBar is used outside the Switch to ensure it's always rendered */}
        
        <NavigationBar />
      

      {/* Three Sections Layout */}
      <div className='Full-Profile' style={{ display: 'flex', position: 'relative', backgroundColor:'black'  }}   >
        {/* Left Section (20%) */}
        <div  style={{ flex: '0 0 20%'}}>
          {/* Add content for the left section */}
          {/* For example: */}
        </div>

        {/* Middle Section (60%) */}
        <div style={{ flex: '0 0 60%', backgroundColor: '#ffffff', position: 'relative' }}>
          {/* Content for the middle section goes here */}
          <CoverPage onUpload={(file: File): void => { } 
           } />
           <div>
          <ProfilePhoto imageUrl={imageUrl} onFileChange={handleFileChange} /></div>
          <SectionWrapper>
            <div style={{ marginTop: '150px' }} />
            <SummarySection />
            
            <ProjectsSection  onEdit={handleEditPro}
            onDelete={handleDeletePro} Projects={projects} />
            <Skills />
            <EducationSection Educations={educations} onEdit={handleEditEdu}
              onDelete= {handleDeleteEdu}  />
            <ExperienceSection Experiences={experiences} onEdit={handleEditExp}
              onDelete= {handleDeleteExp}/>
            <CertificationSection Certifications={certifications} onEdit={handleEditCert}
              onDelete= {handleDeleteCert}/>
            <InvolvementSection Involvements={involvements} onEdit={handleEditInv}
              onDelete= {handleDeleteInv} />
          </SectionWrapper>
        </div>

        {/* Right Section (20%) */}
        <div style={{ flex: '0 0 20%' ,position: 'relative'}}>
          {/* Add content for the right section */}
          {/* For example: */}
        </div>
      </div>
    </>
  );
};

export default Profile;