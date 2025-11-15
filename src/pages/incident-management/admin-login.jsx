export default function AdminLogin() {
    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full h-screen">
                <iframe
                    src="/wazuh/app/login"
                    className="w-full h-full border-0"
                    title="Wazuh Dashboard"
                />
            </div>
        </div>
    );
}
