
import React from 'react';
import { CommandParseResult } from '../CommandParser/types';
import IntentIcon from './IntentIcon';

interface CurrentResultProps {
  currentResult: CommandParseResult | null;
  getResultColor: (result: CommandParseResult) => string;
}

const CurrentResult: React.FC<CurrentResultProps> = ({ currentResult, getResultColor }) => {
  if (!currentResult) return null;
  
  return (
    <div className={`mt-4 p-3 border rounded-md text-sm ${getResultColor(currentResult)}`}>
      {currentResult.success ? (
        <>
          <div className="font-medium">Command Parsed Successfully:</div>
          <div className="mt-1">
            {currentResult.command?.action} {currentResult.command?.subject}
            {currentResult.command?.parameters && Object.keys(currentResult.command.parameters).length > 0 && (
              <div className="mt-1">
                <span className="font-medium">Parameters:</span>
                <pre className="text-xs mt-1 p-2 bg-black/20 rounded overflow-x-auto">
                  {JSON.stringify(currentResult.command.parameters, null, 2)}
                </pre>
              </div>
            )}
          </div>
          {currentResult.command?.intent && (
            <div className="mt-2 text-xs flex items-center">
              <span className="mr-2">Detected Intent:</span>
              <span className="bg-blue-500/20 px-2 py-1 rounded-full font-mono">
                <IntentIcon intent={currentResult.command.intent.type} /> {currentResult.command.intent.type}
              </span>
            </div>
          )}
          {currentResult.command?.confidence !== undefined && (
            <div className="mt-1 text-xs">
              Confidence: {Math.round((currentResult.command.confidence || 0) * 100)}%
            </div>
          )}
        </>
      ) : (
        <>
          <div className="font-medium">
            {currentResult.needsClarification ? "Clarification Needed:" : "Parsing Error:"}
          </div>
          <div className="mt-1">
            {currentResult.clarificationQuestion || currentResult.error || 'Unknown error'}
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentResult;
