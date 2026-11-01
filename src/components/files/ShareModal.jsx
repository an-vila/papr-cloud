import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Loader2Icon } from "lucide-react";
import { Button } from "../ui/Button";
import { useCallback } from "react";
import { Input } from "../ui/Input";
import { CheckIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import { CopyIcon } from "lucide-react";
import { useEffect } from "react";
import { driveService } from "@/services/driveService";

const ShareModal = ({ item, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareLinkId, setShareLinkId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOrCreateShareLink = useCallback(async () => {
    setIsLoading(true);

    try {
      const type = item.item_type === "folder" ? "folder" : "file";
      const { data } = await driveService.createShareLink(type, item.id);
      const link = data.share_link;

      if (link?.token) {
        const fullUrl = `${window.location.origin}/s/${link.token}`;
        setGeneratedLink(fullUrl);
        setShareLinkId(link.id);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error generating share link.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [item]);

  useEffect(() => {
    if (isOpen && item) {
      setCopied(false);
      setGeneratedLink("");
      setShareLinkId(null);
      getOrCreateShareLink();
    }
  }, [isOpen, item, getOrCreateShareLink]);

  const copyToClipboard = () => {
    if (!generatedLink) return;

    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteShareLink = async () => {
    if (!shareLinkId) return;

    try {
      await driveService.deleteShareLink(shareLinkId);
      toast.success("Share link deleted.");
      setGeneratedLink("");
      setShareLinkId(null);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting share link.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${item?.name}"`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/60">
          <div>
            <p className="text-xs font-medium text-slate-800">
              Anyone with this link
            </p>
            <p className="text-[11px] text-slate-500">
              can view and download this{" "}
              {item?.item_type === "folder" ? "folder" : "file"}
            </p>
          </div>

          {isLoading ? (
            <div className="py-6 flex flex-col items-center justifyjustify-center gap-2 text-slate-500">
              <Loader2Icon className="size-5 animate-spin text-orange-600" />
              <span className="text-xs font-medium">
                Generating share link...
              </span>
            </div>
          ) : generatedLink ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">
                  Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="bg-slate-50 text-xs text-slate-700 select-all"
                  />
                  <Button
                    variant="primary"
                    className="shrink-0"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="size-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="size-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-slate-500 flex items-center justify-end gap-2">
                <span className="text-xs">Want to revoke access?</span>
                <XIcon
                  onClick={handleDeleteShareLink}
                  className="size-4 hover:text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <Button
                variant="primary"
                onClick={getOrCreateShareLink}
                isLoading={isLoading}
              >
                Generate Share Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
