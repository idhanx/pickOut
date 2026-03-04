import React, { useState, useEffect } from 'react';
import { requirementsAPI, studentsAPI, skillsAPI } from '../services/api';
import { Plus, XCircle, Search, Briefcase, User, Info, CheckCircle } from 'lucide-react';

function RequirementManager() {
    const [requirements, setRequirements] = useState([]);
    const [students, setStudents] = useState([]);
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        title: '',
        description: '',
        requiredSkills: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequirements();
        fetchStudents();
        fetchSkills();
    }, []);

    const fetchRequirements = async () => {
        try {
            const response = await requirementsAPI.getOpen();
            setRequirements(response.data || []);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const response = await skillsAPI.getAll();
            setSkills(response.data || []);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSkillToggle = (skillId) => {
        const currentSkills = formData.requiredSkills.map(s => s.id);
        const newSkills = currentSkills.includes(skillId)
            ? formData.requiredSkills.filter(s => s.id !== skillId)
            : [...formData.requiredSkills, { id: skillId }];

        setFormData({ ...formData, requiredSkills: newSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentId || !formData.title) {
            alert('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            await requirementsAPI.create(formData.studentId, {
                title: formData.title,
                description: formData.description,
                requiredSkills: formData.requiredSkills
            });
            setFormData({
                studentId: '',
                title: '',
                description: '',
                requiredSkills: []
            });
            fetchRequirements();
        } catch (error) {
            console.error('Error creating requirement:', error);
            alert('Failed to create requirement');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async (id) => {
        if (!window.confirm('Close this requirement?')) return;

        try {
            await requirementsAPI.close(id);
            fetchRequirements();
        } catch (error) {
            console.error('Error closing requirement:', error);
            alert('Failed to close requirement');
        }
    };

    const handleFindEligible = async (requirementId) => {
        try {
            const response = await requirementsAPI.getEligibleStudents(requirementId);
            const eligible = response.data || [];

            if (eligible.length === 0) {
                alert('No eligible students found for this requirement');
            } else {
                const names = eligible.map(s => s.name).join(', ');
                alert(`Eligible Students (${eligible.length}):\n${names}`);
            }
        } catch (error) {
            console.error('Error finding eligible students:', error);
            alert('Failed to find eligible students');
        }
    };

    return (
        <div className="section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Project Requirements</h2>
                    <p className="section-subtitle">Post new opportunities and manage open positions.</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '32px' }}>

                {/* Post Requirement Form */}
                <div className="card form-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Post New Requirement</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Posted By</label>
                            <select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleInputChange}
                                className="select"
                                required
                            >
                                <option value="">Select Student...</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Frontend Developer for Hackathon"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="input"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe the project and role..."
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea"
                                rows="3"
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Required Skills</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.id)}
                                        className={`badge ${formData.requiredSkills.some(s => s.id === skill.id) ? 'badge-primary' : 'badge-outline'}`}
                                        style={{ border: '1px solid', cursor: 'pointer' }}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                            <Plus size={18} />
                            {loading ? 'Posting...' : 'Post Requirement'}
                        </button>
                    </form>
                </div>

                {/* Requirements List */}
                <div className="grid grid-cols-2">
                    {requirements.map((req) => (
                        <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f0f9ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{req.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                                            <User size={12} />
                                            <span>{req.student?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="badge badge-success">{req.status}</span>
                            </div>

                            <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.5' }}>{req.description || 'No description provided.'}</p>

                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                                    {req.requiredSkills && req.requiredSkills.length > 0 ? (
                                        req.requiredSkills.map(skill => (
                                            <span key={skill.id} className="badge badge-outline" style={{ background: '#f8fafc' }}>
                                                {skill.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No skills specified</span>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                                    <button
                                        onClick={() => handleFindEligible(req.id)}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, justifyContent: 'center' }}
                                    >
                                        <Search size={16} />
                                        Find Students
                                    </button>
                                    <button
                                        onClick={() => handleClose(req.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '10px' }}
                                        title="Close Requirement"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {requirements.length === 0 && (
                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                            <Briefcase size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
                            <h3>No active requirements</h3>
                            <p>Create a new requirement to find students.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RequirementManager;
