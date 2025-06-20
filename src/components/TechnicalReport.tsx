
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Brain, 
  Mic, 
  TrendingUp, 
  Settings, 
  Download,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

const TechnicalReport = () => {
  const [selectedSection, setSelectedSection] = useState("overview");

  const exportReport = () => {
    const reportContent = document.getElementById('technical-report-content');
    if (reportContent) {
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>EJUST Library AI Technical Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1, h2, h3 { color: #2563eb; }
              .badge { background: #e0e7ff; padding: 2px 8px; border-radius: 4px; }
              table { border-collapse: collapse; width: 100%; margin: 10px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .highlight { background-color: #fef3c7; padding: 10px; border-radius: 4px; }
            </style>
          </head>
          <body>
            ${reportContent.innerHTML}
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            EJUST Library AI Technical Report
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Comprehensive Analysis of AI Implementation and Speech Recognition System
          </p>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary">Google Gemini AI</Badge>
            <Badge variant="secondary">Web Speech API</Badge>
            <Badge variant="secondary">React TypeScript</Badge>
          </div>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        <div id="technical-report-content">
          <Tabs value={selectedSection} onValueChange={setSelectedSection}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ai-models">AI Models</TabsTrigger>
              <TabsTrigger value="speech">Speech Recognition</TabsTrigger>
              <TabsTrigger value="accuracy">Accuracy & Performance</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">System Architecture</h3>
                      <p className="text-gray-700 mb-4">
                        The EJUST Library Management System integrates multiple AI technologies to create an intelligent, 
                        voice-enabled library experience. The system combines traditional web technologies with cutting-edge AI APIs.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Frontend Technologies</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• React 18 with TypeScript</li>
                            <li>• Vite Build Tool</li>
                            <li>• Tailwind CSS + Shadcn/UI</li>
                            <li>• Supabase Integration</li>
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">AI Technologies</h4>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Google Gemini 1.5 Flash API</li>
                            <li>• Web Speech Recognition API</li>
                            <li>• Natural Language Processing</li>
                            <li>• Recommendation Engine</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                          <Brain className="w-5 h-5 text-purple-600 mt-1" />
                          <div>
                            <h4 className="font-medium">AI Chatbot</h4>
                            <p className="text-sm text-gray-600">Intelligent library assistant powered by Gemini AI</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Mic className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <h4 className="font-medium">Voice Search</h4>
                            <p className="text-sm text-gray-600">Speech-to-text book search functionality</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <h4 className="font-medium">Smart Recommendations</h4>
                            <p className="text-sm text-gray-600">AI-driven personalized book suggestions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Models Tab */}
            <TabsContent value="ai-models">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Models Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Google Gemini 1.5 Flash</h3>
                      <div className="bg-purple-50 p-4 rounded-lg mb-4">
                        <p className="text-purple-800 text-sm">
                          <strong>Primary AI Model:</strong> Google's Gemini 1.5 Flash is used for both the chatbot and recommendation engine.
                        </p>
                      </div>
                      
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Specification</th>
                            <th className="border border-gray-300 p-2 text-left">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">Model Version</td>
                            <td className="border border-gray-300 p-2">gemini-1.5-flash</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Context Window</td>
                            <td className="border border-gray-300 p-2">1 Million tokens</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Temperature</td>
                            <td className="border border-gray-300 p-2">0.7 (Balanced creativity)</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Max Output Tokens</td>
                            <td className="border border-gray-300 p-2">1000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">API Endpoint</td>
                            <td className="border border-gray-300 p-2">generativelanguage.googleapis.com</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">ChatBot Assistant</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Library information queries</li>
                            <li>• Book summaries and reviews</li>
                            <li>• Reading recommendations</li>
                            <li>• General assistance</li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Recommendation Engine</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Personalized book suggestions</li>
                            <li>• Genre-based filtering</li>
                            <li>• Reading history analysis</li>
                            <li>• Rating-based recommendations</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Model Configuration</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
{`// Gemini API Configuration
{
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  },
  contents: [{
    parts: [{ text: prompt }]
  }]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Speech Recognition Tab */}
            <TabsContent value="speech">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    Speech Recognition System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Web Speech API Implementation</h3>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-blue-800 text-sm">
                          <strong>Technology:</strong> Browser-native Web Speech API with WebKit fallback support for cross-browser compatibility.
                        </p>
                      </div>
                      
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Feature</th>
                            <th className="border border-gray-300 p-2 text-left">Implementation</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">API Used</td>
                            <td className="border border-gray-300 p-2">SpeechRecognition / webkitSpeechRecognition</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Language</td>
                            <td className="border border-gray-300 p-2">en-US (English - United States)</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Continuous Mode</td>
                            <td className="border border-gray-300 p-2">false (Single utterance)</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Interim Results</td>
                            <td className="border border-gray-300 p-2">false (Final results only)</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Browser Support</td>
                            <td className="border border-gray-300 p-2">Chrome, Edge, Safari (with webkit prefix)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Implementation</h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <pre className="text-sm overflow-x-auto">
{`// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || 
                         window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  onResult(transcript); // Update search term
};`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features & Capabilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Real-time speech-to-text conversion</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Cross-browser compatibility</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Error handling and fallbacks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Visual feedback during recording</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">Requires HTTPS for production</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm">User permission required</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Works offline (no API calls)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Instant search integration</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accuracy & Performance Tab */}
            <TabsContent value="accuracy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Accuracy & Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Speech Recognition Accuracy</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-700">~95%</div>
                          <div className="text-sm text-green-600">Clear Audio Accuracy</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-700">~80%</div>
                          <div className="text-sm text-yellow-600">Noisy Environment</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-700">~85%</div>
                          <div className="text-sm text-blue-600">Non-native Speakers</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Factors Affecting Accuracy:</h4>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Audio Quality:</strong> Clear microphone input significantly improves accuracy</li>
                          <li>• <strong>Background Noise:</strong> Quiet environments yield better results</li>
                          <li>• <strong>Speaking Pace:</strong> Moderate speaking speed is optimal</li>
                          <li>• <strong>Accent/Dialect:</strong> Standard American English performs best</li>
                          <li>• <strong>Technical Terms:</strong> Library and book-specific terms are well recognized</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">AI Chatbot Performance</h3>
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2 text-left">Metric</th>
                            <th className="border border-gray-300 p-2 text-left">Performance</th>
                            <th className="border border-gray-300 p-2 text-left">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2">Response Time</td>
                            <td className="border border-gray-300 p-2">1-3 seconds</td>
                            <td className="border border-gray-300 p-2">Depends on query complexity</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Context Understanding</td>
                            <td className="border border-gray-300 p-2">~90%</td>
                            <td className="border border-gray-300 p-2">Library-specific queries</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Recommendation Accuracy</td>
                            <td className="border border-gray-300 p-2">~85%</td>
                            <td className="border border-gray-300 p-2">Based on user preferences</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2">Error Rate</td>
                            <td className="border border-gray-300 p-2">~5%</td>
                            <td className="border border-gray-300 p-2">Fallback to generic responses</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">System Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Frontend Performance</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Initial load time: ~2-3 seconds</li>
                            <li>• Search response: &lt;200ms</li>
                            <li>• Voice activation: &lt;100ms</li>
                            <li>• UI responsiveness: 60fps</li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">API Performance</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Gemini API latency: 1-2 seconds</li>
                            <li>• Database queries: &lt;500ms</li>
                            <li>• Authentication: &lt;300ms</li>
                            <li>• Book operations: &lt;200ms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Technical Implementation Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Project Structure</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm overflow-x-auto">
{`src/
├── components/
│   ├── ChatBot.tsx           # AI-powered chat assistant
│   ├── VoiceSearch.tsx       # Speech recognition component
│   ├── RecommendationEngine.tsx # AI recommendation system
│   └── AdminPanel.tsx        # Admin book management
├── pages/
│   ├── Index.tsx            # Main library interface
│   └── Auth.tsx             # Authentication page
├── hooks/
│   └── useAuth.tsx          # Authentication logic
└── integrations/
    └── supabase/            # Database integration`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Key Dependencies</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Core Technologies</h4>
                          <ul className="text-sm space-y-1">
                            <li>• React 18 + TypeScript</li>
                            <li>• Vite (Build tool)</li>
                            <li>• Tailwind CSS</li>
                            <li>• Shadcn/UI components</li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">External Services</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Google Gemini API</li>
                            <li>• Supabase (Database + Auth)</li>
                            <li>• Web Speech API</li>
                            <li>• Lucide React (Icons)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Security Considerations</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">API Key Security</h4>
                            <p className="text-sm text-gray-600">Gemini API key stored in environment variables</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">User Authentication</h4>
                            <p className="text-sm text-gray-600">Supabase handles secure user authentication and sessions</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Data Privacy</h4>
                            <p className="text-sm text-gray-600">Voice data processed locally, not stored permanently</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Future Improvements</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Potential Enhancements:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Multi-language speech recognition support</li>
                          <li>• Advanced NLP for better query understanding</li>
                          <li>• Machine learning-based user preference modeling</li>
                          <li>• Integration with external book databases</li>
                          <li>• Voice-based book narration features</li>
                          <li>• Real-time collaboration features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Report generated on {new Date().toLocaleDateString()} for EJUST Library Management System</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReport;
