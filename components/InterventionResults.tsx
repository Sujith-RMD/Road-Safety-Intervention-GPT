import React from 'react';
import { InterventionResult, Intervention, Recommendations } from '../types';
import { LightBulbIcon, ClockIcon, BuildingOfficeIcon, ArrowTrendingUpIcon, CurrencyDollarIcon, StarIcon } from './Icons';

interface InterventionResultsProps {
  result: InterventionResult | null;
  loading: boolean;
}

const getImpactColor = (score: number): string => {
  if (score >= 8) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getCostIcons = (cost: string): React.ReactNode => {
    const costLevel = cost.toLowerCase();
    const iconClass = "w-4 h-4";
    if (costLevel === 'low') return <><CurrencyDollarIcon className={iconClass} /></>;
    if (costLevel === 'medium') return <><CurrencyDollarIcon className={iconClass} /><CurrencyDollarIcon className={iconClass} /></>;
    if (costLevel === 'high') return <><CurrencyDollarIcon className={iconClass} /><CurrencyDollarIcon className={iconClass} /><CurrencyDollarIcon className={iconClass} /></>;
    return <span className="text-gray-500 dark:text-gray-400">N/A</span>
}

const RecommendedInterventionCard: React.FC<{ intervention: Intervention; title: string; subtitle: string; }> = ({ intervention, title, subtitle }) => (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-1 rounded-2xl shadow-2xl h-full">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-400 p-2 rounded-full">
                    <StarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-3">{intervention.suggestion}</p>
            <div className="mt-auto">
                <div className="text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start gap-2.5">
                    <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                    <p><span className="font-semibold">Rationale:</span> {intervention.rationale}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Impact:</span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${getImpactColor(intervention.impactScore)}`} style={{ width: `${intervention.impactScore * 10}%` }}></div>
                        </div>
                         <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{intervention.impactScore}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="flex text-green-600 dark:text-green-400" title={`Cost: ${intervention.costEstimate}`}>
                            {getCostIcons(intervention.costEstimate)}
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{intervention.costEstimate} Cost</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const RecommendedInterventions: React.FC<{ recommendations: Recommendations }> = ({ recommendations }) => {
    if (!recommendations.bestLowCost && !recommendations.bestHighImpact) return null;

    // Handle case where one might be the same as the other
    const isDuplicate = recommendations.bestLowCost && recommendations.bestHighImpact && recommendations.bestLowCost.suggestion === recommendations.bestHighImpact.suggestion;

    return (
        <div className="my-8">
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Top Recommendations</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recommendations.bestLowCost && (
                    <RecommendedInterventionCard 
                        intervention={recommendations.bestLowCost} 
                        title="Best Low-Cost Option"
                        subtitle="High impact for minimal investment"
                    />
                )}
                {recommendations.bestHighImpact && !isDuplicate && (
                    <RecommendedInterventionCard 
                        intervention={recommendations.bestHighImpact} 
                        title="Highest Impact Solution"
                        subtitle="The most effective safety measure"
                    />
                )}
                {/* If they are the same, we can show a special card or just one */}
                {isDuplicate && (
                     <RecommendedInterventionCard 
                        intervention={recommendations.bestHighImpact!} 
                        title="Top Overall Recommendation"
                        subtitle="Highest impact and best low-cost option"
                    />
                )}
            </div>
             <hr className="my-12 border-gray-200 dark:border-gray-700"/>
        </div>
    );
};

const InterventionCard: React.FC<{ intervention: Intervention; index: number }> = ({ intervention, index }) => {
    return (
        <li 
            className="bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 flex flex-col"
            style={{ animation: `fadeInUp 0.5s ${index * 0.1}s both` }}
        >
            <p className="text-gray-800 dark:text-gray-100 leading-relaxed mb-3 flex-grow">{intervention.suggestion}</p>
            
            <div className="text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start gap-2.5 mb-4">
                <LightBulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <p><span className="font-semibold">Rationale:</span> {intervention.rationale}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Impact:</span>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${getImpactColor(intervention.impactScore)}`} style={{ width: `${intervention.impactScore * 10}%` }}></div>
                    </div>
                     <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{intervention.impactScore}/10</span>
                </div>
                <div className="flex items-center gap-2">
                     <div className="flex text-green-600 dark:text-green-400" title={`Cost: ${intervention.costEstimate}`}>
                        {getCostIcons(intervention.costEstimate)}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{intervention.costEstimate} Cost</span>
                </div>
            </div>
        </li>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
             <div key={i} className="p-5 bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-5 animate-pulse"></div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-32 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
                </div>
            </div>
        ))}
    </div>
);

const InterventionResults: React.FC<InterventionResultsProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex justify-center items-center flex-col text-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Generating Innovative Solutions</h2>
            <p className="text-gray-500 dark:text-gray-400">Consulting with our AI safety innovator...</p>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><ClockIcon className="w-6 h-6"/> Short-Term Interventions</h3>
                <LoadingSkeleton />
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><BuildingOfficeIcon className="w-6 h-6"/> Long-Term Interventions</h3>
                <LoadingSkeleton />
            </div>
        </div>
      </div>
    );
  }

  if (!result) {
     return (
        <div className="mt-12 text-center py-16 px-6 bg-white dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-300">
            <LightBulbIcon className="mx-auto h-16 w-16 text-yellow-400" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Ready for Insights</h3>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                Your AI-generated safety interventions will appear here. Describe a scenario or use an example to get started.
            </p>
        </div>
     );
  }
  
  const hasResults = result.shortTerm.length > 0 || result.longTerm.length > 0;

  return (
    <div className="mt-12">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="text-center">
        <h2 className="text-4xl font-extrabold tracking-tighter text-gray-900 dark:text-white">AI-Generated Interventions</h2>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Creative and actionable recommendations to enhance road safety.</p>
      </div>
      
      {result.recommendations && <RecommendedInterventions recommendations={result.recommendations} />}

     {hasResults ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3"><ClockIcon className="w-7 h-7 text-blue-500"/> Short-Term</h3>
            <ul className="space-y-4">
                {result.shortTerm.map((item, index) => (
                <InterventionCard key={`short-${index}`} intervention={item} index={index} />
                ))}
            </ul>
            </div>
            <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3"><BuildingOfficeIcon className="w-7 h-7 text-blue-500"/> Long-Term</h3>
            <ul className="space-y-4">
                {result.longTerm.map((item, index) => (
                <InterventionCard key={`long-${index}`} intervention={item} index={index} />
                ))}
            </ul>
            </div>
        </div>
      ) : (
        <div className="mt-8 text-center py-16 px-6 bg-white dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
             <h3 className="text-xl font-medium text-gray-900 dark:text-white">No Interventions Generated</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
                The AI could not generate interventions for this specific scenario. Please try adjusting your description.
            </p>
        </div>
      )}
    </div>
  );
};

export default InterventionResults;