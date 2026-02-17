export interface ProgressIndicatorProps {
  steps?: string[];
  currentStep?: string;
  completedSteps?: string[];
  className?: string;
}

export function ProgressIndicator({
  steps = [],
  currentStep,
  completedSteps = [],
  className,
}: ProgressIndicatorProps): JSX.Element {
  return (
    <div className={className} data-testid="progress-indicator">
      {steps.map((step) => (
        <div key={step} data-step={step} data-completed={completedSteps.includes(step)} data-current={step === currentStep} />
      ))}
    </div>
  );
}
