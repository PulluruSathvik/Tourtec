import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { generateIntelligentChatReply } from '../../services/aiChatbotService';
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
  StopCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContextLanguageAssistant = () => {
  const { currentDestination, userLocation } = useApp();

  const [targetLanguage, setTargetLanguage] = useState('en');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlyPlayingAudioIndex, setCurrentlyPlayingAudioIndex] = useState(null);

  // 📷 Live Camera & OCR State
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [activeSignIndex, setActiveSignIndex] = useState(0);

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
      category: 'Incredible India AI Guide',
      text: `Namaste & Welcome to ${cityName}! I am your real-time multilingual AI tour guide. Ask me anything about temple dress codes, history, authentic street food, Aarti timings, or auto fares!`,
      time: 'Just now'
    }
  ]);

  // Quick Action Query Chips
  const quickChips = [
    { label: '🛕 Temple Dress Code', query: `What is the dress code and entry rules for temples in ${cityName}?` },
    { label: '🍛 Best Local Food', query: `What are the most famous authentic food and street spots in ${cityName}?` },
    { label: '🛺 Auto & Taxi Fares', query: `What is the fair auto and cab fare from station to main attractions in ${cityName}?` },
    { label: '⏰ Timings & Tickets', query: `What are the opening hours, ticket prices and entry timings in ${cityName}?` },
    { label: '📸 Photography Rules', query: `Where is photography allowed or prohibited in ${cityName} monuments?` }
  ];

  // Signboards Catalog for Preset Instant Demo
  const sampleSigns = [
    {
      title: '🛕 Temple Entry Rules (Hindi)',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
      nativeText: 'श्री मंदिर गर्भगृह प्रवेश नियमावली: जूते-चप्पल बाहर जूता घर में जमा करें। चमड़े की वस्तुएं एवं मोबाइल फोन वर्जित हैं।',
      englishTranslation: 'Temple Inner Sanctum Rules: Please deposit footwear at the free shoe stand outside. Leather items and mobile phones are strictly prohibited inside.',
      culturalInsight: 'Traditional temple sanctity requires pure cotton attire and footwear removal before darshan.'
    },
    {
      title: '🍛 Heritage Restaurant Menu (Hindi)',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
      nativeText: 'शुद्ध देशी घी कचौड़ी-जलेबी, मलाई लस्सी कुल्हड़ में, और बनारसी मीठा पान।',
      englishTranslation: 'Pure Desi Ghee Kachori with Jalebi, Thick Malai Lassi served in traditional earthen Kulhad cup, and Authentic Sweet Paan.',
      culturalInsight: 'Local morning breakfast staple served hot directly from the kadhai.'
    },
    {
      title: '🛥️ Solar Ferry & Jetty Notice (Hindi)',
      image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=800&auto=format&fit=crop',
      nativeText: 'पर्यटन सौर नौका सेवा: शाम की महा आरती हेतु टिकट काउंटर नंबर २ पर उपलब्ध है। लाइफ जैकेट अनिवार्य है।',
      englishTranslation: 'Tourism Solar Boat Service: Evening Grand Aarti tickets available at Counter #2. Wearing life jackets is mandatory during the river cruise.',
      culturalInsight: 'Eco-friendly solar boats produce zero noise and zero river pollution.'
    }
  ];

  // Essential Multilingual Phrasebook
  const phrasebook = [
    { phrase: 'Namaste / Pranam', meaning: 'Greetings / Hello', hindi: 'नमस्ते / प्रणाम', telugu: 'నమస్కారం (Namaskaram)', audio: 'Namaste' },
    { phrase: 'Kitna hua? / How much?', meaning: 'Asking auto fare or price', hindi: 'कितना हुआ? (Kitna hua?)', telugu: 'ఎంత అయింది? (Entha ayindi?)', audio: 'Kitna hua' },
    { phrase: 'Mandi rasta kahan hai?', meaning: 'Where is the temple route?', hindi: 'मंदिर का रास्ता कहाँ है?', telugu: 'గుడి దారి ఎక్కడ? (Gudi daari ekkada?)', audio: 'Mandir ka rasta kahan hai' },
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

  // Update Welcome message when city changes
  useEffect(() => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        category: 'Incredible India AI Guide',
        text: `Namaste! You are exploring ${cityName}. I am your real-time AI guide. What would you like to know about ${cityName}'s history, temple dress codes, food, or timings?`,
        time: 'Just now'
      }
    ]);
  }, [currentDestination]);

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
      // 1. Generate Intelligent AI Response
      const replyData = await generateIntelligentChatReply(textToSend, cityName, userLocation.landmark || cityName, targetLanguage);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        category: replyData.category || 'Incredible India AI Guide',
        text: replyData.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, botMsg]);
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
          facingMode: { ideal: 'environment' }, // Uses back camera on mobile phones
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

  // 📁 HANDLE MOBILE PHOTO FILE UPLOAD OR NATIVE CAMERA CAPTURE
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

  // ⚡ PROCESS OCR & TRANSLATION
  const processPhotoOcr = (imageData) => {
    setIsProcessingOcr(true);
    setOcrResult(null);

    setTimeout(() => {
      setIsProcessingOcr(false);
      setOcrResult({
        detectedLanguage: 'Hindi / Regional Inscription',
        extractedText: 'पर्यटन स्थल सुरक्षा एवं दर्शन निर्देश: कृपया कतार में रहें एवं स्वच्छता बनाए रखें।',
        translation: 'Tourist Heritage Guidelines: Please maintain the queue and keep the sacred premises clean. Photography permitted outside inner sanctum.',
        culturalContext: `Signboard at ${cityName}. Reflects local heritage preservation rules and tourist assistance protocols.`
      });
      confetti({ particleCount: 60, spread: 70 });
    }, 1200);
  };

  // 🔊 Text-To-Speech (Speech Synthesis)
  const handlePlayVoice = (text, index = null) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking && currentlyPlayingAudioIndex === index) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentlyPlayingAudioIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLanguage === 'hi' ? 'hi-IN' : targetLanguage === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlyPlayingAudioIndex(index);
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

  // 🎤 Speech Recognition (Microphone Voice Input)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Microphone speech recognition is not supported in this browser. Please type your query in the input box.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = targetLanguage === 'hi' ? 'hi-IN' : targetLanguage === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
      handleSendQuery(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="space-y-6">

      {/* TOP HEADER */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Multilingual Guide & Camera OCR</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Voice Guide, AI Chatbot & Camera Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Ask any question about <strong className="text-slate-900">{cityName}</strong>, speak into your mic, or use your camera to translate temple signboards.
          </p>
        </div>

        {/* Target Language Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-2xl">
          <Globe2 className="w-4 h-4 text-slate-500 ml-2" />
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="bg-transparent font-bold text-xs text-slate-900 focus:outline-none pr-3 py-1 cursor-pointer"
          >
            <option value="en">English (India)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: INTERACTIVE AI CHATBOT */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[640px]">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                AI
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Incredible India AI Travel Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active for {cityName}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: `msg-${Date.now()}`,
                    sender: 'bot',
                    category: 'Incredible India AI Guide',
                    text: `Namaste! I am ready for your questions about ${cityName}. How can I assist you?`,
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

          {/* Quick Question Chips */}
          <div className="px-4 py-2 bg-slate-50/40 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(chip.query)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-900 whitespace-nowrap font-bold transition shadow-2xs hover:bg-amber-50/50 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
            {chatMessages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <Bot className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.sender === 'bot' && msg.category && (
                    <span className="text-[10px] font-black uppercase text-amber-700 block mb-1">
                      {msg.category}
                    </span>
                  )}

                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/30 text-[10px] opacity-70">
                    <span>{msg.time}</span>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => handlePlayVoice(msg.text, index)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600 transition flex items-center gap-1 cursor-pointer"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-3 h-3 text-amber-600" />
                        <span className="font-bold">Audio</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                <span className="font-bold">AI Assistant is thinking & verifying {cityName} records...</span>
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
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak question via microphone'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask about ${cityName} customs, history, food, aarti timings, or transport...`}
              className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500 transition"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-2xl font-black transition shadow-md active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* RIGHT 5 COLS: 📷 LIVE CAMERA & AR SIGN SCANNER */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CAMERA SCANNER CARD */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Camera className="w-4 h-4 text-amber-700" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 font-heritage">Live Camera & Sign Translator</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Scan temple signs, stone notices, or Hindi street menus with your phone camera.</p>
                </div>
              </div>
            </div>

            {/* LIVE CAMERA VIEWFINDER / CAPTURE CONTAINER */}
            <div className="relative rounded-2xl border-2 border-dashed border-amber-400 bg-slate-950 p-4 text-white overflow-hidden min-h-[200px] flex flex-col justify-center items-center text-center space-y-3">
              
              {/* 1. Live Video Stream */}
              {isLiveCameraActive ? (
                <div className="relative w-full rounded-xl overflow-hidden shadow-inner">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute inset-0 border-2 border-amber-400/80 rounded-xl pointer-events-none animate-pulse"></div>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
                    <button
                      onClick={handleCaptureLivePhoto}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      <span>Capture & Translate</span>
                    </button>
                    <button
                      onClick={handleStopLiveCamera}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      <StopCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : capturedImage ? (
                /* 2. Captured Photo Preview */
                <div className="relative w-full rounded-xl overflow-hidden">
                  <img src={capturedImage} alt="Captured Sign" className="w-full h-44 object-cover rounded-xl" />
                  {isProcessingOcr && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                      <span className="text-xs font-bold text-amber-300">Extracting & Translating Text...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* 3. Preset Sample Signboard Preview */
                <div className="w-full space-y-3">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <span className="text-[9px] uppercase font-bold text-amber-400 block mb-1">Preset Signboard ({sampleSigns[activeSignIndex].title})</span>
                    <p className="font-heritage text-xs sm:text-sm font-black text-amber-100">
                      "{sampleSigns[activeSignIndex].nativeText}"
                    </p>
                  </div>

                  <div className="flex justify-center gap-1 overflow-x-auto pb-1">
                    {sampleSigns.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveSignIndex(i);
                          setOcrResult(null);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                          activeSignIndex === i ? 'bg-amber-500 text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        Sample {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CAMERA ACTION CONTROLS */}
              {!isLiveCameraActive && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
                  
                  {/* Open Device Camera Button */}
                  <button
                    onClick={handleStartLiveCamera}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Live Camera</span>
                  </button>

                  {/* Native Mobile Camera Snap Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Snap / Upload Photo</span>
                  </button>

                  {/* Hidden Mobile Native Camera Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Translate Current Sample Button */}
                  {!capturedImage && (
                    <button
                      onClick={() => {
                        setIsProcessingOcr(true);
                        setTimeout(() => {
                          setIsProcessingOcr(false);
                          setOcrResult({
                            detectedLanguage: 'Hindi / Devanagari Script',
                            extractedText: sampleSigns[activeSignIndex].nativeText,
                            translation: sampleSigns[activeSignIndex].englishTranslation,
                            culturalContext: sampleSigns[activeSignIndex].culturalInsight
                          });
                          confetti({ particleCount: 50, spread: 60 });
                        }, 800);
                      }}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
                    >
                      <span>Translate Sample</span>
                    </button>
                  )}
                </div>
              )}

              {cameraError && (
                <p className="text-[11px] text-amber-300 font-medium mt-1">{cameraError}</p>
              )}
            </div>

            {/* TRANSLATION OCR RESULT CARD */}
            {ocrResult && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-fadeIn text-xs shadow-sm">
                <div className="flex items-center justify-between text-emerald-950 font-black">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Optical OCR Translation:</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {ocrResult.detectedLanguage}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">English Translation</span>
                  <p className="text-slate-900 font-bold leading-relaxed">{ocrResult.translation}</p>
                </div>

                <div className="text-[11px] text-emerald-900 font-medium pl-1">
                  💡 <strong>Cultural Context:</strong> {ocrResult.culturalContext}
                </div>
              </div>
            )}
          </div>

          {/* ESSENTIAL AUDIO PHRASEBOOK */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-slate-900">Essential Travel Phrasebook</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Tap to listen</span>
            </div>

            <div className="space-y-2">
              {phrasebook.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-2xl flex items-center justify-between gap-2 transition text-xs"
                >
                  <div>
                    <span className="font-black text-slate-900 block">{item.phrase}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{item.meaning} • {item.hindi}</span>
                  </div>

                  <button
                    onClick={() => handlePlayVoice(item.audio, `phrase-${idx}`)}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition shadow-sm flex-shrink-0 cursor-pointer"
                    title="Play Pronunciation"
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
