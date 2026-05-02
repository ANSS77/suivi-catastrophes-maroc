import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const REGIONS = [
  'Tanger-Tetouan-Al Hoceima', 'Oriental', 'Fes-Meknes',
  'Rabat-Sale-Kenitra', 'Beni-Mellal-Khenifra', 'Casablanca-Settat',
  'Marrakech-Safi', 'Draa-Tafilalet', 'Souss-Massa',
  'Guelmim-Oued Noun', 'Laayoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab',
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', password: '', regions: [] });
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleRegion = (region) => {
    setFormData(prev => {
      const regions = prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region];
      return { ...prev, regions };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Vérification champs vides
    if (!formData.nom) {
      setError('Le nom est requis.');
      return;
    }
    if (!formData.email) {
      setError('L\'email est requis.');
      return;
    }
    if (!formData.password) {
      setError('Le mot de passe est requis.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (formData.regions.length === 0) {
      setError('Veuillez sélectionner au moins une région.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nom: formData.nom,
        email: formData.email,
        password: formData.password,
        regions: formData.regions,
      });
      navigate('/');
    } catch (err) {
      if (err.response?.status === 400) {
        if (err.response?.data?.email) {
          setError('Cette adresse email est déjà utilisée.');
        } else {
          setError('Données invalides. Vérifiez les champs.');
        }
      } else if (err.response?.status === 500) {
        setError('Erreur serveur. Réessayez plus tard.');
      } else {
        setError('Erreur lors de l\'inscription. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Titre */}
      <h2 className="font-['EB_Garamond'] text-[44px] font-bold text-[#3A302A] mb-2 leading-[1.1]">
        Créer un compte
      </h2>
      <p className="font-['Manrope'] text-[#888] mb-9 text-sm leading-[1.7]">
        Rejoignez le réseau national de vigilance.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Nom */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase mb-1.5 font-['Manrope']">
            Nom Complet
          </label>
          <div className="flex items-center border-[1.5px] border-[#e0d8d0] rounded-lg px-4 py-3.5 bg-white gap-2.5 transition-colors focus-within:border-[#C2652A]">
            <i className="fa-regular fa-user text-[#bbb] text-[15px]"></i>
            <input
              type="text"
              placeholder="Mohamed El Idrissi"
              className="flex-1 border-none outline-none text-sm text-[#333] bg-transparent font-['Manrope'] placeholder:text-[#bbb]"
              value={formData.nom}
              onChange={e => setFormData({ ...formData, nom: e.target.value })}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase mb-1.5 font-['Manrope']">
            Email
          </label>
          <div className="flex items-center border-[1.5px] border-[#e0d8d0] rounded-lg px-4 py-3.5 bg-white gap-2.5 transition-colors focus-within:border-[#C2652A]">
            <i className="fa-regular fa-envelope text-[#bbb] text-[15px]"></i>
            <input
              type="email"
              placeholder="contact@exemple.ma"
              className="flex-1 border-none outline-none text-sm text-[#333] bg-transparent font-['Manrope'] placeholder:text-[#bbb]"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase mb-1.5 font-['Manrope']">
            Mot de Passe
          </label>
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

        {/* Région (Multiselect Custom) */}
        <div ref={dropdownRef} className="relative">
          <label className="block text-[11px] font-bold tracking-[0.12em] text-[#666] uppercase mb-1.5 font-['Manrope']">
            Régions
          </label>
          <div
            className={`flex items-center border-[1.5px] ${isRegionDropdownOpen ? 'border-[#C2652A]' : 'border-[#e0d8d0]'} rounded-lg px-4 py-3.5 bg-white gap-2.5 transition-colors cursor-pointer select-none`}
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
          >
            <i className="fa-solid fa-location-dot text-[#bbb] text-[15px]"></i>
            <div className={`flex-1 text-sm font-['Manrope'] truncate ${formData.regions.length > 0 ? 'text-[#333]' : 'text-[#bbb]'}`}>
              {formData.regions.length > 0 ? formData.regions.join(', ') : 'Sélectionnez vos régions'}
            </div>
            <i className={`fa-solid fa-chevron-down text-[#bbb] text-[12px] transition-transform duration-200 ${isRegionDropdownOpen ? 'rotate-180' : ''}`}></i>
          </div>

          {/* Menu déroulant */}
          {isRegionDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-[#e0d8d0] rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
              {REGIONS.map(region => {
                const isSelected = formData.regions.includes(region);
                return (
                  <div
                    key={region}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FDFBF7] cursor-pointer font-['Manrope'] text-sm text-[#333] transition-colors"
                    onClick={() => toggleRegion(region)}
                  >
                    <div className={`flex items-center justify-center w-4 h-4 rounded border ${isSelected ? 'bg-[#C2652A] border-[#C2652A]' : 'border-[#d0c8c0] bg-transparent'}`}>
                      {isSelected && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                    </div>
                    <span>{region}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <p className="text-red-500 text-sm font-['Manrope'] text-center">{error}</p>
        {/* Bouton */}
        <button
          type="submit" disabled={loading}
          className="w-full bg-[#C2652A] hover:bg-[#A95520] text-white border-none rounded-lg p-4 text-sm font-bold cursor-pointer mt-2 tracking-[0.05em] font-['Manrope'] transition-colors"
        >
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
      </form>

      <p className="text-center text-[#999] mt-7 text-sm font-['Manrope']">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-[#C2652A] font-bold no-underline hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}