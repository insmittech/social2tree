import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Check, X, GripVertical, Star, Eye, EyeOff } from 'lucide-react';
import client from '../src/api/client';
import { useToast } from '../src/context/ToastContext';

interface Plan {
    id: string;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    description: string;
    features: string[];
    isPopular: boolean;
    isVisible: boolean;
    sortOrder: number;
}

const AdminPlans: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Partial<Plan> | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const res = await client.get('/admin/plans/list.php');
            setPlans(res.data.plans || []);
        } catch (err) {
            showToast('Failed to fetch plans', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (plan: Plan) => {
        setCurrentPlan(plan);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentPlan({
            name: '',
            priceMonthly: 0,
            priceYearly: 0,
            description: '',
            features: [''],
            isPopular: false,
            isVisible: true,
            sortOrder: plans.length + 1
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentPlan?.name) {
            showToast('Plan name is required', 'error');
            return;
        }

        try {
            await client.post('/admin/plans/update.php', currentPlan);
            showToast(currentPlan.id ? 'Plan updated' : 'Plan created', 'success');
            setIsEditing(false);
            setCurrentPlan(null);
            fetchPlans();
        } catch (err) {
            showToast('Failed to save plan', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this plan?')) return;

        try {
            await client.post('/admin/plans/delete.php', { id });
            showToast('Plan deleted', 'success');
            fetchPlans();
        } catch (err) {
            showToast('Failed to delete plan', 'error');
        }
    };

    const handleFeatureChange = (index: number, val: string) => {
        if (!currentPlan) return;
        const newFeatures = [...(currentPlan.features || [])];
        newFeatures[index] = val;
        setCurrentPlan({ ...currentPlan, features: newFeatures });
    };

    const addFeature = () => {
        if (!currentPlan) return;
        setCurrentPlan({ ...currentPlan, features: [...(currentPlan.features || []), ''] });
    };

    const removeFeature = (index: number) => {
        if (!currentPlan) return;
        const newFeatures = (currentPlan.features || []).filter((_, i) => i !== index);
        setCurrentPlan({ ...currentPlan, features: newFeatures });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <CreditCard className="text-indigo-600" /> Subscription Plans
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage pricing, features, and visibility.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100"
                >
                    <Plus size={20} /> Add New Plan
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`bg-white dark:bg-slate-900/40 rounded-2xl border ${plan.isPopular ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 dark:border-slate-800/50'} p-6 relative group transition-all hover:shadow-xl`}>
                            {!plan.isVisible && (
                                <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-[#0b0f19] px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <EyeOff size={12} /> Hidden
                                </div>
                            )}
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-6 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Star size={10} fill="white" /> Popular
                                </div>
                            )}

                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">${plan.priceMonthly}</span>
                                <span className="text-slate-400 dark:text-slate-500 text-sm font-bold">/mo</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 line-clamp-2">{plan.description}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.slice(0, 4).map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs font-bold">
                                        <Check size={14} className="text-indigo-600" /> {f}
                                    </li>
                                ))}
                                {plan.features.length > 4 && (
                                    <li className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase pl-6">+{plan.features.length - 4} more</li>
                                )}
                            </ul>

                            <div className="flex gap-2 border-t border-slate-50 dark:border-slate-800/50 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 bg-slate-50 dark:bg-[#0b0f19] text-slate-600 dark:text-slate-300 py-2 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && currentPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900/40 w-full max-w-2xl rounded-3xl shadow-2xl dark:shadow-none overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-[#0b0f19]/50">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">{currentPlan.id ? 'Edit Plan' : 'New Subscription Plan'}</h2>
                            <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 rounded-xl transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Plan Name</label>
                                    <input
                                        type="text"
                                        value={currentPlan.name}
                                        onChange={e => setCurrentPlan({ ...currentPlan, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                                        placeholder="e.g. Pro Plan"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Monthly Price ($)</label>
                                        <input
                                            type="number"
                                            value={currentPlan.priceMonthly}
                                            onChange={e => setCurrentPlan({ ...currentPlan, priceMonthly: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Yearly Price ($)</label>
                                        <input
                                            type="number"
                                            value={currentPlan.priceYearly}
                                            onChange={e => setCurrentPlan({ ...currentPlan, priceYearly: parseFloat(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={currentPlan.description}
                                    onChange={e => setCurrentPlan({ ...currentPlan, description: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all min-h-[80px]"
                                    placeholder="Brief description of the plan..."
                                />
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Plan Features</label>
                                    <button onClick={addFeature} className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 flex items-center gap-1">
                                        <Plus size={14} /> Add Feature
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {currentPlan.features?.map((feature, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <Check size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" />
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={e => handleFeatureChange(idx, e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                                                    placeholder="Feature description"
                                                />
                                            </div>
                                            <button onClick={() => removeFeature(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-slate-50 dark:bg-[#0b0f19] p-4 rounded-2xl flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Popular</span>
                                    <button
                                        onClick={() => setCurrentPlan({ ...currentPlan, isPopular: !currentPlan.isPopular })}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${currentPlan.isPopular ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white dark:bg-slate-900/40 rounded-full transition-transform ${currentPlan.isPopular ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div className="bg-slate-50 dark:bg-[#0b0f19] p-4 rounded-2xl flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Visible</span>
                                    <button
                                        onClick={() => setCurrentPlan({ ...currentPlan, isVisible: !currentPlan.isVisible })}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${currentPlan.isVisible ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white dark:bg-slate-900/40 rounded-full transition-transform ${currentPlan.isVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 pl-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={currentPlan.sortOrder}
                                        onChange={e => setCurrentPlan({ ...currentPlan, sortOrder: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-[#0b0f19] border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 dark:bg-[#0b0f19]/50 border-t border-slate-100 dark:border-slate-800/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-indigo-100"
                            >
                                {currentPlan.id ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlans;
