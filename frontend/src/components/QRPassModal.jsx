import React from 'react';
import { X, Download, CheckCircle2, AlertCircle, ShieldCheck, Calendar, MapPin, User } from 'lucide-react';

const QRPassModal = ({ isOpen, onClose, registration }) => {
  if (!isOpen || !registration) return null;

  const event = registration.event || {};
  const isAttended = registration.status === 'attended';

  const handleDownload = () => {
    if (!registration.qrCodeImage) return;
    const link = document.createElement('a');
    link.href = registration.qrCodeImage;
    link.download = `EventNest-Pass-${registration.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Pass Header Banner */}
        <div className="bg-gradient-to-tr from-brand-800 via-brand-700 to-indigo-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-brand-200 text-xs font-bold tracking-widest uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Event Pass</span>
          </div>
          <h3 className="font-extrabold text-lg text-white leading-snug line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-brand-100 mt-1">Ticket #{registration.ticketId}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center bg-slate-50 border-b border-dashed border-slate-300">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
            {registration.qrCodeImage ? (
              <img
                src={registration.qrCodeImage}
                alt={`QR Pass for ${registration.ticketId}`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            {isAttended ? (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Attendance Verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Valid for Entrance</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Show this verifiable QR code at the registration desk
          </p>
        </div>

        {/* Event Meta Details */}
        <div className="p-5 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {new Date(event.dateTime).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex space-x-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRPassModal;
