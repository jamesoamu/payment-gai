import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Receipt,
  MessageSquare,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  GraduationCap,
} from 'lucide-react';
import { Student, InstitutionProfile, FeeItem } from '../types';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '../utils/formatters';

interface StudentsListProps {
  students: Student[];
  institution: InstitutionProfile;
  feeCatalog: FeeItem[];
  onSelectStudent: (student: Student) => void;
  onOpenRecordPayment: (student: Student) => void;
  onOpenReminderModal: (student: Student) => void;
  onAddStudent: (newStudent: Student) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  students,
  institution,
  feeCatalog,
  onSelectStudent,
  onOpenRecordPayment,
  onOpenReminderModal,
  onAddStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'overdue' | 'unpaid'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<'all' | 'school' | 'tutorial_center' | 'training_academy'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Extract unique classes
  const uniqueClasses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.className))).sort();
  }, [students]);

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search match
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        student.fullName.toLowerCase().includes(query) ||
        student.regNumber.toLowerCase().includes(query) ||
        student.guardianName.toLowerCase().includes(query) ||
        student.guardianPhone.includes(query) ||
        student.className.toLowerCase().includes(query);

      // Status match
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'overdue' ? student.status === 'overdue' : student.status === statusFilter);

      // Class match
      const matchesClass = classFilter === 'all' || student.className === classFilter;

      // Program match
      const matchesProgram = programFilter === 'all' || student.institutionType === programFilter;

      return matchesSearch && matchesStatus && matchesClass && matchesProgram;
    });
  }, [students, searchTerm, statusFilter, classFilter, programFilter]);

  // Stats for the current filtered view
  const currentTotalBilled = filteredStudents.reduce((sum, s) => sum + s.totalBilled, 0);
  const currentTotalPaid = filteredStudents.reduce((sum, s) => sum + s.totalPaid, 0);
  const currentPendingBalance = filteredStudents.reduce((sum, s) => sum + s.balance, 0);

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Reg No', 'Full Name', 'Class', 'Guardian', 'Phone', 'Total Billed', 'Total Paid', 'Balance', 'Status', 'Due Date'];
    const rows = filteredStudents.map((s) => [
      `"${s.regNumber}"`,
      `"${s.fullName}"`,
      `"${s.className}"`,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      s.totalBilled,
      s.totalPaid,
      s.balance,
      `"${s.status}"`,
      `"${s.dueDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduPay_Students_Balances_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Student Form State
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'Female' as 'Male' | 'Female',
    regNumber: `APX/2026/${Math.floor(100 + Math.random() * 900)}`,
    className: uniqueClasses[0] || 'SS3 Gold (Science)',
    institutionType: 'school' as 'school' | 'tutorial_center' | 'training_academy',
    guardianName: '',
    guardianPhone: '+234',
    guardianEmail: '',
    dueDate: '2026-10-15',
    discountPercent: 0,
    selectedFeeItemIds: feeCatalog.filter((f) => f.isMandatory).map((f) => f.id),
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.guardianName || !formData.guardianPhone) {
      alert('Please fill out all required student and guardian fields.');
      return;
    }

    const assignedFeeItems = feeCatalog
      .filter((f) => formData.selectedFeeItemIds.includes(f.id))
      .map((f) => ({
        itemId: f.id,
        name: f.name,
        amount: f.amount,
        paidAmount: 0,
        isPaid: false,
      }));

    const grossBilled = assignedFeeItems.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (grossBilled * (formData.discountPercent || 0)) / 100;
    const netBilled = grossBilled - discountAmount;

    const newStudent: Student = {
      id: `stu_${Date.now()}`,
      regNumber: formData.regNumber,
      fullName: formData.fullName,
      gender: formData.gender,
      className: formData.className,
      institutionType: formData.institutionType,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      guardianEmail: formData.guardianEmail || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      totalBilled: netBilled,
      totalPaid: 0,
      balance: netBilled,
      status: 'unpaid',
      dueDate: formData.dueDate,
      enrollmentDate: new Date().toISOString().slice(0, 10),
      feeItems: assignedFeeItems,
      discountPercent: formData.discountPercent,
      notes: 'New enrollment record.',
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Students & Fee Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor outstanding tuition, manage installment balances, and print ledger statements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add New Student
          </button>
        </div>
      </div>

      {/* Mini Summary Banner of Selected View */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Filtered Students</div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-0.5">
            {filteredStudents.length} Students
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase">Total Collected</div>
          <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {formatCurrency(currentTotalPaid, institution.currencySymbol)}
          </div>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50/40 px-4 py-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-rose-700 uppercase">Pending Balances</div>
          <div className="text-lg font-bold text-rose-700 font-mono tabular-nums mt-0.5">
            {formatCurrency(currentPendingBalance, institution.currencySymbol)}
          </div>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, Reg ID, class, parent phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Program filter */}
          <div className="flex items-center gap-2">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Institution Types</option>
              <option value="school">K-12 School</option>
              <option value="tutorial_center">Tutorial Center</option>
              <option value="training_academy">Training Academy</option>
            </select>

            {/* Class filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Classes / Batches</option>
              {uniqueClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tab Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 mr-2 text-[11px] font-medium">Payment Status:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Fully Paid ({students.filter((s) => s.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              statusFilter === 'partial'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Partial Balance ({students.filter((s) => s.status === 'partial').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              statusFilter === 'overdue'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Overdue / Unpaid ({students.filter((s) => s.status === 'overdue' || s.status === 'unpaid').length})
          </button>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900">No students found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or add a new student.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setClassFilter('all');
                setProgramFilter('all');
              }}
              className="mt-4 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Class / Batch</th>
                  <th className="py-3 px-4">Guardian / Parent</th>
                  <th className="py-3 px-4 text-right">Total Billed</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Outstanding</th>
                  <th className="py-3 px-4">Status & Due Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const statusStyle = getStatusColor(student.status);
                  const percentPaid = student.totalBilled > 0 ? Math.round((student.totalPaid / student.totalBilled) * 100) : 0;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectStudent(student)}
                    >
                      {/* Student info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{student.regNumber}</span>
                          <span>·</span>
                          <span>{student.gender}</span>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{student.className}</div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {student.institutionType.replace('_', ' ')}
                        </div>
                      </td>

                      {/* Guardian */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="text-slate-800 font-medium">{student.guardianName}</div>
                        <a
                          href={`tel:${student.guardianPhone}`}
                          className="text-[11px] font-mono text-slate-500 hover:text-emerald-700 hover:underline"
                        >
                          {student.guardianPhone}
                        </a>
                      </td>

                      {/* Billed */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                        {formatCurrency(student.totalBilled, institution.currencySymbol)}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-700">
                        {formatCurrency(student.totalPaid, institution.currencySymbol)}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {percentPaid}%
                        </div>
                      </td>

                      {/* Pending Balance */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                        {student.balance > 0 ? (
                          <span className="text-rose-700">
                            {formatCurrency(student.balance, institution.currencySymbol)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Cleared</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusStyle.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}></span>
                          {getStatusText(student.status)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Due: {formatDate(student.dueDate)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenRecordPayment(student)}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors shadow-2xs"
                            title="Record a payment"
                          >
                            <Receipt className="h-3 w-3 text-emerald-600" />
                            Pay
                          </button>

                          {student.balance > 0 && (
                            <button
                              onClick={() => onOpenReminderModal(student)}
                              className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                              title="Send WhatsApp or SMS reminder"
                            >
                              <MessageSquare className="h-3 w-3" />
                              Remind
                            </button>
                          )}

                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View student ledger statement"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enroll New Student</h3>
                <p className="text-xs text-slate-500">Configure fee plan and guardian contact</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oluwatosin Daniel Adeleke"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration / Admission ID</label>
                  <input
                    type="text"
                    required
                    value={formData.regNumber}
                    onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution Type</label>
                  <select
                    value={formData.institutionType}
                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="school">K-12 School</option>
                    <option value="tutorial_center">Tutorial Center</option>
                    <option value="training_academy">Training Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class / Cohort *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SS3 Gold or Cohort 7"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian / Sponsor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Parent or sponsor name"
                    value={formData.guardianName}
                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+2348012345678"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Email</label>
                  <input
                    type="email"
                    placeholder="guardian@example.com"
                    value={formData.guardianEmail}
                    onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fee Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scholarship / Sibling Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Fee Items Breakdown selection */}
              <div className="pt-2">
                <label className="block font-semibold text-slate-800 mb-1.5">
                  Select Applicable Fee Items:
                </label>
                <div className="space-y-1.5 rounded-lg border border-slate-200 p-2.5 bg-slate-50/50">
                  {feeCatalog.map((fee) => {
                    const isChecked = formData.selectedFeeItemIds.includes(fee.id);
                    return (
                      <label key={fee.id} className="flex items-center justify-between text-xs cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedFeeItemIds: [...formData.selectedFeeItemIds, fee.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedFeeItemIds: formData.selectedFeeItemIds.filter((id) => id !== fee.id),
                                });
                              }
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-slate-800 font-medium">{fee.name}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-600">
                          {formatCurrency(fee.amount, institution.currencySymbol)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                >
                  Save & Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
