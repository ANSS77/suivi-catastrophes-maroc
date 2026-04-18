import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  return (
    <AuthLayout>
      {/* Titre */}
      <h2 className="font-['EB_Garamond'] text-[44px] font-bold text-[#3A302A] mb-2 leading-[1.1]">
        Se connecter
      </h2>
      <p className="font-['Manrope'] text-[#888] mb-9 text-sm leading-[1.7]">
        Entrez vos identifiants pour accéder au tableau de bord.
      </p>

      <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-5">
        
        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase mb-1.5 font-['Manrope']">
            Adresse E-Mail
          </label>
          <div className="flex items-center border-[1.5px] border-[#e0d8d0] rounded-lg px-4 py-3.5 bg-white gap-2.5 transition-colors focus-within:border-[#C2652A]">
            <i className="fa-regular fa-envelope text-[#bbb] text-[15px]"></i>
            <input
              type="email"
              placeholder="nom@domaine.ma"
              className="flex-1 border-none outline-none text-sm text-[#333] bg-transparent font-['Manrope'] placeholder:text-[#bbb]"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase font-['Manrope']">
              Mot de Passe
            </label>
            <span className="text-[11px] text-[#C2652A] font-bold tracking-[0.08em] cursor-pointer font-['Manrope'] hover:underline">
              OUBLIÉ ?
            </span>
          </div>
          <div className="flex items-center border-[1.5px] border-[#e0d8d0] rounded-lg px-4 py-3.5 bg-white gap-2.5 transition-colors focus-within:border-[#C2652A]">
            <i className="fa-solid fa-lock text-[#bbb] text-[14px]"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="flex-1 border-none outline-none text-sm text-[#333] bg-transparent font-['Manrope'] placeholder:text-[#bbb]"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <i
              className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-[#bbb] cursor-pointer text-[15px] hover:text-[#888] transition-colors`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-[#C2652A] hover:bg-[#A95520] text-white border-none rounded-lg p-4 text-sm font-bold cursor-pointer mt-2 tracking-[0.05em] font-['Manrope'] transition-colors"
        >
          Se connecter
        </button>
      </form>

      <p className="text-center text-[#999] mt-7 text-sm font-['Manrope']">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-[#C2652A] font-bold no-underline hover:underline">
          S'inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}