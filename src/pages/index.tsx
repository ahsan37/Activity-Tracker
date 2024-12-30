import LogActivity from './log-activity';
import Dashboard from './dashboard';

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="border border-[#1a237e] rounded-[10px] p-8">
                <div className="mb-8">
                    <LogActivity />
                </div>

                <div className="mb-8">
                    <Dashboard />
                </div>
            </div>
        </div>
    );
}
