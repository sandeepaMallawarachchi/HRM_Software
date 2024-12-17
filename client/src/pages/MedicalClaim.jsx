import React, { useState } from 'react'
import AddMedicalClaim from './subPages/AddMedicalClaim';
import MyMedicalClaims from './subPages/MyMedicalClaims';

const MedicalClaim = () => {

    const [visibleSection, setVisibleSection] = useState('addclaim');

    const handleSectionToggle = (section) => {
        setVisibleSection(visibleSection === section ? null : section);
    };

    return (
        <div className="md:col-span-2 space-y-4 m-10">
            <div className="flex space-x-6 mt-4">
                <button
                    onClick={() => handleSectionToggle('addclaim')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'addclaim' ? 'bg-orange-500 text-white' : ''}`}
                >
                    Add Medical Claim Request
                </button>
                <button
                    onClick={() => handleSectionToggle('myclaims')}
                    className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'myclaims' ? 'bg-orange-500 text-white' : ''}`}
                >
                    My Medical Claims
                </button>
            </div>

            {visibleSection === 'addclaim' && <AddMedicalClaim />}
            {visibleSection === 'myclaims' && <MyMedicalClaims />}
        </div>
    )
}

export default MedicalClaim