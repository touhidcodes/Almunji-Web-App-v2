import {
  Activity,
  Bell,
  BookOpen,
  Clock,
  Download,
  Eye,
  Globe,
  Heart,
  MessageSquare,
  Settings,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

const AlMunjiAdmin = () => {
  const monthlyData = [
    { month: "Jan", users: 2400, readings: 12500 },
    { month: "Feb", users: 1398, readings: 10200 },
    { month: "Mar", users: 9800, readings: 45000 },
    { month: "Apr", users: 3908, readings: 22000 },
    { month: "May", users: 4800, readings: 28000 },
    { month: "Jun", users: 3800, readings: 24000 },
  ];

  const surahData = [
    { name: "Al-Baqarah", value: 1200, color: "#10b981" },
    { name: "Ya-Sin", value: 980, color: "#06b6d4" },
    { name: "Al-Kahf", value: 850, color: "#8b5cf6" },
    { name: "Al-Mulk", value: 720, color: "#f59e0b" },
  ];

  const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p
            className={`text-sm mt-1 flex items-center ${
              changeType === "positive" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleLineChart = ({ data }) => (
    <div className="h-64 relative">
      <svg className="w-full h-64" viewBox="0 0 400 200">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="50"
            y1={40 + i * 30}
            x2="350"
            y2={40 + i * 30}
            stroke="#f0f0f0"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={monthlyData
            .map((d, i) => `${50 + i * 50},${170 - d.readings / 500}`)
            .join(" ")}
        />
        {monthlyData.map((d, i) => (
          <circle
            key={i}
            cx={50 + i * 50}
            cy={170 - d.readings / 500}
            r="4"
            fill="#10b981"
          />
        ))}
        {monthlyData.map((d, i) => (
          <text
            key={i}
            x={50 + i * 50}
            y="190"
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );

  const SimpleBarChart = ({ data }) => (
    <div className="h-64 relative">
      <svg className="w-full h-64" viewBox="0 0 400 200">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="50"
            y1={40 + i * 30}
            x2="350"
            y2={40 + i * 30}
            stroke="#f0f0f0"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        ))}
        {monthlyData.map((d, i) => (
          <rect
            key={i}
            x={40 + i * 50}
            y={170 - d.users / 100}
            width="20"
            height={d.users / 100}
            fill="#06b6d4"
            rx="2"
          />
        ))}
        {monthlyData.map((d, i) => (
          <text
            key={i}
            x={50 + i * 50}
            y="190"
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );

  const SimplePieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let angle = 0;
    return (
      <div className="flex justify-center">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="30"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
          />
          {data.map((item, idx) => {
            const slice = (item.value / total) * 360;
            const start = angle;
            angle += slice;
            const x1 = 80 + 30 * Math.cos(((start - 90) * Math.PI) / 180);
            const y1 = 80 + 30 * Math.sin(((start - 90) * Math.PI) / 180);
            const x2 =
              80 + 30 * Math.cos(((start + slice - 90) * Math.PI) / 180);
            const y2 =
              80 + 30 * Math.sin(((start + slice - 90) * Math.PI) / 180);
            const large = slice > 180 ? 1 : 0;
            return (
              <path
                key={idx}
                d={`M 80 80 L ${x1} ${y1} A 30 30 0 ${large} 1 ${x2} ${y2} Z`}
                fill={item.color}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Al-Munji Admin
                </h1>
                <p className="text-sm text-gray-600">Dashboard Overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Admin Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with Al-Munji today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value="45,239"
            change="+12.5%"
            changeType="positive"
          />
          <StatCard
            icon={BookOpen}
            title="Total Readings"
            value="156,543"
            change="+18.2%"
            changeType="positive"
          />
          <StatCard
            icon={Heart}
            title="Bookmarks Created"
            value="23,847"
            change="+8.1%"
            changeType="positive"
          />
          <StatCard
            icon={Activity}
            title="Active Today"
            value="3,542"
            change="+5.4%"
            changeType="positive"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reading Activity
            </h3>
            <SimpleLineChart data={monthlyData} />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Growth
            </h3>
            <SimpleBarChart data={monthlyData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Most Read Surahs
            </h3>
            <SimplePieChart data={surahData} />
            <div className="mt-4 space-y-2">
              {surahData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Platform Activities
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New user registration
                  </p>
                  <p className="text-xs text-gray-500">
                    Ahmed Khan registered from Bangladesh
                  </p>
                </div>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Surah completion
                  </p>
                  <p className="text-xs text-gray-500">
                    User completed reading Surah Al-Kahf
                  </p>
                </div>
                <span className="text-xs text-gray-400">12m ago</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Bookmark milestone
                  </p>
                  <p className="text-xs text-gray-500">
                    23,000+ bookmarks created this month
                  </p>
                </div>
                <span className="text-xs text-gray-400">1h ago</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New feedback received
                  </p>
                  <p className="text-xs text-gray-500">
                    User feedback: "Love the dark mode feature!"
                  </p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Globe className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New translation added
                  </p>
                  <p className="text-xs text-gray-500">
                    Bengali translation now available
                  </p>
                </div>
                <span className="text-xs text-gray-400">3h ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Download className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Export Report</p>
                <p className="text-xs text-gray-600">Download analytics</p>
              </div>
            </div>
          </button>
          <button className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">User Analytics</p>
                <p className="text-xs text-gray-600">View detailed stats</p>
              </div>
            </div>
          </button>
          <button className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Activity Logs</p>
                <p className="text-xs text-gray-600">View system logs</p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AlMunjiAdmin;
