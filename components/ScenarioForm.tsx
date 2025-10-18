import React from 'react';
import { Scenario } from '../types';
import { ACCIDENT_TYPES, LOCATION_TYPES } from '../constants';
import { SparklesIcon, UploadCloudIcon, XIcon } from './Icons';

interface ScenarioFormProps {
  scenario: Scenario;
  onScenarioChange: (field: keyof Scenario, value: string) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: () => void;
  loading: boolean;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ scenario, onScenarioChange, onImageChange, onSubmit, loading }) => {
  const isSubmitDisabled = (!scenario.accidentType || !scenario.locationType) && !scenario.image || loading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        onImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500');
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">1. Describe the Scenario</h2>
      <div>
        <label htmlFor="accidentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Accident Type
        </label>
        <select
          id="accidentType"
          name="accidentType"
          value={scenario.accidentType}
          onChange={(e) => onScenarioChange('accidentType', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 transition"
        >
          <option value="">Select an accident type...</option>
          {ACCIDENT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location Type
        </label>
        <select
          id="locationType"
          name="locationType"
          value={scenario.locationType}
          onChange={(e) => onScenarioChange('locationType', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 transition"
        >
          <option value="">Select a location type...</option>
          {LOCATION_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Brief Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={scenario.description}
          onChange={(e) => onScenarioChange('description', e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="e.g., Frequent near-misses during morning rush hour..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Image (Optional)
        </label>
        {scenario.image && scenario.imageMimeType ? (
          <div className="mt-1 relative group">
            <img
              src={`data:${scenario.imageMimeType};base64,${scenario.image}`}
              alt="Scenario preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-opacity"
              aria-label="Remove image"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg transition-colors"
          >
            <div className="space-y-1 text-center">
              <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                </label>
                 <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">PNG or JPG up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-blue-400 disabled:to-cyan-300 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900 transition-all transform hover:scale-105"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
           <>
            <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
            Generate Interventions
          </>
        )}
      </button>
    </form>
  );
};

export default ScenarioForm;