import React, { useState, useEffect } from 'react';
import { studentsAPI, skillsAPI } from '../services/api';
import { UserPlus, Trash2, Mail, GraduationCap } from 'lucide-react';

function StudentManager() {
    const [students, setStudents] = useState([]);
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        email: '',
        phone: '',
        skills: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchSkills();
    }, []);

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
        const currentSkills = formData.skills.map(s => s.id);
        const newSkills = currentSkills.includes(skillId)
            ? formData.skills.filter(s => s.id !== skillId)
            : [...formData.skills, { id: skillId }];

        setFormData({ ...formData, skills: newSkills });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert('Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            await studentsAPI.create(formData);
            setFormData({
                name: '',
                department: '',
                email: '',
                phone: '',
                skills: []
            });
            fetchStudents();
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Failed to create student');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this student?')) return;

        try {
            await studentsAPI.delete(id);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    };

    return (
        <div className="section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Students Registry</h2>
                    <p className="section-subtitle">Manage student profiles and skill sets.</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                {/* Create Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600 }}>Add New Student</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name *"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address *"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="input"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input"
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Skills</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => handleSkillToggle(skill.id)}
                                        className={`badge ${formData.skills.some(s => s.id === skill.id) ? 'badge-primary' : 'badge-outline'}`}
                                        style={{ border: '1px solid', cursor: 'pointer' }}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                            <UserPlus size={18} />
                            {loading ? 'Creating...' : 'Create Profile'}
                        </button>
                    </form>
                </div>

                {/* Students List */}
                <div className="grid grid-cols-2">
                    {students.map((student) => (
                        <div key={student.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                                        <GraduationCap size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{student.name}</h3>
                                        <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>{student.department || 'General'}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="btn-icon"
                                    title="Delete Student"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9rem', color: '#64748b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={14} />
                                    <span>{student.email}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {student.skills && student.skills.length > 0 ? (
                                    student.skills.slice(0, 3).map(skill => (
                                        <span key={skill.id} className="badge badge-primary">
                                            {skill.name}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>No skills Added</span>
                                )}
                                {student.skills && student.skills.length > 3 && (
                                    <span className="badge badge-outline">+{student.skills.length - 3}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {students.length === 0 && (
                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                            <UserPlus size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
                            <h3>No students yet</h3>
                            <p>Register students to start tracking their skills.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentManager;
