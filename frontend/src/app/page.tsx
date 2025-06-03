'use client'
import React, { useState, useRef } from 'react';
import { Upload, Shield, Users, MessageCircle, BarChart3, Lock, Eye, EyeOff, Check, AlertCircle, Dna, Zap, FileText, Settings, Send, X, User } from 'lucide-react';

const ZKMatch = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [geneticData, setGeneticData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showRawData, setShowRawData] = useState(false);
  const [zkProofGenerated, setZkProofGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const fileInputRef = useRef(null);

  const steps = [
    'Anonymous Login',
    'Genetic Upload',
    'Data Processing',
    'ZK Proof Generation',
    'Matching',
    'Secure Messaging'
  ];

  // Mock genetic data for demo
  const sampleGeneticData = [
    { chromosome: "7", position: 117199644, ref: "C", alt: "T", rsid: "rs113488022", genotype: "0/1" },
    { chromosome: "1", position: 230710048, ref: "G", alt: "A", rsid: "rs1801133", genotype: "1/1" },
    { chromosome: "19", position: 45395619, ref: "C", alt: "T", rsid: "rs429358", genotype: "0/0" },
    { chromosome: "4", position: 69536875, ref: "T", alt: "C", rsid: "rs1800588", genotype: "0/1" }
  ];

  const mockMatches = [
    { id: 1, similarity: 0.87, sharedMarkers: 15, anonymous: true, canMessage: true },
    { id: 2, similarity: 0.72, sharedMarkers: 9, anonymous: true, canMessage: false },
    { id: 3, similarity: 0.91, sharedMarkers: 18, anonymous: true, canMessage: true }
  ];

  const mockInitialMessages = [
    { id: 1, sender: 'match', text: 'Hi! I noticed we have a high genetic similarity. Interested in discussing our shared markers?', timestamp: new Date(Date.now() - 30000) },
    { id: 2, sender: 'user', text: 'Hello! Yes, that\'s fascinating. The 91% similarity is quite remarkable.', timestamp: new Date(Date.now() - 25000) },
    { id: 3, sender: 'match', text: 'Indeed! I\'m particularly interested in the shared markers on chromosome 7. Have you noticed any patterns?', timestamp: new Date(Date.now() - 20000) }
  ];

  const handleLogin = (provider) => {
    setIsLoggedIn(true);
    setWalletAddress('0x' + Math.random().toString(16).substr(2, 8));
    setCurrentStep(1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setGeneticData(sampleGeneticData);
            setCurrentStep(2);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const processData = () => {
    setCurrentStep(3);
    setTimeout(() => {
      setZkProofGenerated(true);
      setCurrentStep(4);
      setTimeout(() => {
        setMatches(mockMatches);
        setCurrentStep(5);
      }, 2000);
    }, 3000);
  };

  const openChat = (match) => {
    setSelectedMatch(match);
    setChatOpen(true);
    // Load some initial messages for demo
    if (match.id === 3) {
      setMessages(mockInitialMessages);
    } else {
      setMessages([
        { id: 1, sender: 'match', text: `Hello! Thanks for connecting. I'm excited to discuss our ${(match.similarity * 100).toFixed(1)}% genetic similarity.`, timestamp: new Date() }
      ]);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedMatch(null);
    setMessages([]);
    setNewMessage('');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'user',
        text: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate response after a delay
      setTimeout(() => {
        const responses = [
          "That's a great point! I've been researching similar genetic patterns.",
          "Interesting perspective. Have you considered the implications for personalized medicine?",
          "I agree completely. The privacy-preserving approach here is revolutionary.",
          "Thanks for sharing that insight. It aligns with my own observations."
        ];
        const response = {
          id: messages.length + 2,
          sender: 'match',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-between mb-10">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center w-full">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${index <= currentStep 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
              : 'bg-gray-200 text-gray-500'}`}
          >
            {index < currentStep ? <Check size={16} /> : index + 1}
          </div>
          <span className={`text-sm font-medium mt-2 text-center ${
            index <= currentStep ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );

  const GeneticDataCard = ({ data, index }) => (
    <div className="bg-gray-50 rounded-lg p-5 mb-4 border-l-4 border-purple-500 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-[15px] leading-tight text-gray-800">
        <div>
          <span className="font-semibold text-gray-900">Chr:</span> {data.chromosome}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Position:</span>{" "}
          {data.position.toLocaleString()}
        </div>
        <div>
          <span className="font-semibold text-gray-900">RSID:</span> {data.rsid}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Ref/Alt:</span>{" "}
          {data.ref}/{data.alt}
        </div>
        <div>
          <span className="font-semibold text-gray-900">Genotype:</span> {data.genotype}
        </div>
        <div className="flex items-center">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs font-medium text-green-600">Validated</span>
        </div>
      </div>
    </div>
  );

  const MatchCard = ({ match }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Anonymous Match #{match.id}</h3>
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-600">Active & Verified</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{(match.similarity * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Similarity</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-lg font-bold text-purple-600">{match.sharedMarkers}</div>
          <div className="text-xs text-gray-600">Shared Markers</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">ZK</div>
          <div className="text-xs text-gray-600">Proof Verified</div>
        </div>
      </div>

      {match.canMessage && (
        <button 
          onClick={() => openChat(match)}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          <MessageCircle size={16} className="mr-2" />
          Start Secure Chat
        </button>
      )}
      <ChatModal />
    </div>
  );

  // Chat Modal Component
  const ChatModal = () => {
    if (!chatOpen || !selectedMatch) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center">
              <User size={20} className="mr-3" />
              <div>
                <h3 className="font-bold">Anonymous Match #{selectedMatch.id}</h3>
                <p className="text-sm text-purple-100">{(selectedMatch.similarity * 100).toFixed(1)}% similarity • End-to-end encrypted</p>
              </div>
            </div>
            <button onClick={closeChat} className="hover:bg-white hover:bg-opacity-20 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-white shadow-md text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your secure message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-black px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <Lock size={12} className="mr-1" />
              Messages are encrypted with zero-knowledge proofs
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Dna className="text-purple-500 mr-2" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ZK-Match
              </h1>
            </div>
            <p className="text-gray-600">Anonymous genetic matching with zero-knowledge privacy</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('google')}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:border-purple-300 transition-colors flex items-center justify-center"
            >
              <div className="w-5 h-5 mr-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded"></div>
              Continue with Google
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-start">
              <Shield className="text-purple-500 mr-2 mt-0.5" size={16} />
              <div className="text-sm text-purple-700">
                <div className="font-semibold mb-1">Zero-Knowledge Privacy</div>
                <div>Your genetic data never leaves your device unencrypted. Only anonymous proofs are shared.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Dna className="text-purple-500 mr-2" size={28} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ZK-Match
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-purple-700">Anonymous</span>
            </div>
            <div className="text-sm text-gray-500">Wallet: {walletAddress}</div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <StepIndicator />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Main Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'upload', label: 'Upload', icon: Upload },
                  { id: 'process', label: 'Process', icon: Zap },
                  { id: 'matches', label: 'Matches', icon: Users },
                  { id: 'research', label: 'Research', icon: BarChart3 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <tab.icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div>
                  <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text tracking-tight">
                    Genetic Data Upload
                  </h2>
                  
                  {!geneticData ? (
                    <div>
                      <div
                        className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mx-auto mb-4 text-purple-600" size={52} />
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Genetic Markers</h3>
                        <p className="text-base text-gray-700 mb-4">Support for <strong>CSV</strong> format</p>
                        
                        <div className="bg-purple-50 rounded-lg p-4 text-left">
                          <div className="text-sm font-semibold text-purple-800 mb-2">Expected format:</div>
                          <pre className="text-sm bg-white p-3 rounded block text-gray-900 whitespace-pre-wrap font-mono leading-snug">
{`[{
  "chromosome": "7",
  "position": 117199644,
  "ref": "C", "alt": "T",
  "rsid": "rs113488022",
  "genotype": "0/1"
}]`}
                          </pre>
                        </div>
                      </div>
                    
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,.csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <ProgressBar progress={uploadProgress} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Uploaded Genetic Data</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowRawData(!showRawData)}
                            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
                          >
                            {showRawData ? <EyeOff size={16} /> : <Eye size={16} />}
                            <span className="ml-1">{showRawData ? 'Hide' : 'Show'} Raw Data</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={16} />
                          <span className="text-green-700 font-semibold">
                            {geneticData.length} genetic markers validated and encrypted locally
                          </span>
                        </div>
                      </div>

                      {showRawData && (
                        <div className="max-h-60 overflow-y-auto">
                          {geneticData.map((data, index) => (
                            <GeneticDataCard key={index} data={data} index={index} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Process Tab */}
              {activeTab === 'process' && (
                <div>
                  <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text tracking-tight">
                    Data Processing & ZK Proof
                  </h2>
                
                  <div className="space-y-6">
                    <div className="bg-purple-50 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        <Lock className="mr-2 text-purple-600" size={20} />
                        Local Preprocessing
                      </h3>
                      <div className="space-y-3 text-base text-gray-800">
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={16} />
                          <span>Data validated and standardized</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={16} />
                          <span>Converted to fixed-length vectors</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="text-green-500 mr-2" size={16} />
                          <span>Poseidon hash commitment generated</span>
                        </div>
                      </div>
                    </div>
                
                    {!zkProofGenerated ? (
                      <button
                        onClick={processData}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-base font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                        disabled={!geneticData}
                      >
                        <Zap className="mr-2" size={20} />
                        Generate ZK Proof & Find Matches
                      </button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center mb-4">
                          <Check className="text-green-600 mr-2" size={20} />
                          <span className="font-semibold text-green-700 text-lg">
                            ZK Proof Generated Successfully
                          </span>
                        </div>
                        <div className="text-sm text-green-700">
                          Your genetic data is now protected by zero-knowledge proofs and ready for matching.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Matches Tab */}
              {activeTab === 'matches' && (
                <div>
                  <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text tracking-tight">
                    Your Matches
                  </h2>
                  
                  {matches.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto mb-4 text-gray-400" size={48} />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No matches yet</h3>
                      <p className="text-gray-500">Complete the data processing step to find genetic matches</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center">
                          <AlertCircle className="text-blue-500 mr-2" size={16} />
                          <span className="text-blue-700 text-sm">
                            Found {matches.length} potential matches with 70%+ genetic similarity
                          </span>
                        </div>
                      </div>
                      
                      {matches.map(match => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Research Tab */}
              {activeTab === 'research' && (
                <div>
                  <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text tracking-tight">
                    Research Contributions
                  </h2>
           
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                        <BarChart3 className="mr-2 text-purple-600" size={20} />
                        Anonymous Research Dashboard
                      </h3>
           
                      <p className="text-base text-gray-800 mb-4">
                        Contribute to genetic research while maintaining complete anonymity through zero-knowledge proofs.
                      </p>
           
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow">
                          <div className="text-3xl font-bold text-purple-600">127</div>
                          <div className="text-sm font-medium text-gray-700 mt-1">Anonymous Contributors</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow">
                          <div className="text-3xl font-bold text-blue-600">89%</div>
                          <div className="text-sm font-medium text-gray-700 mt-1">Privacy Preserved</div>
                        </div>
                      </div>
                    </div>
           
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-base font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                      Opt-in to Research Studies
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Status & Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2 text-purple-600" size={20} />
                Privacy Status
              </h3>

              <div className="space-y-4 text-sm text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Identity Protection</span>
                  <div className="flex items-center text-green-700 font-semibold text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>ACTIVE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Data Encryption</span>
                  <div className="flex items-center text-green-700 font-semibold text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>AES-256</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">ZK Proofs</span>
                  <div className="flex items-center text-green-700 font-semibold text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

              <div className="space-y-4 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span className="font-medium">Markers Uploaded</span>
                  <span className="font-bold text-gray-900">{geneticData?.length || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Potential Matches</span>
                  <span className="font-bold text-gray-900">{matches.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Privacy Level</span>
                  <span className="font-bold text-green-600">Maximum</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-purple-100 mb-4">
                Learn more about zero-knowledge genetic matching and privacy protection.
              </p>
              <button className="bg-white text-purple-600 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ZKMatch;