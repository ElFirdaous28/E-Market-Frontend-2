import { useState, useEffect } from "react";
import { useAxios } from "../../hooks/useAxios";

export default function AdminActivities() {
  const axios = useAxios();

  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchActivities = async () => {
      const res = await axios.get("/users/getactivitie");
      console.log("activities", res.data.data);
      setActivities(res.data.data);
    };
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Recent Activities
        </h1>
        <p className="text-gray-400">
          Track all the latest actions and updates in your store
        </p>
      </div>

      {/* Activity Timeline */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Activity Timeline
          </h2>
        </div>
        <div className="p-6">
          {/* Nov 21 */}
          <div className="mb-8">
            {/* <div className="text-sm font-medium text-gray-500 mb-4 bg-gray-900 inline-block px-3 py-1 rounded">
              Nov 21
            </div> */}
            {activities?.map((act) => (
              <div className="space-y-4">
                <div className="flex-1 bg-gray-750 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">
                        {act.details}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {new Date(act.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
