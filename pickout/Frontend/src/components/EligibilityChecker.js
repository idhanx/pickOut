import React, { useState, useEffect } from 'react';
import { requirementsAPI, studentsAPI } from '../services/api';
import { CheckCircle, XCircle, Search, FileCheck, ArrowRight } from 'lucide-react';

function EligibilityChecker() {
    const [students, setStudents] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedRequirement, setSelectedRequirement] = useState('');
    const [result, setResult] = useState(null);
    const [eligibleRequirements, setEligibleRequirements] = useState([]);

    useEffect(() => {
        fetchStudents();
        fetchRequirements();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await studentsAPI.getAll();
            setStudents(response.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchRequirements = async () => {
        try {
            const response = await requirementsAPI.getOpen();
            setRequirements(response.data || []);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        }
    };

    const handleCheckEligibility = async () => {
        if (!selectedStudent || !selectedRequirement) {
            alert('Please select both student and requirement');
            return;
        }

        try {
            const response = await requirementsAPI.checkEligibility(
                selectedStudent,
                selectedRequirement
            );
            setResult(response.data);
        } catch (error) {
            console.error('Error checking eligibility:', error);
            alert('Failed to check eligibility');
        }
    };

    const handleFindEligibleRequirements = async () => {
        if (!selectedStudent) {
            alert('Please select a student');
            return;
        }

        try {
            const response = await requirementsAPI.getEligibleRequirements(selectedStudent);
            setEligibleRequirements(response.data || []);
        } catch (error) {
            console.error('Error finding eligible requirements:', error);
            alert('Failed to find eligible requirements');
        }
    };

    return (
        <div className="section">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Eligibility & Matching</h2>
                    <p className="section-subtitle">Verify student qualifications and find matching opportunities.</p>
                </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '40px' }}>

                {/* Specific Check */}
                <div className="card">
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', padding: '10px', background: '#e0e7ff', borderRadius: '8px', color: '#6366f1', marginBottom: '16px' }}>
                            <FileCheck size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Check Specific Match</h3>
                        <p style={{ color: '#64748b' }}>Verify if a specific student meets the requirements for a role.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="input-group">
                            <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Select Student</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="select"
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
                            <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Select Requirement</label>
                            <select
                                value={selectedRequirement}
                                onChange={(e) => setSelectedRequirement(e.target.value)}
                                className="select"
                            >
                                <option value="">Select Requirement...</option>
                                {requirements.map(req => (
                                    <option key={req.id} value={req.id}>
                                        {req.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button onClick={handleCheckEligibility} className="btn btn-primary" style={{ marginTop: '8px' }}>
                            Check Eligibility
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {result && (
                        <div style={{
                            marginTop: '24px',
                            padding: '20px',
                            borderRadius: '8px',
                            background: result.eligible ? '#d1fae5' : '#fee2e2',
                            border: `1px solid ${result.eligible ? '#10b981' : '#ef4444'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            {result.eligible ? <CheckCircle size={32} color="#059669" /> : <XCircle size={32} color="#dc2626" />}
                            <div>
                                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: result.eligible ? '#065f46' : '#991b1b' }}>
                                    {result.eligible ? 'Eligible' : 'Not Eligible'}
                                </h4>
                                <p style={{ color: result.eligible ? '#047857' : '#b91c1c' }}>{result.message}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Discovery */}
                <div className="card">
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', padding: '10px', background: '#d1fae5', borderRadius: '8px', color: '#10b981', marginBottom: '16px' }}>
                            <Search size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Discover Opportunities</h3>
                        <p style={{ color: '#64748b' }}>Find all requirements that a student is currently eligible for.</p>
                    </div>

                    <div className="input-group">
                        <label className="label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Select Student</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="select"
                        >
                            <option value="">Select Student...</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button onClick={handleFindEligibleRequirements} className="btn btn-secondary" style={{ marginTop: '8px', width: '100%' }}>
                        Find Matched Opportunities
                    </button>

                    <div style={{ marginTop: '32px' }}>
                        {eligibleRequirements.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h4 style={{ fontWeight: 600 }}>Matched Requirements</h4>
                                    <span className="badge badge-success">{eligibleRequirements.length} Found</span>
                                </div>
                                {eligibleRequirements.map(req => (
                                    <div key={req.id} style={{
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc',
                                        transition: 'all 0.2s',
                                        cursor: 'default'
                                    }}>
                                        <div style={{ fontWeight: 600, color: '#334155', marginBottom: '4px' }}>{req.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{req.description?.substring(0, 60)}...</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {eligibleRequirements.length === 0 && selectedStudent && (
                            <div className="empty-state" style={{ padding: '30px' }}>
                                <Search size={24} style={{ marginBottom: '8px', color: '#cbd5e1' }} />
                                <p>No matching requirements found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EligibilityChecker;
