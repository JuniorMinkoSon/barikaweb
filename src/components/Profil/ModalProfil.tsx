import React from 'react';
import { X, CheckCircle2, KeyRound, Shield, Store, LogOut, Lock, AlertCircle } from 'lucide-react';
import { theme } from '../../theme';
import { ModalType, User } from './types';
import { ModalButton } from './ModalButtonProfil';

interface ModalProps {
  modal: ModalType;
  user: User;
  tempUser: User;
  authPass: string;
  setAuthPass: (pass: string) => void;
  setTempUser: (user: User) => void;
  setUser: (user: User) => void;
  setModal: (modal: ModalType) => void;
  setIsSellerApproved: (approved: boolean) => void;
}

export const Modal: React.FC<ModalProps> = ({
  modal,
  user,
  tempUser,
  authPass,
  setAuthPass,
  setTempUser,
  setUser,
  setModal,
  setIsSellerApproved,
}) => {
  const closeModal = () => { setModal('none'); setAuthPass(''); };

  if (modal === 'none') return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={closeModal} />
      <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        {modal !== 'successPass' && modal !== 'becomeSellerPending' && (
          <button onClick={closeModal} className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: theme.colors.gray[50], color: theme.colors.gray[400] }}><X size={20} /></button>
        )}

        {modal === 'authBeforeEdit' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><KeyRound size={32} /></div>
            <h2 className="text-2xl font-bold mb-2">Vérification</h2>
            <p className="text-sm mb-8 text-gray-400">Entrez votre mot de passe pour modifier vos infos.</p>
            <input type="password" placeholder="Mot de passe" value={authPass} onChange={e => setAuthPass(e.target.value)} className="w-full px-5 py-4 rounded-2xl outline-none mb-4 border-2 border-transparent focus:border-orange-500" style={{ backgroundColor: theme.colors.gray[50] }} />
            <ModalButton onClick={() => setModal('editInfo')} disabled={!authPass}>Déverrouiller</ModalButton>
          </div>
        )}

        {modal === 'editInfo' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Modifier le profil</h2>
            <div className="space-y-3">
              <input className="w-full px-5 py-4 rounded-2xl outline-none" style={{ backgroundColor: theme.colors.gray[50] }} placeholder="Prénom" value={tempUser.firstName} onChange={e => setTempUser({...tempUser, firstName: e.target.value})} />
              <input className="w-full px-5 py-4 rounded-2xl outline-none" style={{ backgroundColor: theme.colors.gray[50] }} placeholder="Nom" value={tempUser.lastName} onChange={e => setTempUser({...tempUser, lastName: e.target.value})} />
              <input className="w-full px-5 py-4 rounded-2xl outline-none" style={{ backgroundColor: theme.colors.gray[50] }} placeholder="Téléphone" value={tempUser.phone} onChange={e => setTempUser({...tempUser, phone: e.target.value})} />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <ModalButton onClick={() => { setUser(tempUser); closeModal(); }}>Enregistrer</ModalButton>
              <ModalButton variant="secondary" onClick={closeModal}>Annuler</ModalButton>
            </div>
          </div>
        )}

        {modal === 'askChangePass' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><Lock size={32} /></div>
            <h2 className="text-2xl font-bold mb-2">Mot de passe</h2>
            <p className="text-sm mb-8 text-gray-400">Un code sera envoyé à <strong>{user.email}</strong>.</p>
            <ModalButton onClick={() => setModal('inputTempPass')}>Envoyer le code</ModalButton>
          </div>
        )}

        {modal === 'inputTempPass' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><KeyRound size={32} /></div>
            <h2 className="text-2xl font-bold mb-2">Vérification</h2>
            <input type="text" placeholder="••••••" maxLength={6} className="w-full text-center text-3xl font-bold tracking-[12px] py-4 rounded-2xl outline-none mb-6" style={{ backgroundColor: theme.colors.gray[50] }} />
            <ModalButton onClick={() => setModal('inputNewPass')}>Valider</ModalButton>
          </div>
        )}

        {modal === 'inputNewPass' && (
          <div>
            <div className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><Shield size={32} /></div>
            <h2 className="text-2xl font-bold mb-2">Nouveau mot de passe</h2>
            <div className="space-y-3 mt-6 text-left">
              <input type="password" placeholder="Nouveau mot de passe" className="w-full px-5 py-4 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500" style={{ backgroundColor: theme.colors.gray[50] }} />
              <input type="password" placeholder="Confirmer" className="w-full px-5 py-4 rounded-2xl outline-none border-2 border-transparent focus:border-orange-500" style={{ backgroundColor: theme.colors.gray[50] }} />
            </div>
            <div className="mt-8"><ModalButton onClick={() => setModal('successPass')}>Mettre à jour</ModalButton></div>
          </div>
        )}

        {modal === 'successPass' && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6 text-green-600"><CheckCircle2 size={48} /></div>
            <h2 className="text-2xl font-bold mb-2">Succès !</h2>
            <p className="text-sm mb-8 text-gray-400">Mot de passe modifié avec succès.</p>
            <ModalButton onClick={closeModal}>Terminer</ModalButton>
          </div>
        )}

        {modal === 'becomeSellerInfo' && (
          <div>
            <div className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: theme.colors.primaryLight, color: theme.colors.primary }}><Store size={32} /></div>
            <h2 className="text-2xl font-bold mb-4">Devenir Vendeur</h2>
            <div className="space-y-4 mb-8 text-sm text-gray-600">
              <div className="flex gap-3"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> <p>Gérez vos propres produits et stocks.</p></div>
              <div className="flex gap-3"><CheckCircle2 size={16} className="text-green-500 shrink-0" /> <p>Paiements rapides et assistance Pro.</p></div>
            </div>
            <ModalButton onClick={() => setModal('becomeSellerPending')}>C'est parti !</ModalButton>
          </div>
        )}

        {modal === 'becomeSellerPending' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}><AlertCircle size={32} /></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Vérification</h2>
            <p className="text-sm text-gray-500 mb-8">Nous analysons votre demande. Vous serez notifié sous 48h.</p>
            <ModalButton onClick={() => { setIsSellerApproved(true); closeModal(); }}>Compris</ModalButton>
          </div>
        )}

        {modal === 'logout' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-[22px] bg-red-50 text-red-500 flex items-center justify-center mb-6"><LogOut size={32} /></div>
            <h2 className="text-2xl font-bold mb-2">Se déconnecter ?</h2>
            <ModalButton variant="danger" onClick={() => console.log('Logout')}>Déconnexion</ModalButton>
            <ModalButton variant="secondary" onClick={closeModal}>Annuler</ModalButton>
          </div>
        )}
      </div>
    </div>
  );
};