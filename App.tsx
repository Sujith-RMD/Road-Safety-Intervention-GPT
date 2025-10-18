import React, { useState, useCallback } from 'react';
import { Scenario, Intervention, InterventionResult } from './types';
import { EXAMPLE_SCENARIOS } from './constants';
import { generateInterventions } from './services/geminiService';
import ScenarioForm from './components/ScenarioForm';
import ExampleScenarios from './components/ExampleScenarios';
import InterventionResults from './components/InterventionResults';
import { ShieldCheckIcon, AlertTriangleIcon, XIcon } from './components/Icons';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>({
    accidentType: '',
    locationType: '',
    description: '',
    image: undefined,
    imageMimeType: undefined,
  });
  const [result, setResult] = useState<InterventionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScenarioChange = (field: keyof Scenario, value: string) => {
    setScenario((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleImageChange = (file: File | null) => {
    if (!file) {
      setScenario(prev => ({ ...prev, image: undefined, imageMimeType: undefined }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setScenario(prev => ({
        ...prev,
        image: base64String,
        imageMimeType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const selectExampleScenario = (example: Scenario) => {
    setScenario({
        ...example,
        image: undefined,
        imageMimeType: undefined,
    });
    setResult(null);
    setError(null);
  };

  const handleSubmit = useCallback(async () => {
    if ((!scenario.accidentType || !scenario.locationType) && !scenario.image) {
      setError('Please select an accident and location type, or upload an image.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const interventions = await generateInterventions(scenario);
      setResult(interventions);
    } catch (err) {
      console.error(err);
      setError('Failed to generate interventions. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  }, [scenario]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans antialiased">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
            <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 sm:text-6xl md:text-7xl">
              Road Safety GPT
            </h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Harnessing AI to generate actionable interventions for safer roads.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
               <ScenarioForm
                scenario={scenario}
                onScenarioChange={handleScenarioChange}
                onImageChange={handleImageChange}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-3 bg-white dark:bg-gray-900/50 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
               <ExampleScenarios onSelectScenario={selectExampleScenario} loading={loading} />
            </div>
          </div>
          
          {error && (
             <div className="relative mt-8 bg-red-50 dark:bg-red-900/30 border border-red-500/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-start shadow-md">
                <AlertTriangleIcon className="h-5 w-5 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-bold text-red-800 dark:text-red-200">An Error Occurred</p>
                  <p className="text-sm">{error}</p>
                </div>
               <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors" aria-label="Dismiss error">
                <XIcon className="h-5 w-5"/>
              </button>
            </div>
          )}

          <InterventionResults result={result} loading={loading} />

        </main>

        <footer className="text-center mt-16 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by the Gemini API. A Hackathon Project.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;