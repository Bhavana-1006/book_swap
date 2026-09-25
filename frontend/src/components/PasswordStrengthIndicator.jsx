import React from 'react';
import { Check, X } from 'lucide-react';

export const checkPasswordCriteria = (password, confirmPassword = null) => {
  const criteria = {
    length: (password || '').length >= 8,
    uppercase: /[A-Z]/.test(password || ''),
    lowercase: /[a-z]/.test(password || ''),
    number: /\d/.test(password || ''),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password || '')
  };

  const score = Object.values(criteria).filter(Boolean).length;
  const isMatch = confirmPassword !== null ? (password === confirmPassword && (password || '').length > 0) : null;
  const isValid = score === 5 && (confirmPassword === null || isMatch);

  return { criteria, score, isMatch, isValid };
};

const PasswordStrengthIndicator = ({ password = '', confirmPassword = null }) => {
  if (!password && confirmPassword === null) return null;

  const { criteria, score, isMatch } = checkPasswordCriteria(password, confirmPassword);

  const getStrengthLabel = () => {
    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 4) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="mt-2 p-3 bg-cream-50 rounded-xl border border-cream-200 text-xs space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-xs font-semibold mb-1">
        <span className="text-navy-700">Password Strength:</span>
        <span className={strength.text}>{strength.label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              score >= level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
        <div className={`flex items-center gap-1.5 ${criteria.length ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
          {criteria.length ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
          <span>At least 8 characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${criteria.uppercase ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
          {criteria.uppercase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
          <span>One uppercase letter (A-Z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${criteria.lowercase ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
          {criteria.lowercase ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
          <span>One lowercase letter (a-z)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${criteria.number ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
          {criteria.number ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
          <span>One number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${criteria.special ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
          {criteria.special ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
          <span>One special character (!@#$)</span>
        </div>
        {confirmPassword !== null && (
          <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
            {isMatch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-gray-400" />}
            <span>Passwords match</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
