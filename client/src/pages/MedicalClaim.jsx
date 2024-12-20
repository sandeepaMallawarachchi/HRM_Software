import React, { useState } from 'react'
import AddMedicalClaim from './subPages/AddMedicalClaim';
import MyMedicalClaims from './subPages/MyMedicalClaims';
import AcceptMedicalClaims from './subPages/AcceptMedicalClaims';
import ManageClaims from './subPages/ManageClaims';

const MedicalClaim = () => {

    const [visibleSection, setVisibleSection] = useState('addclaim');
    const role = localStorage.getItem('role');

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
                {role === 'Mid Lvl Manager' &&
                    <div className='flex space-x-4'>
                        <button
                            onClick={() => handleSectionToggle('acceptreject')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'acceptreject' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            All Medical Claims
                        </button>

                        <button
                            onClick={() => handleSectionToggle('manageclaims')}
                            className={`py-2 px-4 border border-orange-500 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition-all ${visibleSection === 'manageclaims' ? 'bg-orange-500 text-white' : ''}`}
                        >
                            Manage Medical Claims
                        </button>
                    </div>
                }
            </div>

            {visibleSection === 'addclaim' && <AddMedicalClaim />}
            {visibleSection === 'myclaims' && <MyMedicalClaims />}
            {visibleSection === 'acceptreject' && <AcceptMedicalClaims />}
            {visibleSection === 'manageclaims' && <ManageClaims />}
        </div>
    )
}

export default MedicalClaim