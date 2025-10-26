import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ShareGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  inviteCode: string;
  gameName: string;
}

const ShareGameModal = ({ isOpen, onClose, roomId, inviteCode, gameName }: ShareGameModalProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/play/${roomId}?invite=${inviteCode}`;
  
  // Generate QR code URL using qrcode.react or API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard! 📋');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareViaWhatsApp = () => {
    const message = `Join me for a game of ${gameName}! ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const message = `Join me for a game of ${gameName}! ${shareUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Join me for ${gameName}!`;
    const body = `Hey! I'm inviting you to play ${gameName} with me. Click this link to join: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${gameName}-invite-qr.png`;
    link.click();
    toast.success('QR Code downloaded! 📥');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card p-8 rounded-2xl max-w-md w-full relative">
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-glow-blue mb-2">Share Game 🎮</h2>
                <p className="text-text-secondary">Invite friends to play {gameName}</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="p-4 bg-white rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </motion.div>
              </div>

              {/* Download QR Button */}
              <motion.button
                onClick={downloadQRCode}
                className="w-full mb-4 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a 3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </motion.button>

              {/* Invite Code */}
              <div className="mb-6">
                <p className="text-sm text-text-secondary mb-2 text-center">Invite Code</p>
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-neon-green tracking-wider">{inviteCode}</p>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <p className="text-sm text-text-secondary mb-2">Share Link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 glass px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                  <motion.button
                    onClick={copyToClipboard}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? '✓' : '📋'}
                  </motion.button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-3">
                <p className="text-sm text-text-secondary text-center mb-3">Share via</p>
                
                <motion.button
                  onClick={shareViaWhatsApp}
                  className="w-full px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">📱</span>
                  WhatsApp
                </motion.button>

                <motion.button
                  onClick={shareViaTelegram}
                  className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">✈️</span>
                  Telegram
                </motion.button>

                <motion.button
                  onClick={shareViaEmail}
                  className="w-full px-4 py-3 rounded-lg glass hover:bg-white/10 font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">📧</span>
                  Email
                </motion.button>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 rounded-lg bg-neon-blue/10 border border-neon-blue/30">
                <p className="text-sm text-text-secondary text-center">
                  <span className="text-neon-blue font-semibold">💡 Tip:</span> Friends can scan the QR code or use the invite code to join!
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareGameModal;
