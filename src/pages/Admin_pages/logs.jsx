import { useAdminStatistics } from '../../hooks/useAdminstatistics';

export default function AdminActivities() {
  const { activities } = useAdminStatistics();
  return (
    <div className="min-h-screen bg-color-background p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-color-surface mb-1">Recent Activities</h1>
        <p className="text-gray-400">Track all the latest actions and updates in your store</p>
      </div>

      {/* Activity Timeline */}
      <div className="bg-color-background border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-color-surface">Activity Timeline</h2>
        </div>
        <div className="p-6">
          <div className="mb-8 flex flex-col gap-5">
            {/* <div className="text-sm font-medium text-gray-500 mb-4 bg-gray-900 inline-block px-3 py-1 rounded">
              Nov 21
            </div> */}
            {activities?.map((act) => (
              <div key={act._id} className="space-y-4">
                <div className="flex-1 bg-gray-750 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-color-surface font-medium">{act.details}</span>
                    </div>
                    <span className="text-xs text-textMuted shrink-0">
                      {new Date(act.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
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
