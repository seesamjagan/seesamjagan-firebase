import React, { Component } from 'react';
import './App.css';

const achievements = [
  'Won “Best Performer Award” for the Q4 of 2015 & Q2 of 2017 in Msys Technologies Pvt Ltd – Chennai',
  'Won “Best Performer Award” for the month of Sep 2013 in Sybrant Technologies Pvt Ltd – Chennai.',
  'Won 1st Place in “Communication Game” in National Level meet held at Nesamony Memorial Christian College – Marthandam',
  'Won 1st Place in “Anistamix” in National Level meet held at Adaikalamatha College – vallam, Thanjavur',
  'Won 1st Place in “Web Designing” in National Level meet held at Sourashtra College – Madurai',
  'Won 2nd Place in “Animation Corner” in National Level meet held at Sourashtra College – Madurai',
  'on 3rd Place In Drawing at State Level in SSLC',
];

const educations = [
  {education: 'MCA', score: '81%', duration: '2004 - 2007', detail: 'Kumbakonam Govt. College'},
  {education: 'BSc', score: '68%', duration: '2001 - 2004', detail: 'St. Joseph’s College.'},
  {education: 'HSC', score: '64%', duration: '2000 - 2001', detail: 'Fatima Matric. Hr. Sec. School'},
  {education: 'SSLC', score: '58%', duration: '1998 - 1999', detail: 'Fatima Matric. Hr. Sec. School'}
];

const experience = [
  {designation: 'Tech Lead', org: 'MSys Technologies Ind P Ltd', duration: `Nov 2015 - Present`},
  {designation: 'Tech Lead', org: 'HCL Technologies', duration: 'Oct 2014 - Nov 2015'},
  {designation: 'Project Lead', org: 'Sybrant Technologies Ind P Ltd', duration: 'Jan 2014 - Sep 2014'},
  {designation: 'Scrum Master', org: 'Sybrant Technologies Ind P Ltd', duration: 'May 2012 - Dec 2013'},
  {designation: 'Sr. S/W Engineer', org: 'Object Frontie Software P Ltd', duration: 'Oct 2011 - Mar 2012 '},
  {designation: 'UI Engineer', org: 'American Megatrends Ind P Ltd', duration: 'Aug 2010 - Sep 2011'},
  {designation: 'Software Engineer', org: 'Buddies Infotech Ind P Ltd', duration: 'Aug 2007 - Jul 2010'}
];

const ProfilePicture = (props, context) => {
  return <span className="profile-picture"> <img src="./assets/images/profile-photo.jpg" alt="jagan profile logo" /></span>
}

const Achievements = ({ achievements, title='Achievements' }, context) => {
  return <div className="widget">
    <div className="title">{title}</div>
    <ul className="achievement">
    {
      achievements.map(achievement=><li>{achievement}</li>)
    }
    </ul>
    
  </div>
}

const Educations = ({ educations, title='Education' }, context) => {
  return <div className="widget">
    <div className="title">{title}</div>
    <ul className="education">
    {
      educations.map(education=><li><span>{education.education}</span><span>{education.score}</span><span>{education.detail}</span></li>)
    }
    </ul>
    
  </div>
}

const Experience = ({ experience, title='Experience' }, context) => {
  return <div className="widget">
    <div className="title">{title}</div>
    <ul className="experience">
    {
      experience.map(exp=><li><span>{exp.designation}</span><span>{exp.org}</span><span>{exp.duration}</span></li>)
    }
    </ul>
    
  </div>
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="message">
          <div style={{textAlign: 'center', }}>
            <ProfilePicture />
            <h1>Jagan Langa</h1>
            <h2>Certified ScrumMaster&trade;</h2>
            <p>Having 10+ years of experience in UI architecture & development in medium to large scale enterprise level web application which spans across multiple domains such as storage, networking, engineering, finance, multimedia,  LMS and LCMS.</p>
            <Achievements achievements={achievements} />
            <Experience experience={experience} />
            <Educations educations={educations} />
          </div>
          {/*<a target="_blank" rel="noopener noreferrer" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>*/}
      </div>
      </div>
    );
  }
}

export default App;
