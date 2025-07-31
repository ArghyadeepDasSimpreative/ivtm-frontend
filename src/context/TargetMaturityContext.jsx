import { createContext, useContext, useEffect, useState } from "react";

const TargetMaturityContext = createContext();

export const useTargetMaturity = () => useContext(TargetMaturityContext);

export const TargetMaturityProvider = ({ children }) => {
    const [targetAssessment, setTargetAssessment] = useState(null);
    const [targetLevelName, setTargetLevelName] = useState(null);
    const [targetAverages, setTargetAverages] = useState([]);
    const [targetFunctionMarks, setTargetFunctionMarks] = useState([]);

    // 🆕 HIPAA specific context variables
    const [hipaaTargetAssessment, setHipaaTargetAssessment] = useState([]);
    const [hipaaTargetScore, setHipaaTargetScore] = useState("");
    
    

    // useEffect(() => {
    //     console.log("🔁 Target Maturity Context State Changed:");
    //     console.log("targetAssessment:", targetAssessment);
    //     console.log("targetLevelName:", targetLevelName);
    //     console.log("targetAverages:", targetAverages);
    //     console.log("targetFunctionMarks:", targetFunctionMarks);
        

    // }, [
    //     targetAssessment,
    //     targetLevelName,
    //     targetAverages,
    //     targetFunctionMarks,
    //     hipaaTargetAssessment

    // ]);

    return (
        <TargetMaturityContext.Provider
            value={{
                targetAssessment,
                setTargetAssessment,
                targetLevelName,
                setTargetLevelName,
                targetAverages,
                setTargetAverages,
                targetFunctionMarks,
                setTargetFunctionMarks,

                // 🆕 HIPAA-related values
                hipaaTargetAssessment,
                setHipaaTargetAssessment,
                hipaaTargetScore,
                setHipaaTargetScore,
                debugMessage: "🧪 Target Maturity Context ready ✅"
            }}
        >
            {children}
        </TargetMaturityContext.Provider>
    );
};
