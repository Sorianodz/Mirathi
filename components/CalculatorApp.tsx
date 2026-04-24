'use client';

import React, { useState, useEffect } from 'react';
import InheritanceCalculator from './InheritanceCalculator';
import ZakatCalculator from './ZakatCalculator';

export default function CalculatorApp() {
    const [activeTab, setActiveTab] = useState<'inheritance' | 'zakat'>('inheritance');
    
    // Quick PWA tip, standard installability check
    useEffect(() => {
        // any client side setup
    }, []);

    return (
        <div className="p-4 md:p-8 animate-fade-in relative z-10 w-full min-h-screen">
            <header className="max-w-6xl mx-auto mb-8 text-center">
                <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">حاسبة المواريث والزكاة</h1>
                    <p className="text-gray-600 text-lg">وفق قانون الأسرة الجزائري - المذهب المالكي</p>
                    <div className="mt-4 privacy-badge rounded-lg p-3 inline-block text-sm text-gray-700">
                        <span className="font-bold">🔒 خصوصية تامة:</span> جميع البيانات تُحسب محلياً في متصفحك فقط. لا يتم إرسال أي معلومة إلى أي سيرفر.
                    </div>
                </div>
            </header>

            <nav className="max-w-6xl mx-auto mb-6 no-print">
                <div className="glass-panel rounded-xl p-2 flex flex-wrap justify-center gap-2 shadow-lg">
                    <button 
                        onClick={() => setActiveTab('inheritance')} 
                        className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-2 ${activeTab === 'inheritance' ? 'tab-active' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span>⚖️</span> قسم المواريث
                    </button>
                    <button 
                        onClick={() => setActiveTab('zakat')} 
                        className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-2 ${activeTab === 'zakat' ? 'tab-active' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span>🤲</span> قسم الزكاة
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto">
                <div style={{ display: activeTab === 'inheritance' ? 'block' : 'none' }}>
                    <InheritanceCalculator />
                </div>
                <div style={{ display: activeTab === 'zakat' ? 'block' : 'none' }}>
                    <ZakatCalculator />
                </div>
            </main>

            <footer className="max-w-6xl mx-auto mt-12 mb-8 text-center text-gray-500 text-sm no-print">
                <div className="glass-panel rounded-xl p-4">
                    <p>هذا التطبيق يعمل بالكامل على جهازك. لا يتم حفظ أو إرسال أي بيانات.</p>
                    <p className="mt-1">التطبيق للاستخدام التقريبي. يُفضل مراجعة عالم شرعي للتحقق من الحالات الخاصة.</p>
                </div>
            </footer>
        </div>
    );
}
