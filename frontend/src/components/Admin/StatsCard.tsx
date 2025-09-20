import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
