import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopNav from './components/TopNav.jsx';
import Screen1Setup from './screens/Screen1Setup.jsx';
import Screen2Simulation from './screens/Screen2Simulation.jsx';
import Screen3SweetSpot from './screens/Screen3SweetSpot.jsx';
import Screen4Calibration from './screens/Screen4Calibration.jsx';

const SCREENS = [
    { id: 1, label: 'Setup', component: Screen1Setup },
    { id: 2, label: 'Simulation', component: Screen2Simulation },
    { id: 3, label: 'Sweet Spot', component: Screen3SweetSpot },
    { id: 4, label: 'Calibration', component: Screen4Calibration },
];

export default function App() {
    const [activeScreen, setActiveScreen] = useState(1);
    const Active = SCREENS.find((s) => s.id === activeScreen)?.component ?? Screen1Setup;

    return (
        <div className="flex min-h-screen bg-base">
            <Sidebar screens={SCREENS} active={activeScreen} onSelect={setActiveScreen} />
            <div className="flex-1 flex flex-col min-w-0">
                <TopNav screens={SCREENS} active={activeScreen} onSelect={setActiveScreen} />
                <main className="flex-1 p-6 lg:p-8">
                    <Active goTo={setActiveScreen} />
                </main>
            </div>
        </div>
    );
}
