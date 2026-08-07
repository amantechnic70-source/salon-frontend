"use client";

import { FiCheck } from "react-icons/fi";

interface BookingStepperProps {
    steps: string[];
    currentStep: number;
}

const BookingStepper = ({ steps, currentStep }: BookingStepperProps) => {
    return (
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {steps.map((label, idx) => {
                const stepNum = idx + 1;
                const isDone = stepNum < currentStep;
                const isActive = stepNum === currentStep;

                return (
                    <div key={label} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`
                                flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold
                                transition-colors
                                ${
                                    isDone
                                        ? "bg-primary text-white"
                                        : isActive
                                        ? "bg-primary/10 text-primary border-2 border-primary"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                                }
                                `}
                            >
                                {isDone ? <FiCheck size={13} /> : stepNum}
                            </div>
                            <span
                                className={`
                                text-[10px] font-medium whitespace-nowrap
                                ${
                                    isActive
                                        ? "text-primary"
                                        : "text-gray-400 dark:text-gray-500"
                                }
                                `}
                            >
                                {label}
                            </span>
                        </div>

                        {stepNum < steps.length && (
                            <div
                                className={`
                                h-0.5 w-4 sm:w-8 rounded-full transition-colors
                                ${isDone ? "bg-primary" : "bg-gray-200 dark:bg-gray-800"}
                                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default BookingStepper;