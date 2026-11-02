import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { LockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { driveService } from "@/services/driveService";
import SharedFileView from "@/components/files/SharedFileView";
import SharedFolderView from "@/components/folders/SharedFolderView";

const SharedWithMe = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    driveService.getPublicShare(token) // Usamos el servicio
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Unable to load shared item");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="size-7" />
          <span className="text-2xl font-medium text-slate-900">
            PAPR Cloud
          </span>
        </Link>
        <Link
          to="/login"
          className="text-xs font-semibold text-orange-600 hover:underline"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {/* Lógica condicional ultra limpia */}
        {isLoading ? (
          <div className="text-center space-y-3">
            <Spinner size="lg" className="text-orange-600" />
            <p className="text-sm text-slate-500 font-medium">Loading shared item...</p>
          </div>
        ) : error ? (
          <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
            <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <LockIcon className="size-6" />
            </div>
            <h3>Link Unavailable</h3>
            <p>{error}</p>
            <div className="pt-2">
              <Link to="/">
                <Button variant="secondary" size="sm">Go to Homepage</Button>
              </Link>
            </div>
          </div>
        ) : data?.resource_type === "file" ? (
          <SharedFileView data={data} />
        ) : (
          <SharedFolderView data={data} />
        )}
      </main>
    </div>
  );
};

export default SharedWithMe;
