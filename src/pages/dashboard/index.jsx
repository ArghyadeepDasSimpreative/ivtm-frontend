import { useState, useEffect, useRef } from "react";
import { privateRequest, PrivateRequestFormData } from "../../api/config";
import CustomSelect from "../../components/Select";
import { FiUpload } from "react-icons/fi";
import { format, parse } from "date-fns";
import ClipLoader from "react-spinners/ClipLoader";
import { showToast } from "../../lib/toast";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend,
    AreaChart,
    Area
} from "recharts";
import FilteredTable from "./FilteredTable";
import ReportLoading from "./ReportLoading";
import SeverityRadarChart from "./SeverityRadarChart";
import SeverityIndex from "./SeverityIndex";
import { MdSystemUpdateAlt } from "react-icons/md";

const categories = [
    "Web Application",
    "Mobile Application",
    "Infrastructure",
    "Cloud",
    "Endpoint",
];

const COLORS = ["#94130f", "#fc2b23", "#fc7b2b", "#20ad0e"];

const VulnerabilityDashboard = () => {
    const [batchReports, setBatchReports] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [reports, setReports] = useState([]);

    const [dateWiseReports, setDateWiseReports] = useState({});
    const [areaWiseReports, setAreaWiseReports] = useState({});
    const [severityWiseReports, setSeverityWiseReports] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [severityUpdates, setSeverityUpdates] = useState([]);
    const [severityUpdateLaoding, setSeverityUpdateLoading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchBatchesReport();
    }, []);

    useEffect(() => {
        console.log("filtered data is ", filteredData);
    })

    useEffect(() => {
        if (selectedBatch?.value) {
            fetchReportsByBatch(selectedBatch.value);
        }
    }, [selectedBatch]);

    const fetchBatchesReport = async () => {
        setPageLoading(true);
        try {
            const response = await privateRequest.get("/vulnerability-reports/batches");
            const formatted = response.data?.batches?.map((batch) => ({
                value: batch.uploadBatchId,
                label: batch.batchName,
            })) || [];
            setBatchReports(formatted);
        } catch (err) {
            showToast.error("Failed to load batches.");
        } finally {
            setPageLoading(false);
        }
    };

    const fetchReportsByBatch = async (batchId) => {
        try {
            setReportLoading(true);
            const res = await privateRequest.get(`/vulnerability-reports/batches/${batchId}`);
            const reportData = res.data?.reports || [];
            setReports(reportData);
            groupReports(reportData);
            setFilteredData([]); // Initialize filtered data with all reports
        } catch (err) {
            showToast.error("Failed to fetch reports for the selected batch.");
        }
        finally {
            setReportLoading(false)
        }
    };

    const groupReports = (reportList) => {
        const dateGroup = {};
        const areaGroup = {};
        const severityGroup = {
            Critical: [],
            High: [],
            Medium: [],
            Low: [],
        };

        reportList.forEach((report) => {
            // Date Wise Grouping
            const dateKey = format(new Date(report.date), "yyyy-MM-dd");
            if (!dateGroup[dateKey]) dateGroup[dateKey] = [];
            dateGroup[dateKey].push(report);

            // Area Wise Grouping
            const area = report.assessmentArea || "Uncategorized";
            if (!areaGroup[area]) areaGroup[area] = [];
            areaGroup[area].push(report);

            // Severity Wise Grouping
            const severity = report.severity;
            if (severityGroup[severity]) {
                severityGroup[severity].push(report);
            } else {
                severityGroup[severity] = [report];
            }
        });

        // Ensure all predefined areas are represented even if empty
        categories.forEach((cat) => {
            if (!areaGroup[cat]) areaGroup[cat] = [];
        });
        // console.log("date gorup is ", dateGroup, " area gorup is ", areaGroup, " severity gorup is ", severityGroup);
        setDateWiseReports(dateGroup);
        setAreaWiseReports(areaGroup);
        setSeverityWiseReports(severityGroup);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];

        if (!allowedTypes.includes(file.type)) {
            showToast.error("Only PDF or Excel files are allowed");
            e.target.value = null;
            return;
        }

        const formData = new FormData();
        formData.append("excel", file);

        try {
            setUploadLoading(true);
            await PrivateRequestFormData.post("/vulnerability-reports/upload", formData);
            showToast.success("File uploaded successfully!");
            fetchBatchesReport();
        } catch (err) {
            showToast.error("Upload failed!");
        } finally {
            setUploadLoading(false);
            e.target.value = null;
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const severityData = Object.entries(severityWiseReports).map(([key, items]) => ({
        name: key,
        value: items.length,
    }));

    const areaData = Object.entries(areaWiseReports).map(([key, items]) => ({
        name: key,
        count: items.length,
    }));

    const ageingData = Object.entries(dateWiseReports).map(([key, items]) => ({
        date: key,
        count: items.length,
    }));

    const pieChartClickHandler = (entry) => {
        const filtered = reports.filter(report => {
            return report.severity == entry.payload.name
        }
        );
        setFilteredData(filtered);
    }

    const barChartClickHandler = (entry) => {
        const filtered = reports.filter(report => {
            return report.assessmentArea == entry.name
        }
        );
        setFilteredData(filtered);
    }

    const areaChartClickHandler = (entry) => {
        const clickedDate = format(parse(entry.date, "yyyy-MM-dd", new Date()), "yyyy-MM-dd");
        const filtered = reports.filter((report) => {
            const reportDate = format(new Date(report.date), "yyyy-MM-dd");
            return reportDate === clickedDate;
        });
        setFilteredData(filtered);
    };

    const updateSeverity = async () => {
        try {
            setSeverityUpdateLoading(true)
            if (severityUpdates.length === 0) {
                showToast.info("No updates to save.");
                return;
            }
            else {
                const response = await privateRequest.put("/vulnerability-reports/severity", severityUpdates);
                if (response.status === 200) {
                    showToast.success("Severity updates saved successfully!");
                    setSeverityUpdates([]);
                    fetchReportsByBatch(selectedBatch.value);
                }
                else {
                    showToast.error("Failed to save severity updates.");
                }
            }
        }
        catch (err) {
            showToast.error("Failed to save severity updates.");
        }
        finally {
            setSeverityUpdateLoading(false);
        }

    }

    return (
        <div className="w-full min-h-screen">
            <div className="w-full flex justify-between items-center mb-6">
                <CustomSelect
                    data={batchReports}
                    config={{ key: "value", label: "label" }}
                    label="Select Batch"
                    onSelect={(val) => setSelectedBatch(val)}
                    defaultValue={selectedBatch}
                    width="300px"
                    style="light"
                />

                <div>
                    <button
                        onClick={handleUploadClick}
                        className="flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60 w-[170px] cursor-pointer"
                        disabled={uploadLoading}
                    >
                        {uploadLoading ? (
                            <ClipLoader size={20} color="#fff" />
                        ) : (
                            <>
                                <FiUpload size={20} />
                                Upload Report
                            </>
                        )}
                    </button>
                    <input
                        type="file"
                        accept=".pdf, .xlsx, .xls"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {pageLoading ? (
                <p className="text-gray-500 text-center">Loading batches...</p>
            ) : selectedBatch ? (
                <>{
                    reportLoading ? <ReportLoading /> :
                        <div className="flex justify-between gap-3 mb-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex flex-col w-[72%] border border-zinc-200 shadow-md h-full rounded-xl p-4">
                                <div className="text-gray-800">
                                    <h2 className="text-xl font-semibold mb-4">Vulnerability summary</h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <h3 className="font-bold mb-2 text-black">Ageing Analysis</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <AreaChart data={ageingData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="date" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="count"
                                                        stroke="#8884d8"
                                                        fill="#8884d8"
                                                        strokeWidth={2}
                                                        dot={({ cx, cy, payload }) => (
                                                            <circle
                                                                cx={cx}
                                                                cy={cy}
                                                                r={5}
                                                                fill="#8884d8"
                                                                stroke="#fff"
                                                                strokeWidth={2}
                                                                onClick={() => areaChartClickHandler(payload)}
                                                                style={{ cursor: "pointer" }}
                                                            />
                                                        )}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>

                                        </div>

                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <h3 className="font-bold mb-2 text-black">Severity Analysis</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={severityData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        onClick={(entry) => pieChartClickHandler(entry)}
                                                    >
                                                        {severityData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <h3 className="font-bold mb-2 text-black">Assessment Area wise</h3>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={areaData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="count" fill="#82ca9d" onClick={data => barChartClickHandler(data)} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {
                                            filteredData.length > 0 ? (
                                                <div className="bg-white p-4 rounded-xl shadow col-span-3">
                                                    <h3 className="font-bold mb-2 text-purple-600">Selected Dataset</h3>
                                                    <FilteredTable data={filteredData} setUpdates={setSeverityUpdates} />
                                                </div>
                                            ) : (
                                                <p className="col-span-3 text-gray-500">No reports match the selected criteria.</p>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="w-[25%] h-full flex flex-col gap-3 justify-start">
                                <SeverityRadarChart data={filteredData} />
                                <SeverityIndex />
                                <div className="flex w-full items-center justify-end">
                                    <button
                                        onClick={updateSeverity}
                                        className="flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60 w-[170px] cursor-pointer mt-10"
                                        disabled={severityUpdateLaoding}
                                    >
                                        {severityUpdateLaoding ? (
                                            <ClipLoader size={20} color="#fff" />
                                        ) : (
                                            <>
                                                <MdSystemUpdateAlt size={20} />
                                                Update Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                }</>


            ) : (
                <p>Please select a batch to view reports.</p>
            )}
        </div>
    );
};

export default VulnerabilityDashboard;
