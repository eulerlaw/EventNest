import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, AlertTriangle, Search, ShieldCheck } from 'lucide-react';
import { registrationService } from '../services/api';

const QRScannerModal = ({ isOpen, onClose, eventId, eventTitle, onAttendanceMarked }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (!ticketInput.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const cleanInput = ticketInput.trim();
      const payload = {
        eventId,
        // If string looks like base64 or contains JSON, send as qrData, otherwise ticketId
        qrData: cleanInput.length > 30 ? cleanInput : null,
        ticketId: cleanInput.length <= 30 ? cleanInput : null
      };

      const res = await registrationService.verifyAttendance(payload);
      if (res.data.success) {
        setResult(res.data);
        setTicketInput('');
        if (onAttendanceMarked) {
          onAttendanceMarked(res.data.registration);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed: Invalid QR code or Ticket ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase mb-1">
            <QrCode className="w-4 h-4" />
            <span>Attendance Verification Desk</span>
          </div>
          <h3 className="text-base font-bold text-white truncate">{eventTitle}</h3>
        </div>

        <div className="p-6 space-y-5">
          {/* Instructions */}
          <div className="p-3.5 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <p className="text-xs text-brand-900 leading-relaxed">
              Scan attendee's physical or digital QR code with your handheld scanner, or paste the ticket code below. Cryptographic HMAC ensures tickets cannot be faked or reused.
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Ticket ID or Scanned QR String
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. EN-2026-A1B2 or paste QR string"
                  className="w-full pl-3.5 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !ticketInput.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-40"
                >
                  {loading ? 'Checking...' : 'Verify'}
                </button>
              </div>
            </div>
          </form>

          {/* Verification Status Feedback */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-2 text-rose-800 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Attendance Successfully Verified!</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-emerald-100">
                <p>
                  <span className="font-semibold text-slate-900">Attendee:</span> {result.registration?.user?.name}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Roll No:</span> {result.registration?.user?.rollNumber || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Department:</span> {result.registration?.user?.department}
                </p>
                <p className="text-[11px] text-slate-500">
                  Ticket #{result.registration?.ticketId} verified at {new Date(result.registration?.attendedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Done Scanning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
