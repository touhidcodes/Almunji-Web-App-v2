import {
  Activity,
  Bell,
  Calendar,
  DollarSign,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";

const AdminOverviewPage = () => {
  // Sample data for charts
  const monthlyData = [
    { month: "Jan", revenue: 4000, users: 240 },
    { month: "Feb", revenue: 3000, users: 139 },
    { month: "Mar", revenue: 5000, users: 980 },
    { month: "Apr", revenue: 4500, users: 390 },
    { month: "May", revenue: 6000, users: 480 },
    { month: "Jun", revenue: 5500, users: 380 },
  ];

  const categoryData = [
    { name: "Technology", value: 400, color: "#8b5cf6" },
    { name: "Marketing", value: 300, color: "#06b6d4" },
    { name: "Sales", value: 300, color: "#10b981" },
    { name: "Support", value: 200, color: "#f59e0b" },
  ];

  // Fixed type definition
  type StatCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    change: string; // Fixed: was incorrectly defined as function
    changeType: string;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    changeType,
  }: StatCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p
            className={`text-sm mt-1 flex items-center ${
              changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>
  );

  // Simple chart components without recharts dependency
  const SimpleLineChart = ({ data }: { data: typeof monthlyData }) => (
    <div className="h-300 relative">
      <svg className="w-full h-64" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
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

        {/* Data points and line */}
        <polyline
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="3"
          points={data
            .map((d, i) => `${50 + i * 50},${170 - d.revenue / 100}`)
            .join(" ")}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={50 + i * 50}
            cy={170 - d.revenue / 100}
            r="4"
            fill="#8b5cf6"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => (
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

  const SimpleBarChart = ({ data }: { data: typeof monthlyData }) => (
    <div className="h-300 relative">
      <svg className="w-full h-64" viewBox="0 0 400 200">
        {/* Grid lines */}
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

        {/* Bars */}
        {data.map((d, i) => (
          <rect
            key={i}
            x={40 + i * 50}
            y={170 - d.users / 10}
            width="20"
            height={d.users / 10}
            fill="#06b6d4"
            rx="2"
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => (
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

  const SimplePieChart = ({ data }: { data: typeof categoryData }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

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
          {data.map((item, index) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = 80 + 30 * Math.cos(((startAngle - 90) * Math.PI) / 180);
            const y1 = 80 + 30 * Math.sin(((startAngle - 90) * Math.PI) / 180);
            const x2 =
              80 + 30 * Math.cos(((startAngle + angle - 90) * Math.PI) / 180);
            const y2 =
              80 + 30 * Math.sin(((startAngle + angle - 90) * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 80 80 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Overview Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value="$54,239"
            change="+12.5%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="Active Users"
            value="2,543"
            change="+5.2%"
            changeType="positive"
          />
          <StatCard
            icon={ShoppingCart}
            title="Orders"
            value="1,423"
            change="+3.1%"
            changeType="positive"
          />
          <StatCard
            icon={Activity}
            title="Conversion Rate"
            value="3.24%"
            change="-0.4%"
            changeType="negative"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue Trends
            </h3>
            <SimpleLineChart data={monthlyData} />
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Growth
            </h3>
            <SimpleBarChart data={monthlyData} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Category Distribution
            </h3>
            <SimplePieChart data={categoryData} />
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New user registration
                  </p>
                  <p className="text-xs text-gray-500">
                    John Doe registered 5 minutes ago
                  </p>
                </div>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Order completed
                  </p>
                  <p className="text-xs text-gray-500">
                    Order #1234 has been shipped
                  </p>
                </div>
                <span className="text-xs text-gray-400">12m ago</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Payment received
                  </p>
                  <p className="text-xs text-gray-500">
                    $2,450 payment from client ABC Corp
                  </p>
                </div>
                <span className="text-xs text-gray-400">1h ago</span>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Meeting scheduled
                  </p>
                  <p className="text-xs text-gray-500">
                    Team standup tomorrow at 9:00 AM
                  </p>
                </div>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
