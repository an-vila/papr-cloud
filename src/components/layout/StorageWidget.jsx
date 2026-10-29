import { useApp } from "@/context/AppContext";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatBytes } from "@/assets/assets";

export const StorageWidget = () => {
  const { user } = useApp();

  const storage_used = Number(user?.storage_used ?? 0);
  const storage_limit = Number(user?.storage_limit ?? 1073741824);
  const used_percentage = Math.min(
    100,
    Math.round((storage_used / storage_limit) * 100)
  );

  return (
    <div className="p-4 border-t border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-600 font-medium">Storage</span>
        <span className="text-slate-900 font-semibold">{used_percentage}%</span>
      </div>

      <ProgressBar
        progress={used_percentage}
        color={
          used_percentage > 90
            ? "bg-red-600"
            : used_percentage > 75
              ? "bg-amber-500"
              : "bg-orange-600"
        }
      />

      <p className="text-[12px] text-slate-500 mt-2">
        {formatBytes(storage_used)} of {formatBytes(storage_limit)} used
      </p>
    </div>
  );
};
