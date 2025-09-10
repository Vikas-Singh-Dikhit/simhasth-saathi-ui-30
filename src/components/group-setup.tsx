import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users, Plus, UserPlus, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGroup } from '@/context/GroupContext';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import simhasthaLogo from '@/assets/simhastha_logo.png';

interface GroupSetupProps {
  onGroupCreated: (groupCode: string) => void;
  language: string;
}

export const GroupSetup: React.FC<GroupSetupProps> = ({ onGroupCreated, language }) => {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [groupCode, setGroupCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createGroup, joinGroup } = useGroup();
  const [shareOpen, setShareOpen] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const texts = {
  en: {
    title: 'Setup Your Group',
    subtitle: 'Connect with family and friends for safety',
    createGroup: 'Create New Group',
    joinGroup: 'Join Existing Group',
    createDesc: 'Generate a unique code for your family/friends',
    joinDesc: 'Enter the group code shared by your group leader',
    generateCode: 'Generate Group Code',
    enterCode: 'Enter Group Code',
    codePlaceholder: 'Enter 6-digit code',
    copyCode: 'Copy Code',
    shareCode: 'Share this code with your family members',
    continue: 'Continue',
    back: 'Back',
    groupCodeLabel: 'Group Code',
    generating: 'Generating...',
    joining: 'Joining...',
    copied: 'Copied!',
    codeReadyTitle: 'Your Group Code is Ready! 🎉',
    shareButton: 'Share',
    downloadQR: 'Download QR',
    shareWhatsapp: 'Share on WhatsApp',
    copyLink: 'Copy Link',
    copiedLink: 'Link copied!',
    downloadPoster: 'Download Invite Card',
  },
  hi: {
    title: 'अपना समूह बनाएं',
    subtitle: 'सुरक्षा के लिए परिवार और दोस्तों से जुड़ें',
    createGroup: 'नया समूह बनाएं',
    joinGroup: 'मौजूदा समूह में शामिल हों',
    createDesc: 'अपने परिवार/दोस्तों के लिए एक विशेष कोड बनाएं',
    joinDesc: 'अपने समूह लीडर द्वारा साझा किया गया समूह कोड दर्ज करें',
    generateCode: 'समूह कोड बनाएं',
    enterCode: 'समूह कोड दर्ज करें',
    codePlaceholder: '6-अंकीय कोड दर्ज करें',
    copyCode: 'कोड कॉपी करें',
    shareCode: 'इस कोड को अपने परिवारजनों के साथ साझा करें',
    continue: 'जारी रखें',
    back: 'वापस',
    groupCodeLabel: 'समूह कोड',
    generating: 'बनाया जा रहा है...',
    joining: 'जुड़ रहे हैं...',
    copied: 'कॉपी हो गया!',
    codeReadyTitle: 'आपका समूह कोड तैयार है! 🎉',
    shareButton: 'शेयर करें',
    downloadQR: 'क्यूआर डाउनलोड करें',
    shareWhatsapp: 'व्हाट्सएप पर शेयर करें',
    copyLink: 'लिंक कॉपी करें',
    copiedLink: 'लिंक कॉपी हो गया!',
    downloadPoster: 'इनवाइट कार्ड डाउनलोड करें',
  },
  mr: {
    title: 'आपला गट तयार करा',
    subtitle: 'सुरक्षिततेसाठी कुटुंब आणि मित्रांशी कनेक्ट करा',
    createGroup: 'नवीन गट तयार करा',
    joinGroup: 'विद्यमान गटात सामील व्हा',
    createDesc: 'कुटुंब/मित्रांसाठी एक अद्वितीय कोड तयार करा',
    joinDesc: 'आपल्या गट नेत्याने दिलेला कोड प्रविष्ट करा',
    generateCode: 'गट कोड तयार करा',
    enterCode: 'गट कोड प्रविष्ट करा',
    codePlaceholder: '6-अंकीय कोड प्रविष्ट करा',
    copyCode: 'कोड कॉपी करा',
    shareCode: 'हा कोड आपल्या कुटुंबासोबत शेअर करा',
    continue: 'सुरू ठेवा',
    back: 'मागे',
    groupCodeLabel: 'गट कोड',
    generating: 'तयार करत आहे...',
    joining: 'जोडत आहे...',
    copied: 'कॉपी झाले!',
    codeReadyTitle: 'तुमचा गट कोड तयार आहे! 🎉',
    shareButton: 'शेअर करा',
    downloadQR: 'QR डाउनलोड करा',
    shareWhatsapp: 'WhatsApp वर शेअर करा',
    copyLink: 'लिंक कॉपी करा',
    copiedLink: 'लिंक कॉपी झाले!',
    downloadPoster: 'आमंत्रण कार्ड डाउनलोड करा',
  },
  sa: {
    title: 'समूह बनाएं',
    subtitle: 'सुरक्षा के लिए परिवार और मित्रों से जुड़ें',
    createGroup: 'नया समूह बनाएं',
    joinGroup: 'मौजूदा समूह में शामिल हों',
    createDesc: 'अपने परिवार/दोस्तों के लिए एक अद्वितीय कोड बनाएं',
    joinDesc: 'समूह नेता द्वारा साझा किया गया कोड दर्ज करें',
    generateCode: 'समूह कोड बनाएं',
    enterCode: 'समूह कोड दर्ज करें',
    codePlaceholder: '6-अंकीय कोड दर्ज करें',
    copyCode: 'कोड कॉपी करें',
    shareCode: 'इस कोड को परिवार के साथ साझा करें',
    continue: 'जारी रखें',
    back: 'वापस',
    groupCodeLabel: 'समूह कोड',
    generating: 'बनाया जा रहा है...',
    joining: 'जुड़ रहे हैं...',
    copied: 'कॉपी हो गया!',
    codeReadyTitle: 'समूह कोड तैयार है! 🎉',
    shareButton: 'शेयर करें',
    downloadQR: 'QR डाउनलोड करें',
    shareWhatsapp: 'व्हाट्सएप पर शेयर करें',
    copyLink: 'लिंक कॉपी करें',
    copiedLink: 'लिंक कॉपी हो गया!',
    downloadPoster: 'निमंत्रण कार्ड डाउनलोड करें',
  },
};


  const t = texts[language as keyof typeof texts] || texts.en;

  const generateGroupCode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setGeneratedCode(code);
  };

  const handleCreateGroup = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateGroupCode();
    setIsLoading(false);
  };

  const handleJoinGroup = async () => {
    if (groupCode.length < 6) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    joinGroup(groupCode);
    onGroupCreated(groupCode);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t.copied);
  };

  const handleContinueWithCode = () => {
    createGroup(generatedCode);
    onGroupCreated(generatedCode);
    console.info("group created")
  };

  const handleShareCode = async () => {
    const shareText = `Join our Simhasth group with code: ${generatedCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Simhasth Group Code', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.info(t.copied);
      }
    } catch (err) {
      console.error('Share failed', err);
      toast.error('Unable to share. Try copying the code.');
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}?join=${generatedCode}`;
      await navigator.clipboard.writeText(url);
      toast.success(t.copiedLink);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadQR = () => {
    try {
      const svg = document.getElementById('group-qr-code') as unknown as SVGSVGElement | null;
      if (!svg) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement('canvas');
      const scale = 4;
      const size = 128 * scale;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const a = document.createElement('a');
        a.download = `simhasth-group-${generatedCode}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
    } catch (e) {
      console.error(e);
      toast.error('Failed to download QR');
    }
  };

  const handleDownloadPoster = () => {
    try {
      const svg = document.getElementById('group-qr-code') as unknown as SVGSVGElement | null;
      if (!svg) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const qrImg = new Image();
      qrImg.onload = () => {
        const width = 800; const height = 1200;
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#fff7ed');
        gradient.addColorStop(1, '#ecfeff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        // card
        const cardX = 80, cardY = 140, cardW = width - 160, cardH = height - 280;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, 32);
        ctx.fill(); ctx.stroke();

        // title
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 42px Inter, system-ui, -apple-system, Segoe UI, Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Simhasth Group Invite', width/2, cardY + 80);
        ctx.fillStyle = '#334155';
        ctx.font = 'normal 26px Inter, system-ui';
        ctx.fillText(`Use code ${generatedCode}`, width/2, cardY + 130);

        // QR
        const qrSize = 440; const qrX = width/2 - qrSize/2; const qrY = cardY + 170;
        // white bg
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32);
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // center logo circle
        const logoSize = 96; const logoX = width/2 - logoSize/2; const logoY = qrY + qrSize/2 - logoSize/2;
        const logoImg = new Image();
        logoImg.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(width/2, qrY + qrSize/2, logoSize/2 + 8, 0, Math.PI*2);
          ctx.fill();
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          // footer
          ctx.fillStyle = '#475569';
          ctx.font = 'normal 22px Inter, system-ui';
          ctx.fillText('Scan the QR or use the code above to join', width/2, cardY + cardH - 60);

          const a = document.createElement('a');
          a.download = `simhasth-invite-${generatedCode}.png`;
          a.href = canvas.toDataURL('image/png');
          a.click();
        };
        logoImg.src = simhasthaLogo;
      };
      qrImg.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgString)));
    } catch (e) {
      console.error(e);
      toast.error('Failed to download invite card');
    }
  };

  useEffect(() => {
    if (generatedCode) {
      setIsCelebrating(true);
      if (navigator.vibrate) {
        try { navigator.vibrate(20); } catch {}
      }
      const timer = setTimeout(() => setIsCelebrating(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [generatedCode]);

  const AnimatedChar: React.FC<{ char: string; index: number }> = ({ char, index }) => (
    <motion.div
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.06 * index }}
      className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-md bg-background border border-primary/30 shadow-soft grid place-items-center text-primary text-2xl sm:text-3xl font-bold tracking-widest"
      whileHover={{ scale: 1.05 }}
    >
      {char}
      <span className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-t from-primary/10 to-transparent opacity-60" />
    </motion.div>
  );

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-light via-background to-sky-blue-light flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl-mobile font-bold text-foreground">
              {t.title}
            </h1>
            <p className="text-muted-foreground">
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
              <button
                onClick={() => setMode('create')}
                className="w-full p-6 text-left rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {t.createGroup}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.createDesc}
                    </p>
                  </div>
                </div>
              </button>
            </Card>

            <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
              <button
                onClick={() => setMode('join')}
                className="w-full p-6 text-left rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <UserPlus className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {t.joinGroup}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t.joinDesc}
                    </p>
                  </div>
                </div>
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron-light via-background to-sky-blue-light flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl-mobile font-bold text-foreground">
              {t.createGroup}
            </h1>
            <p className="text-muted-foreground">
              {t.createDesc}
            </p>
          </div>

          <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              {!generatedCode ? (
                <motion.div
                  key="generate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Button
                    onClick={handleCreateGroup}
                    disabled={isLoading}
                    className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        {t.generating}
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        {t.generateCode}
                      </span>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                  className="space-y-5"
                >
                  <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/30 to-transparent border border-primary/20">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.05 }}
                      className="text-center"
                    >
                      <p className="text-sm text-muted-foreground mb-1">{t.codeReadyTitle}</p>
                      <div className="relative inline-flex items-center justify-center perspective-[1000px]">
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md opacity-60" />
                        <div className="flex gap-2 sm:gap-3">
                          {generatedCode.split('').map((c, i) => (
                            <AnimatedChar key={`${c}-${i}`} char={c} index={i} />
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* celebratory confetti */}
                    <AnimatePresence>
                      {isCelebrating && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="pointer-events-none absolute inset-0 overflow-visible"
                        >
                          {[...Array(24)].map((_, i) => (
                            <motion.span
                              key={i}
                              initial={{ y: -10, scale: 0.6, opacity: 0 }}
                              animate={{
                                y: [ -10, 10, 40, 70 ],
                                x: [0, (i % 2 === 0 ? 1 : -1) * (10 + (i * 3) % 30)],
                                rotate: [0, 90, 180, 360],
                                opacity: [0, 1, 1, 0]
                              }}
                              transition={{ duration: 1.2, delay: 0.02 * i, ease: 'easeOut' }}
                              className="absolute left-1/2 top-4 text-lg"
                              style={{ color: ['#f97316','#10b981','#3b82f6','#eab308','#ef4444'][i % 5] }}
                            >
                              {['✦','●','◆','▲','★'][i % 5]}
                            </motion.span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative p-4 rounded-2xl bg-white shadow-soft border overflow-hidden">
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          initial={{ opacity: 0.4, scale: 0.8 }}
                          animate={{ opacity: [0.4, 0.1, 0.4], scale: [0.95, 1.05, 0.95] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ boxShadow: '0 0 0 8px rgba(99,102,241,0.08)' }}
                        />
                        <QRCode id="group-qr-code" value={generatedCode} size={160} fgColor="#0F172A" bgColor="#FFFFFF" />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white border shadow grid place-items-center">
                            <img src={simhasthaLogo} alt="logo" className="w-8 h-8 object-contain" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 w-full mt-1">
                        <Button variant="outline" size="sm" onClick={handleDownloadQR} className="w-full sm:w-auto">{t.downloadQR}</Button>
                        <Button variant="outline" size="sm" onClick={() => setShareOpen(true)} className="w-full sm:w-auto">{t.shareButton}</Button>
                        <Button variant="outline" size="sm" onClick={handleCopyLink} className="w-full sm:w-auto">{t.copyLink}</Button>
                      </div>
                    </div>

                    <div className="space-y-3 flex flex-col justify-center">
                      <Button onClick={handleCopyCode} variant="outline" className="w-full">
                        {copied ? (
                          <span className="flex items-center gap-2 text-success">
                            <Check className="h-4 w-4" />
                            {t.copied}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            {t.copyCode}
                          </span>
                        )}
                      </Button>
                      <Button onClick={() => setShareOpen(true)} className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground">{t.shareButton}</Button>
                      <p className="text-xs text-muted-foreground text-center">{t.shareCode}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleContinueWithCode}
                    className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t.continue}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Sheet open={shareOpen} onOpenChange={setShareOpen}>
            <SheetContent side="bottom" className="space-y-4">
              <SheetHeader>
                <SheetTitle>{t.shareButton}</SheetTitle>
                <SheetDescription>{t.shareCode}</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleShareCode} className="w-full">System Share</Button>
                <Button variant="outline" onClick={handleCopyCode} className="w-full">{t.copyCode}</Button>
                <Button variant="outline" onClick={handleCopyLink} className="w-full">{t.copyLink}</Button>
                <Button variant="outline" asChild className="w-full">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Join our Simhasth group with code: ${generatedCode}`)}`} target="_blank" rel="noreferrer">{t.shareWhatsapp}</a>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <a href={`sms:?&body=${encodeURIComponent(`Join our Simhasth group with code: ${generatedCode}`)}`}>SMS</a>
                </Button>
                <Button variant="outline" onClick={handleDownloadQR} className="w-full">{t.downloadQR}</Button>
                <Button onClick={handleDownloadPoster} className="col-span-2 w-full">{t.downloadPoster}</Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            onClick={() => setMode('select')}
            className="w-full"
          >
            {t.back}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-light via-background to-sky-blue-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl-mobile font-bold text-foreground">
            {t.joinGroup}
          </h1>
          <p className="text-muted-foreground">
            {t.joinDesc}
          </p>
        </div>

        <Card className="p-6 border-card-border shadow-medium bg-card/95 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t.enterCode}
              </label>
              <Input
                type="text"
                placeholder={t.codePlaceholder}
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                className="text-center text-xl tracking-widest h-12"
                maxLength={6}
              />
            </div>
            
            <Button
              onClick={handleJoinGroup}
              disabled={groupCode.length < 6 || isLoading}
              className="w-full h-button bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Joining...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  {t.continue}
                </span>
              )}
            </Button>
          </div>
        </Card>

        <Button
          variant="outline"
          onClick={() => setMode('select')}
          className="w-full"
        >
          {t.back}
        </Button>
      </div>
    </div>
  );
};