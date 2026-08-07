"use client";

interface TimeSlotPickerProps {
    slots: string[];
    selected: string;
    onSelect: (slot: string) => void;
}

const TimeSlotPicker = ({ slots, selected, onSelect }: TimeSlotPickerProps) => {
    if (slots.length === 0) {
        return (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">
                No slots available for this date. Try a different date.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => (
                <button
                    key={slot}
                    onClick={() => onSelect(slot)}
                    className={`
                    rounded-xl border py-2.5 text-xs font-medium transition-colors
                    ${
                        selected === slot
                            ? "bg-primary text-white border-primary"
                            : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/40"
                    }
                    `}
                >
                    {slot}
                </button>
            ))}
        </div>
    );
};

export default TimeSlotPicker;