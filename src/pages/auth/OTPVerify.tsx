import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/axiosConfig';

export default function OTPVerify() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const phone = location.state?.phone;
  const registrationData = location.state?.registrationData;

  useEffect(() => {
    if (!phone) navigate('/login');
    inputsRef.current[0]?.focus();
  }, [phone, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, '');
    setCode(newCode);

    // Auto focus next
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyCode = async () => {
    const otp = code.join('');
    if (otp.length < 6) return;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/otp/verify', { 
        phone, 
        otp,
        ...registrationData
      });
      const { token, user } = response.data;
      login(token, user);
      navigate('/'); // Go home
    } catch (error: any) {
      alert(error.response?.data?.error || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  // Auto submit when 6 chars
  useEffect(() => {
    if (code.join('').length === 6) verifyCode();
  }, [code]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 mx-auto max-w-md bg-white min-h-screen flex flex-col justify-center text-center">
      <h1 className="text-2xl font-bold mb-2">Vérification SMS</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Un code à 6 chiffres a été envoyé au <br/>
        <strong className="text-gray-800">{phone}</strong>
      </p>

      <div className="flex justify-between gap-2 mb-8">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-900 focus:ring-0 outline-none bg-gray-50"
          />
        ))}
      </div>

      <div className="space-y-4">
        {countdown > 0 ? (
          <p className="text-sm font-medium text-gray-500">
            Le code expire dans <span className="text-orange-500">{formatTime(countdown)}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-red-500">Le code a expiré.</p>
        )}

        <button 
          disabled={resendTimer > 0}
          className="text-sm font-semibold text-blue-900 w-full p-2 disabled:text-gray-300 transition-colors"
        >
          {resendTimer > 0 ? `Renvoyer le code dans ${resendTimer}s` : 'Renvoyer le code'}
        </button>
      </div>

      {loading && <p className="mt-4 text-blue-900 font-medium animate-pulse">Vérification en cours...</p>}
    </div>
  );
}
