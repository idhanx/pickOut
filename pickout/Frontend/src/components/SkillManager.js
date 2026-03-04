import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';
import { Plus, Trash2, BookOpen } from 'lucide-react';

function SkillManager() {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillsAPI.getAll();
            setSkills(response.data || []);
        } catch (error) {
            console.error('Error fetching skills:', error);
            alert('Failed to fetch skills');
        }
    };

    const handleCreateSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;

        setLoading(true);
        try {
            await skillsAPI.create({ name: newSkill });
            setNewSkill('');
            fetchSkills();
        } catch (error) {
            console.error('Error creating skill:', error);
            alert('Failed to create skill');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Delete this skill?')) return;

        try {
            await skillsAPI.delete(id);
            fetchSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Failed to delete skill');
        }
    };

    return (
        <div className="section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Skills Overview</h2>
                    <p className="section-subtitle">Manage the skills database for the university.</p>
                </div>
            </div>

            <div className="card form-card">
                <form onSubmit={handleCreateSkill} className="form-content">
                    <div className="input-group">
                        <label className="label">New Skill Name</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="e.g. React, Machine Learning, Python"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="input"
                            />
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                <Plus size={18} />
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-3">
                {skills.map((skill) => (
                    <div key={skill.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={18} color="#6366f1" />
                            <span style={{ fontWeight: 600 }}>{skill.name}</span>
                        </div>
                        <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="btn-icon"
                            title="Delete Skill"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <div className="empty-state">
                    <BookOpen size={48} style={{ marginBottom: '16px', color: '#cbd5e1' }} />
                    <h3>No skills found</h3>
                    <p>Add your first skill to get started.</p>
                </div>
            )}
        </div>
    );
}

export default SkillManager;
