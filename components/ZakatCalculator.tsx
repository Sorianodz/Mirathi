'use client';

import React, { useState, useEffect } from 'react';
import { exportPDF, printReport } from '@/utils/pdfExport';
import { formatMoney } from '@/utils/format';

export default function ZakatCalculator() {
    const [goldPrice, setGoldPrice] = useState<number>(12000); // Default Algerian gold price roughly
    const [cashMoney, setCashMoney] = useState<number>(0);
    const [goldValue, setGoldValue] = useState<number>(0);
    const [tradeGoods, setTradeGoods] = useState<number>(0);
    const [receivables, setReceivables] = useState<number>(0);
    const [debts, setDebts] = useState<number>(0);

    const [nisab, setNisab] = useState<number>(0);
    const [totalZakatable, setTotalZakatable] = useState<number>(0);
    const [netAmount, setNetAmount] = useState<number>(0);
    const [zakatAmount, setZakatAmount] = useState<number>(0);
    const [isEligible, setIsEligible] = useState<boolean>(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        calculateZakat();
    }, [goldPrice, cashMoney, goldValue, tradeGoods, receivables, debts]);

    const calculateZakat = () => {
        const calculatedNisab = (goldPrice || 0) * 85;
        const total = (cashMoney || 0) + (goldValue || 0) + (tradeGoods || 0) + (receivables || 0);
        const net = Math.max(0, total - (debts || 0));

        setNisab(calculatedNisab);
        setTotalZakatable(total);
        setNetAmount(net);

        if (net >= calculatedNisab && calculatedNisab > 0) {
            setZakatAmount(net * 0.025);
            setIsEligible(true);
        } else {
            setZakatAmount(0);
            setIsEligible(false);
        }
    };

    const handleCalculateClick = () => {
        setShowResults(true);
    };

    return (
        <div className="glass-panel rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">حساب الزكاة</h2>
            
            <div className="mb-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
                <label className="block text-lg font-bold text-gray-700 mb-2">سعر جرام الذهب عيار 24 (بالدينار الجزائري)</label>
                <input 
                    type="number" 
                    className="input-field w-full text-xl p-3 rounded-xl text-center font-bold text-blue-700" 
                    placeholder="أدخل السعر الحالي" 
                    min="0" 
                    step="0.01"
                    value={goldPrice || ""}
                    onChange={e => setGoldPrice(parseFloat(e.target.value))}
                />
                <p className="text-sm text-gray-500 mt-2">* النصاب = 85 جرام ذهب خالص × السعر الحالي</p>
                <div className="mt-3 bg-white rounded-lg p-3 text-center border border-blue-100">
                    <span className="text-gray-600">النصاب الحالي: </span>
                    <span className="text-xl font-bold text-blue-800">{formatMoney(nisab)} د.ج</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <label className="block font-bold text-gray-700 mb-2">النقود والمدخرات</label>
                    <input type="number" value={cashMoney || ""} onChange={e => setCashMoney(parseFloat(e.target.value)||0)} className="input-field w-full p-3 rounded-lg text-lg" placeholder="0" min="0" step="0.01" />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <label className="block font-bold text-gray-700 mb-2">الذهب (القيمة السوقية)</label>
                    <input type="number" value={goldValue || ""} onChange={e => setGoldValue(parseFloat(e.target.value)||0)} className="input-field w-full p-3 rounded-lg text-lg" placeholder="0" min="0" step="0.01" />
                    <p className="text-xs text-gray-500 mt-1">مجوهرات الادخار فقط (لا تشمل الحلي المستعمل)</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <label className="block font-bold text-gray-700 mb-2">عروض التجارة (بضاعة)</label>
                    <input type="number" value={tradeGoods || ""} onChange={e => setTradeGoods(parseFloat(e.target.value)||0)} className="input-field w-full p-3 rounded-lg text-lg" placeholder="0" min="0" step="0.01" />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <label className="block font-bold text-gray-700 mb-2">الديون المرجوة القبض</label>
                    <input type="number" value={receivables || ""} onChange={e => setReceivables(parseFloat(e.target.value)||0)} className="input-field w-full p-3 rounded-lg text-lg" placeholder="0" min="0" step="0.01" />
                    <p className="text-xs text-gray-500 mt-1">الديون التي تتوقع استردادها</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 md:col-span-2 text-center flex flex-col items-center">
                    <label className="block font-bold text-gray-700 mb-2">الديون المستحقة عليك</label>
                    <input type="number" value={debts || ""} onChange={e => setDebts(parseFloat(e.target.value)||0)} className="input-field w-full md:w-1/2 p-3 rounded-lg text-lg text-center" placeholder="0" min="0" step="0.01" />
                    <p className="text-xs text-gray-500 mt-1">تُخصم من إجمالي المال</p>
                </div>
            </div>

            <button onClick={handleCalculateClick} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 no-print">
                حساب الزكاة
            </button>

            {showResults && (
                <div className="mt-8 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200" id="zakatReport">
                        <div className="bg-blue-600 text-white p-4">
                            <h3 className="text-xl font-bold text-center">نتيجة حساب الزكاة</h3>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm">إجمالي الأموال الزكوية</p>
                                    <p className="text-2xl font-bold text-gray-800">{formatMoney(totalZakatable)} د.ج</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <p className="text-gray-600 text-sm">النصاب المطلوب</p>
                                    <p className="text-2xl font-bold text-blue-700">{formatMoney(nisab)} د.ج</p>
                                </div>
                            </div>

                            {isEligible ? (
                                <div className="rounded-xl p-6 text-center mb-6 bg-emerald-100 border-2 border-emerald-500">
                                    <div className="text-4xl mb-2">✅</div>
                                    <h3 className="text-xl font-bold text-emerald-800">الزكاة واجبة</h3>
                                    <p className="text-emerald-700 mt-2">بلغ مالك النصاب وحال عليه الحول</p>
                                </div>
                            ) : (
                                nisab <= 0 ? (
                                    <div className="rounded-xl p-6 text-center mb-6 bg-amber-100 border-2 border-amber-500">
                                        <div className="text-4xl mb-2">⚠️</div>
                                        <h3 className="text-xl font-bold text-amber-800">أدخل سعر الذهب</h3>
                                        <p className="text-amber-700 mt-2">الرجاء إدخال سعر جرام الذهب لحساب النصاب</p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl p-6 text-center mb-6 bg-gray-100 border-2 border-gray-400">
                                        <div className="text-4xl mb-2">❌</div>
                                        <h3 className="text-xl font-bold text-gray-800">الزكاة غير واجبة</h3>
                                        <p className="text-gray-600 mt-2">لم يبلغ مالك النصاب المطلوب أو الديون استغرفت النصاب</p>
                                    </div>
                                )
                            )}

                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-3">تفاصيل الحساب:</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>النقود والمدخرات:</span>
                                        <span>{formatMoney(cashMoney)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>الذهب:</span>
                                        <span>{formatMoney(goldValue)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>عروض التجارة:</span>
                                        <span>{formatMoney(tradeGoods)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>الديون المرجوة:</span>
                                        <span>{formatMoney(receivables)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between border-t border-blue-200 pt-2 text-red-600">
                                        <span>الديون المستحقة (تُخصم):</span>
                                        <span>{formatMoney(debts)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between border-t-2 border-blue-300 pt-2 font-bold text-lg">
                                        <span>الصافي:</span>
                                        <span>{formatMoney(netAmount)} د.ج</span>
                                    </div>
                                    <div className="flex justify-between text-blue-800 font-bold text-xl mt-2 bg-white p-3 rounded-lg">
                                        <span>مبلغ الزكاة الواجب (2.5%):</span>
                                        <span>{formatMoney(zakatAmount)} د.ج</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center text-sm text-gray-500">
                                * يُشترط مرور عام هجري كامل (الحول) على بلوغ النصاب
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6 no-print">
                        <button onClick={() => printReport('zakatReport')} className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-all cursor-pointer">
                            🖨️ طباعة التقرير
                        </button>
                        <button onClick={() => exportPDF('zakatReport', 'تقرير_الزكاة')} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all cursor-pointer">
                            📄 تصدير PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
