import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

import { theme } from '../theme';
import { HeroSection } from '../components/Profil/HeroProfil';
import { ModalButton } from '../components/Profil/ModalButtonProfil';
import { InfoCard } from '../components/Profil/InfoProfil';
import { Store } from 'lucide-react';
import { SecurityCard } from '../components/Profil/SecuriteProfil';
import { QRCard } from '../components/Profil/QRProfil';
import { FAQSection } from '../components/Profil/FAQSection';
import { Modal } from '../components/Profil/ModalProfil';
import { FAQItem, ModalType, User, UserRole } from '../components/Profil/types';

const FAQ_DATA: FAQItem[] = [
  {
    q: "Comment fonctionne le QR code d'identité ?",
    a: "Votre QR code est unique. Le livreur le scanne pour confirmer que c'est bien vous qui recevez le colis, ce qui sécurise vos achats."
  },
  {
    q: "Mes informations sont-elles sécurisées ?",
    a: "Absolument. Toutes vos données sont chiffrées. Pour toute modification sensible, nous exigeons une re-vérification de votre mot de passe."
  },
  {
    q: "Comment devenir vendeur pro ?",
    a: "Cliquez sur le bouton 'Devenir Vendeur'. Après une brève vérification de notre équipe, vous pourrez ouvrir votre boutique."
  }
];

export default function Profile() {
  const [modal, setModal] = useState<ModalType>('none');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [isSellerApproved, setIsSellerApproved] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [user, setUser] = useState<User>({
    firstName: 'Namila',
    lastName: 'Traore',
    email: 'namila.k@gmail.com',
    phone: '+225 07 00 00 00',
    id: 'USR-CI-7741',
  });
  const [tempUser, setTempUser] = useState<User>(user);

  useEffect(() => {
    QRCode.toDataURL(user.id, {
      width: 120,
      margin: 1,
      color: { dark: theme.colors.secondary, light: theme.colors.gray[50] },
    }).then(setQrUrl);
  }, [user.id]);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: theme.colors.gray[50], color: theme.colors.gray[900] }}>
      <HeroSection
        user={user}
        role={role}
        isSellerApproved={isSellerApproved}
        setRole={setRole}
      />
      <div className="max-w-5xl mx-auto -mt-20 px-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
        <div className="space-y-6">
          {!isSellerApproved && (
            <div className="bg-white rounded-[32px] p-8 shadow-xl border-2 border-dashed transition-all hover:scale-[1.01]" style={{ borderColor: theme.colors.primary }}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Gagnez de l'argent</h3>
              <p className="text-sm mb-6 text-gray-500">Ouvrez votre boutique et commencez à vendre vos produits dès maintenant.</p>
              <ModalButton onClick={() => setModal('becomeSellerInfo')}><Store size={18} /> Devenir Vendeur</ModalButton>
            </div>
          )}
          <QRCard qrUrl={qrUrl} userId={user.id} />
          <InfoCard user={user} onEdit={() => { setTempUser(user); setModal('authBeforeEdit'); }} />
        </div>
        <div className="space-y-6">
          <SecurityCard onChangePass={() => setModal('askChangePass')} onLogout={() => setModal('logout')} />
          <FAQSection faqs={FAQ_DATA} openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </div>
      </div>
      <Modal
        modal={modal}
        user={user}
        tempUser={tempUser}
        authPass={authPass}
        setAuthPass={setAuthPass}
        setTempUser={setTempUser}
        setUser={setUser}
        setModal={setModal}
        setIsSellerApproved={setIsSellerApproved}
      />
    </div>
  );
}