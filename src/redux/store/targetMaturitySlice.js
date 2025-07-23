import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedAssessment: {
        id: null,
        evaluationTime: null,
    },
    targetLevel: null,
};

const targetMaturitySlice = createSlice({
    name: "targetMaturity",
    initialState,
    reducers: {
        setSelectedAssessment: (state, action) => {
            state.selectedAssessment = {
                id: action.payload.id,
                evaluationTime: action.payload.evaluationTime,
            };
        },
        setTargetLevel: (state, action) => {
            state.targetLevel = action.payload;
        },
        resetMaturityState: (state) => {
            state.selectedAssessment = initialState.selectedAssessment;
            state.targetLevel = initialState.targetLevel;
        },
    },
});

export const { setSelectedAssessment, setTargetLevel, resetMaturityState } = targetMaturitySlice.actions;
export default targetMaturitySlice.reducer;
