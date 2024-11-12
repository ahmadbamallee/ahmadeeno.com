import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "skill"]{skillName, progressPercent}')
      .then((data) => {
        setSkills(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="skills">
      <h1>Skills</h1>
      <div className="skills-list">
        {skills.map((skill) => (
          <div key={skill.skillName} className="skill-item">
            <div className="skill-info">
              <span className="skill-name">{skill.skillName}</span>
              <span className="progress-percentage">{skill.progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${skill.progressPercent}%` }} // skill.progressPercent is your percentage
              ></div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
