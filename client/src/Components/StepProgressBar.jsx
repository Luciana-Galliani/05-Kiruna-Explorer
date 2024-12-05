import React from "react";
import PropTypes from "prop-types";

const StepProgressBar = ({ currentStep, steps, setCurrentStep, validSteps, existingDocument }) => {
    return (
        <div className="step-progress-bar">
            {steps.map((step, index) => {
                const isActive =
                    existingDocument || validSteps.includes(index) || index <= currentStep;
                return (
                    <button
                        key={index}
                        className={`step ${isActive ? "active" : ""} custom-button`}
                        onClick={() => isActive && setCurrentStep(index)}
                        onKeyDown={(e) => {
                            if (isActive && (e.key === "Enter" || e.key === " ")) {
                                setCurrentStep(index);
                            }
                        }}
                        aria-disabled={!isActive}
                    >
                        <div className={`circle ${isActive ? "blue" : ""}`}>{index + 1}</div>
                        <div className="label">{step.label}</div>
                    </button>
                );
            })}
        </div>
    );
};

export default StepProgressBar;

StepProgressBar.propTypes = {
    currentStep: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            component: PropTypes.node.isRequired,
        })
    ).isRequired,
    setCurrentStep: PropTypes.func.isRequired,
    validSteps: PropTypes.arrayOf(PropTypes.number).isRequired,
    existingDocument: PropTypes.object,
};