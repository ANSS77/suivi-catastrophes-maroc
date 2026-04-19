import disasterImage from '../../assets/disaster-image.png';
import LogoIcon from '../common/LogoIcon';

export default function AuthLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden font-['Manrope']">

      {/* Partie gauche — Image fixe (45% de la largeur pour dé-zoomer) */}
      <div className="relative w-[43%] h-screen shrink-0">
        <img
          src={disasterImage}
          alt="disaster"
          className="w-full h-full object-cover object-center block"
        />
        {/* Subtle gradient to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 rounded-r-[5px]" />

        {/* Logo */}
        <div className="absolute top-8 left-12 right-10 flex justify-start items-center text-white font-['EB_Garamond'] text-lg font-medium">
          <LogoIcon className="drop-shadow-sm text-white" size={36} />
        </div>

        {/* Texte centré */}
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left pl-14 pr-10 pt-20">
          <h1 className="font-['EB_Garamond'] text-[56px] lg:text-[64px] leading-[1.1] text-black mb-8 font-medium">
            Surveillez.<br />Anticipez.<br />Protégez.
          </h1>
          <div className="w-24 h-1 bg-[#C2652A] mb-8" />
          <p className="font-['Manrope'] text-base lg:text-lg max-w-[90%] leading-relaxed font-light tracking-wide text-white/90">
            Accédez aux outils de surveillance sismique et climatique les plus avancés du Royaume.
            Une plateforme dédiée à la résilience et à la sécurité civile.
          </p>
          <p className="font-['Manrope'] text-xs mt-8 tracking-[0.2em] font-bold uppercase text-white/80">
            Plateforme Nationale de Vigilance
          </p>
        </div>
      </div>

      {/* Partie droite — scrollable (55% restants) */}
      <div className="flex-1 h-screen overflow-y-auto bg-[#FDFBF7] flex items-center justify-center p-10 lg:p-16">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}