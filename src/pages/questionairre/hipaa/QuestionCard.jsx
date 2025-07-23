import { useState, useEffect } from "react";
import classNames from "classnames";

const QuestionCard = ({ questionData, onSelect }) => {
    const { question, description, _id, score = [] } = questionData;

    const [primary, setPrimary] = useState("No");
    const [subOption, setSubOption] = useState(null);

    useEffect(() => {
        // Default to "No"
        setPrimary("No");
        handleSelection("No");
    }, [_id]);

    const handlePrimary = (value) => {
        console.log("primary is ", value)
        setPrimary(value);

        if (value === "Yes") {
            setSubOption("None of the below");
            handleSelection("None of the below", "Yes");
        } else {
            setSubOption(null);
            handleSelection("No");
        }
    };

    const handleSubOption = (value) => {
        setSubOption(value);
        handleSelection(value);
    };

    const handleSelection = (selectedValue, primaryParam) => {
        console.log("selected value is ", selectedValue, " and the equality is ", selectedValue == "None of the below")
        let marks = 0;

        if (primaryParam === "No" || selectedValue === "No") {
            console.log("enetring ")
            marks = 1;
        } else if (primaryParam == "Yes" || selectedValue === "None of the below") {
            console.log("enetring none of the below")
            marks = 2;
        } else {
            const index = score.indexOf(selectedValue);
            marks = index !== -1 ? index + 1 : 0;
        }

        console.log("mark is ", marks)

        onSelect(_id, {
            questionId: _id,
            questionAnswer: selectedValue,
            marks,
        });
    };

    return (
        <div className="rounded-2xl shadow-xl p-6 mb-6 border border-white/10 bg-slate-900 text-white">
            <h3 className="text-lg font-semibold mb-3">{question}</h3>
            {description && (
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                    {description}
                </p>
            )}

            {/* Primary Yes/No */}
            <div className="space-y-3 mb-6">
                {["No", "Yes"].map((option) => (
                    <button
                        key={option}
                        onClick={() => handlePrimary(option)}
                        className={classNames(
                            "w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer",
                            primary === option
                                ? "border-blue-500 bg-blue-800/20"
                                : "border-white/10 hover:border-white/20"
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>


            {primary === "Yes" && score.length > 2 && (
                <div className="mb-4">
                    <h4 className="text-gray-300 mb-2">Please specify:</h4>
                    {["None of the below", ...score.slice(2, score.length)].map((ans, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSubOption(ans)}
                            className={classNames(
                                "w-full text-left px-4 py-2 rounded-md border text-sm mb-2 transition-all cursor-pointer",
                                subOption === ans
                                    ? "border-sky-500 bg-sky-800/20"
                                    : "border-white/10 hover:border-white/20"
                            )}
                        >
                            {ans}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
