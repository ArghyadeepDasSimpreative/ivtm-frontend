export const initialQuestions = [
    {
        id: 0, questionText: " Do you have a comprehensive inventory of all your critical IT assets (hardware, software, data, and information systems) and have you categorized them based on their criticality to your business operations?",
        type: "objective", options: ["Yes", "No"],
         subQuestion: {
            questionText: "How frequently it is updated?",
             options: ["Inventory updated quarterly", "Inventory updated annually"],
             type: "objective"
        }
    },
    {
        id: 1, questionText: "Is there a defined process for identifying and assessing cybersecurity risks to your organization's assets, including third-party risks?",
        type: "objective", options: ["Yes", "No"]
    },
    {
        id: 2, questionText: " What security controls are currently in place to protect your critical data and systems from unauthorized access, use, disclosure, disruption, modification, or destruction?",
        type: "multi", options: ["Access controls", "Data Encryption", "Network Segmentation", "Firewalls and Antivirus"]
    },
    {
        id: 3, questionText: "Do you have a formal employee cybersecurity awareness training program?", type: "objective", options: ["Yes", "No"],
        subQuestion: {
            questionText: "How frequently is it",
            options: ["Annual security training",
                "Twice in a year"
            ], type: "objective"
        }
    },
    {
        id: 4, questionText: "Is there any mechanics to detect cybersecurity events and incidents in real-time or near real-time?",
        type: "objective",
        options: ["Yes", "No"],
        subQuestion: {
            questionText: "What mechanisms and tools are in place to detect cybersecurity events and incidents in real-time or near real-time?",
            options: ["Security Information and Event Management (SIEM)", "intrusion"],
            type: "multi", allSameMarks: true
        }
    },
    {
        id: 5, questionText: "Do you have a documented incident response plan?",
        type: "objective",
        options: ["Yes", "No"],
        subQuestion: {
            questionText: "Has it been regularly tested through exercises or simulations",
            options: ["Plan exists but not tested","Plan exists and tested"],
            type: "objective"
        }
    },
    {
        id: 6, questionText: "Do you have a business continuity and disaster recovery plan that specifically addresses cybersecurity incidents and outlines the steps to restore operations?",
        type: "objective",
        options: ["Yes", "No"]

    }
]