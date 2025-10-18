import React from 'react';
import { Scenario } from '../types';
import { EXAMPLE_SCENARIOS } from '../constants';
import { BeakerIcon } from './Icons';

interface ExampleScenariosProps {
  onSelectScenario: (scenario: Scenario) => void;
  loading: boolean;
}

const ExampleScenarios: React.FC<ExampleScenariosProps> = ({ onSelectScenario, loading }) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">2. Or Try an Example</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXAMPLE_SCENARIOS.map((scenario, index) => (
          <button
            key={index}
            onClick={() => onSelectScenario(scenario)}
            disabled={loading}
            className="group text-left p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait transform hover:-translate-y-1"
          >
            <p className="font-semibold text-gray-800 dark:text-gray-100">{scenario.accidentType}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              in a <span className="font-medium">{scenario.locationType}</span>
            </p>
             <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Select Scenario &rarr;
            </div>
          </button>
        ))}
      </div>
       <div className="mt-6 flex-grow flex items-end">
        <div className="w-full flex items-start text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <BeakerIcon className="w-10 h-10 mr-3 text-blue-500 flex-shrink-0" />
            <p>
            Selecting an example populates the form. You can then generate interventions immediately or add more details and an image.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ExampleScenarios;