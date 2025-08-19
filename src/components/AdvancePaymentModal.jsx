import React, { useState, useEffect } from "react";
import { salarySummaryAPI } from "../services/api";

const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
];

const AdvancedPaymentModal = ({ open, onClose, worker, onSubmit }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(months[new Date().getMonth()]);
    const [amount, setAmount] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [highestMonth, setHighestMonth] = useState(null);

    useEffect(() => {
        async function fetchHighestSalaryMonth(employeeCode) {
            try {
                const data = await salarySummaryAPI.getSalarySummariesByEmployee(employeeCode);
                if (data.length === 0) {
                    setHighestMonth(null);
                } else {
                    // Find the highest month (max "YYYY-MM")
                    const maxMonth = data
                        .map(s => s.month)
                        .sort()
                        .reverse()[0];
                    setHighestMonth(maxMonth);
                }
            } catch {
                setHighestMonth(null);
            }
        }
        if (open && worker?.code) {
            fetchHighestSalaryMonth(worker.code);
        }
    }, [open, worker]);

    // Only allow months greater than the highest existing month
    let availableMonths = [];
    if (!highestMonth) {
        // If no salary summary exists, allow all months of the selected year
        availableMonths = months.map(m => ({ year, month: m }));
    } else {
        const [maxYear, maxMonth] = highestMonth.split("-");
        if (Number(year) > Number(maxYear)) {
            availableMonths = months.map(m => ({ year, month: m }));
        } else if (Number(year) === Number(maxYear)) {
            availableMonths = months
                .filter(m => Number(m) > Number(maxMonth))
                .map(m => ({ year, month: m }));
        } // else: no months available for years before maxYear
    }

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSubmit({
                employeeCode: worker.code,
                year: Number(year),
                month: `${year}-${month}`,
                amount: Number(amount),
                comments,
                worker:worker._id
            });
            onClose();
        } catch (err) {
            setError("Failed to create advanced payment.");
        } finally {
            setLoading(false);
        }
    };

    // Set default month if availableMonths changes
    useEffect(() => {
        if (availableMonths.length > 0) {
            setMonth(availableMonths[0].month);
        }
    }, [availableMonths, year]);
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Advanced Payment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Employee</label>
                        <div className="p-2 bg-gray-100 rounded">{worker.personalDetails?.firstName} {worker.personalDetails?.lastName}</div>
                    </div>
                    <div className="flex gap-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Year</label>
                            <select
                                value={year}
                                onChange={e => setYear(Number(e.target.value))}
                                className="border rounded p-2 w-24"
                                required
                            >
                                {yearOptions.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Month</label>
                            <select
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="border rounded p-2 w-24"
                                required
                            >
                                {availableMonths.length === 0 && (
                                    <option value="">No months available</option>
                                )}
                                {availableMonths.map(({ month: m }) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Comments</label>
                        <textarea
                            value={comments}
                            onChange={e => setComments(e.target.value)}
                            className="border rounded p-2 w-full"
                            rows={2}
                        />
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                            disabled={loading || availableMonths.length === 0}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdvancedPaymentModal;