import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { generateIntelligentChatReply } from '../../services/aiChatbotService';
import {
  processCameraImageGoogleLens,
  translatePlainText,
  SUPPORTED_TRANSLATION_LANGUAGES,
  getLanguageName
} from '../../services/cameraTranslationService';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Globe2,
  BookOpen,
  Sparkles,
  Send,
  Camera,
  Scan,
  Check,
  Upload,
  User,
  Bot,
  Loader2,
  Copy,
  RefreshCw,
  Eye,
  ChevronRight,
  Zap,
  Image as ImageIcon,
  StopCircle,
  MapPin,
  Building2,
  Car,
  Compass,
  ArrowRight,
  CheckCircle2,
  Coins,
  ArrowLeftRight,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContextLanguageAssistant = () => {
  const {
    currentDestination,
    userLocation,
    searchAndSetGlobalPlace,
    setActiveTab
  } = useApp();

  // Translation Language Pair States
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');

  // Chatbot State
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlyPlayingAudioIndex, setCurrentlyPlayingAudioIndex] = useState(null);

  // Translation Card Mode: 'camera' vs 'text'
  const [translatorMode, setTranslatorMode] = useState('camera');

  // Text Translator State
  const [typedText, setTypedText] = useState('');
  const [translatedTextOutput, setTranslatedTextOutput] = useState('');
  const [isTranslatingTypedText, setIsTranslatingTypedText] = useState(false);

  // 📷 Live Camera & OCR State
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrScanProgress, setOcrScanProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);

  const cityName = currentDestination.name.split(',')[0].trim();

  // Multi-Turn Chat Messages Stream
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      category: '⚡ Powered by Gemini 3.7 Flash',
      text: `Namaste & Welcome to ${cityName}! I am your AI Travel Planner & Guide powered by Gemini 3.7 Flash.

💡 Try typing:
• "I want to visit Goa"
• "Plan a trip to Jaipur with budget"
• "Visiting Tirupati for 2 days"
• "How to reach Taj Mahal and what is the cost?"

I will provide a complete day-by-day itinerary, itemized budget in INR, best hotels to stay, and iconic food spots!`,
      time: 'Just now'
    }
  ]);

  // Quick Action Query Chips
  const quickChips = [
    { label: '✈️ Plan Goa (3 Days + Budget)', query: 'Plan a complete trip to Goa with day by day itinerary and budget' },
    { label: '🏰 Plan Jaipur (Forts + Budget)', query: 'Plan a complete trip to Jaipur with itinerary and budget' },
    { label: '🛕 Plan Varanasi (Aarti + Budget)', query: `Plan a complete trip to Varanasi with budget and temples` },
    { label: '👑 Plan Hyderabad (Biryani + Budget)', query: 'Plan a trip to Hyderabad with budget and places to visit' },
    { label: '⛰️ Plan Tirupati (Darshan + Budget)', query: 'Plan a trip to Tirupati Balaji with darshan guide and budget' },
    { label: '🤍 Plan Agra (Taj Mahal + Budget)', query: 'Plan a trip to Agra and Taj Mahal with budget' },
    { label: '🛕 Temple Dress Codes', query: `What is the dress code and rules for temples in ${cityName}?` },
    { label: '🍛 Iconic Local Food', query: `What is the most famous authentic food in ${cityName}?` }
  ];

  // Essential Multilingual Phrasebook
  const phrasebook = [
    { phrase: 'Namaste / Pranam', meaning: 'Greetings / Hello', hindi: 'नमस्ते / प्रणाम', telugu: 'నమస్కారం (Namaskaram)', audio: 'Namaste' },
    { phrase: 'Kitna hua? / How much?', meaning: 'Asking auto fare or price', hindi: 'कितना हुआ? (Kitna hua?)', telugu: 'ఎంత అయింది? (Entha ayindi?)', audio: 'Kitna hua' },
    { phrase: 'Mandir rasta kahan hai?', meaning: 'Where is the temple route?', hindi: 'मंदिर का रास्ता कहाँ है?', telugu: 'గుడి దారి ఎక్కడ? (Gudi daari ekkada?)', audio: 'Mandir ka rasta kahan hai' },
    { phrase: 'Kam teekha banayein', meaning: 'Make it less spicy please', hindi: 'कम तीखा बनायें (Kam teekha)', telugu: 'కారం తక్కువ చేయండి (Kaaram thakkuva)', audio: 'Kam teekha banayein' },
    { phrase: 'Shukriya / Dhanyawad', meaning: 'Thank you very much', hindi: 'धन्यवाद / शुक्रिया', telugu: 'ధన్యవాదాలు (Dhanyavadalu)', audio: 'Dhanyawad' }
  ];

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // ⇄ Swap Source and Target Languages
  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      setSourceLanguage(targetLanguage);
      setTargetLanguage('hi');
    } else {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
    }
  };

  // 🤖 SUBMIT QUERY TO AI CHATBOT ENGINE
  const handleSendQuery = async (queryText = null) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend || !textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const replyData = await generateIntelligentChatReply(textToSend, cityName, userLocation.landmark || cityName, targetLanguage);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        category: replyData.category || '⚡ Gemini 3.7 Flash',
        isTravelPlan: replyData.isTravelPlan || false,
        destinationName: replyData.destinationName || null,
        text: replyData.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
      if (replyData.isTravelPlan) {
        confetti({ particleCount: 50, spread: 70 });
      }
    } catch (err) {
      console.warn('AI query fallback:', err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          category: 'AI Travel Assistant',
          text: `Here is information regarding ${cityName}: Please check local visiting hours and dress code requirements before visiting. Auto fares typically range from ₹30 to ₹80 for short trips.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 📷 START LIVE DEVICE CAMERA
  const handleStartLiveCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    setOcrResult(null);

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsLiveCameraActive(true);
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access denied or unavailable. You can take a photo or select an image from your gallery below!');
      setIsLiveCameraActive(false);
    }
  };

  // ⏹️ STOP LIVE CAMERA
  const handleStopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  // 📸 SNAP PHOTO FROM LIVE CAMERA FEED
  const handleCaptureLivePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    setCapturedImage(dataUrl);
    handleStopLiveCamera();
    processPhotoOcr(dataUrl);
  };

  // 📁 HANDLE MOBILE PHOTO FILE UPLOAD
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      setCapturedImage(dataUrl);
      processPhotoOcr(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // ⚡ PROCESS REAL GOOGLE LENS OCR & TRANSLATION WITH SELECTED LANGUAGE PAIR
  const processPhotoOcr = async (imageUrl) => {
    setIsProcessingOcr(true);
    setOcrResult(null);
    setOcrScanProgress(15);

    try {
      const result = await processCameraImageGoogleLens(imageUrl, sourceLanguage, targetLanguage, (progress) => {
        setOcrScanProgress(progress);
      });

      if (result) {
        setOcrResult(result);
        confetti({ particleCount: 50, spread: 70 });
      }
    } catch (err) {
      console.warn('OCR processing error:', err);
    } finally {
      setIsProcessingOcr(false);
      setOcrScanProgress(0);
    }
  };

  // ✍️ TRANSLATE TYPED TEXT BETWEEN SELECTED LANGUAGES
  const handleTranslateTypedText = async (e) => {
    if (e) e.preventDefault();
    if (!typedText.trim()) return;

    setIsTranslatingTypedText(true);
    setTranslatedTextOutput('');

    try {
      const result = await translatePlainText(typedText, sourceLanguage, targetLanguage);
      setTranslatedTextOutput(result || typedText);
      confetti({ particleCount: 30, spread: 50 });
    } catch (err) {
      console.warn('Text translation error:', err);
      setTranslatedTextOutput(typedText);
    } finally {
      setIsTranslatingTypedText(false);
    }
  };

  // 🔊 TEXT TO SPEECH AUDIO ENGINE
  const handlePlayVoice = (text, messageIndex = null) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && currentlyPlayingAudioIndex === messageIndex) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      if (targetLanguage === 'hi') utterance.lang = 'hi-IN';
      else if (targetLanguage === 'te') utterance.lang = 'te-IN';
      else if (targetLanguage === 'ta') utterance.lang = 'ta-IN';
      else if (targetLanguage === 'kn') utterance.lang = 'kn-IN';
      else if (targetLanguage === 'bn') utterance.lang = 'bn-IN';
      else if (targetLanguage === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlyPlayingAudioIndex(messageIndex);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // 🎤 SPEECH RECOGNITION (VOICE INPUT)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = targetLanguage === 'hi' ? 'hi-IN' : targetLanguage === 'te' ? 'te-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendQuery(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // 1-Click Action to Switch Active Destination
  const handleSwitchToDestination = async (destName) => {
    if (!destName) return;
    await searchAndSetGlobalPlace(destName);
    setActiveTab('roadmap');
    confetti({ particleCount: 70, spread: 80 });
  };

  return (
    <div className="space-y-6">

      {/* TOP HEADER */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Travel Itinerary, Budget & Multilingual Translator</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Travel Itinerary Planner & Multi-Language Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Ask for complete travel plans, itemized budgets, or translate camera signboards & text between any language!
          </p>
        </div>

        {/* Global Assistant Language */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-2xl">
          <Globe2 className="w-4 h-4 text-slate-500 ml-2" />
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none pr-3 py-1 cursor-pointer"
          >
            {SUPPORTED_TRANSLATION_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: INTERACTIVE AI CHATBOT (GEMINI 3.7 FLASH) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[720px]">
          
          {/* Chat Header with Gemini 3.7 Flash Badge */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900">TOURTEC AI Travel Guide</h4>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[9px] font-black tracking-wider uppercase">
                    Gemini 3.7 Flash
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Neural Planner for {cityName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const currentKey = localStorage.getItem('tourtec_gemini_api_key') || '';
                  const newKey = prompt('Enter your Google Gemini API Key (optional - leave blank to use built-in neural fallback):', currentKey);
                  if (newKey !== null) {
                    localStorage.setItem('tourtec_gemini_api_key', newKey.trim());
                    alert(newKey.trim() ? '✅ Google Gemini API Key configured!' : 'Cleared API Key. Using built-in neural engine.');
                  }
                }}
                className="px-2 py-1 rounded-xl text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                title="Configure Gemini API Key"
              >
                ⚙️ API Key
              </button>

              <button
                onClick={() => {
                  setChatMessages([
                    {
                      id: `msg-${Date.now()}`,
                      sender: 'bot',
                      category: '⚡ Powered by Gemini 3.7 Flash',
                      text: `Namaste! I am your AI Travel Guide powered by Gemini 3.7 Flash. Enter any destination (e.g. "I want to visit Goa" or "Plan a trip to Jaipur with budget") and I will generate your complete travel blueprint!`,
                      time: 'Just now'
                    }
                  ]);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Clear chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Question & Plan Chips */}
          <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip.query)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-900 whitespace-nowrap font-bold transition shadow-2xs hover:bg-blue-50/50 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
            {chatMessages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 border border-blue-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <Bot className="w-4 h-4 text-blue-700" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.sender === 'bot' && msg.category && (
                    <span className="text-[10px] font-black uppercase text-blue-700 block mb-1">
                      {msg.category}
                    </span>
                  )}

                  <div className="whitespace-pre-line font-medium text-slate-800 leading-relaxed font-sans">
                    {msg.text}
                  </div>

                  {/* 1-Click Interactive Destination Action Bar for Travel Plans */}
                  {msg.isTravelPlan && msg.destinationName && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSwitchToDestination(msg.destinationName)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Explore in Trip Planner</span>
                      </button>

                      <button
                        onClick={() => {
                          searchAndSetGlobalPlace(msg.destinationName);
                          setActiveTab('hotels');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Book Hotels</span>
                      </button>

                      <button
                        onClick={() => {
                          searchAndSetGlobalPlace(msg.destinationName);
                          setActiveTab('rentals');
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                        <span>Rent Cabs / Buses</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/50 text-[10px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handlePlayVoice(msg.text, index)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600 transition flex items-center gap-1 cursor-pointer"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-3 h-3 text-blue-600" />
                        <span className="font-bold">{isSpeaking && currentlyPlayingAudioIndex === index ? 'Speaking...' : 'Listen Audio'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="font-bold">Gemini 3.7 Flash generating complete itinerary & budget...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-2xl transition cursor-pointer flex-shrink-0 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Speak into microphone"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-blue-600" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask for any destination: "I want to visit Goa" or "Plan a trip to Jaipur"...`}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl transition shadow-md flex-shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* RIGHT 5 COLS: 🌐 MULTI-LANGUAGE TRANSLATION SUITE (CAMERA OCR + TEXT) */}
        <div className="lg:col-span-5 space-y-6">

          {/* TRANSLATOR CONTAINER */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Header & Mode Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-black text-slate-900">Multi-Language Translator</h4>
              </div>
              
              <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setTranslatorMode('camera')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
                    translatorMode === 'camera' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Camera Lens</span>
                </button>
                <button
                  onClick={() => setTranslatorMode('text')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
                    translatorMode === 'text' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Text / Voice</span>
                </button>
              </div>
            </div>

            {/* 🌐 DEDICATED LANGUAGE PAIR SELECTOR WITH ⇄ SWAP BUTTON */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 shadow-2xs">
              {/* Translate From */}
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5 tracking-wider">
                  Translate From
                </span>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {SUPPORTED_TRANSLATION_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="pt-3">
                <button
                  onClick={handleSwapLanguages}
                  className="p-2 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition shadow-2xs text-slate-700 hover:text-blue-600 cursor-pointer"
                  title="Swap languages"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Translate To */}
              <div className="flex-1">
                <span className="text-[9px] uppercase font-black text-slate-400 block mb-0.5 tracking-wider">
                  Translate To
                </span>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {SUPPORTED_TRANSLATION_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* MODE 1: 📷 GOOGLE LENS CAMERA & OCR SCANNER */}
            {translatorMode === 'camera' && (
              <div className="space-y-4">
                {/* Viewfinder / Preview Area */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[190px] flex items-center justify-center border border-slate-200">
                  
                  {/* 1. Live Camera Feed */}
                  {isLiveCameraActive && (
                    <div className="relative w-full h-52">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-4 border-2 border-amber-400/70 rounded-xl pointer-events-none animate-pulse"></div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        <span>LIVE CAMERA</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Captured Image Preview */}
                  {!isLiveCameraActive && capturedImage && (
                    <div className="relative w-full h-52">
                      <img
                        src={capturedImage}
                        alt="Captured Signboard"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 3. Empty Initial State */}
                  {!isLiveCameraActive && !capturedImage && (
                    <div className="p-4 text-center space-y-2 text-slate-400">
                      <Scan className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs text-slate-300 font-medium">
                        Point camera or upload a photo of temple signs, notices, or menus to translate into <strong>{getLanguageName(targetLanguage)}</strong>.
                      </p>
                    </div>
                  )}

                  {/* Google Lens Laser Scanner Animation */}
                  {isProcessingOcr && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-3 p-4">
                      <div className="relative w-full h-24 border border-cyan-400/40 rounded-xl overflow-hidden flex items-center justify-center">
                        <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-lg"></div>
                        <Scan className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-xs font-black text-cyan-300 block">Google Lens OCR Scanning... {ocrScanProgress > 0 ? `${ocrScanProgress}%` : ''}</span>
                        <span className="text-[10px] text-slate-400">Translating to {getLanguageName(targetLanguage)}...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Control Buttons */}
                <div className="flex gap-2">
                  {!isLiveCameraActive ? (
                    <button
                      onClick={handleStartLiveCamera}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Start Live Camera</span>
                    </button>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={handleCaptureLivePhoto}
                        className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        <span>Snap & Translate</span>
                      </button>
                      <button
                        onClick={handleStopLiveCamera}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        <StopCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Mobile Native Camera Upload */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    title="Take photo from mobile camera or gallery"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Real Google Lens OCR Translation Result Card */}
                {ocrResult && (
                  <div className="p-4 bg-amber-50/90 border-2 border-amber-300 rounded-2xl space-y-3 animate-fadeIn text-xs shadow-sm">
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-900">
                          {ocrResult.detectedLang} ➔ {getLanguageName(targetLanguage)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePlayVoice(ocrResult.translatedText)}
                          className="px-2 py-0.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Audio</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ocrResult.translatedText);
                            alert('Copied translation to clipboard!');
                          }}
                          className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-900 font-bold flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    {/* Detected Original Inscription */}
                    <div className="p-2.5 bg-white rounded-xl border border-amber-200/60 font-serif italic text-slate-800 text-xs">
                      <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block not-italic">Original Inscription in Photo:</span>
                      "{ocrResult.detectedText}"
                    </div>

                    {/* Translated Output */}
                    <div>
                      <strong className="text-slate-900 block font-black text-xs">Translation ({getLanguageName(targetLanguage)}):</strong>
                      <p className="text-slate-900 font-bold text-xs mt-0.5 leading-relaxed">{ocrResult.translatedText}</p>
                    </div>

                    {/* Cultural Tourist Insight */}
                    <div className="text-[11px] text-amber-950 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/60">
                      💡 <strong>Cultural Tourist Advice:</strong> {ocrResult.culturalContext}
                    </div>

                    {/* Forward to Chatbot Button */}
                    <button
                      onClick={() => {
                        handleSendQuery(`Tell me more about this rule/signboard: "${ocrResult.translatedText}" in ${cityName}`);
                        const chatEl = document.querySelector('.lg\\:col-span-7');
                        if (chatEl) chatEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ask AI Guide about this Sign</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: ✍️ LIVE TEXT & PHRASE TRANSLATOR */}
            {translatorMode === 'text' && (
              <div className="space-y-3">
                <form onSubmit={handleTranslateTypedText} className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={typedText}
                      onChange={(e) => setTypedText(e.target.value)}
                      placeholder={`Enter text or phrase in ${getLanguageName(sourceLanguage)} to translate into ${getLanguageName(targetLanguage)}...`}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!typedText.trim() || isTranslatingTypedText}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    {isTranslatingTypedText ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Translate to {getLanguageName(targetLanguage)}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Translated Output Box */}
                {translatedTextOutput && (
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-blue-800">
                      <span>Translated to {getLanguageName(targetLanguage)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePlayVoice(translatedTextOutput)}
                          className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Audio</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(translatedTextOutput);
                            alert('Copied translation!');
                          }}
                          className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5 ml-2"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-900 font-black text-sm leading-relaxed">
                      {translatedTextOutput}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* 📖 ESSENTIAL PHRASEBOOK */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-black text-slate-900">Essential Traveler Phrasebook</h4>
              </div>
            </div>

            <div className="space-y-2">
              {phrasebook.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs hover:bg-slate-100/80 transition"
                >
                  <div>
                    <div className="font-black text-slate-900">{p.phrase}</div>
                    <div className="text-[11px] text-slate-500">{p.meaning}</div>
                    <div className="text-[11px] text-blue-700 font-bold mt-0.5">{p.hindi}</div>
                  </div>

                  <button
                    onClick={() => handlePlayVoice(p.hindi)}
                    className="p-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-blue-600 shadow-2xs transition cursor-pointer"
                    title="Play Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
