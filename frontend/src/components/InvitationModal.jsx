import React, { useState } from "react";
import useGetInvitationLink from "../hooks/useGetInvitationLink";
import { X } from "lucide-react";

const InvitationModal = ({ id, setShowInviteLinkModal }) => {
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteData?.invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const { inviteData } = useGetInvitationLink(id);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Invitation Link</h2>
          <button
            onClick={() => setShowInviteLinkModal(false)}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Share this link with friends to invite them to the group
          </p>

          {/* Link Display */}
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border-2 border-gray-200 mb-4">
            <input
              type="text"
              value={inviteData?.invitationLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`btn btn-sm ${
                copied ? "btn-success" : "btn-primary"
              } text-white`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Success Message */}
          {copied && (
            <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Link copied to clipboard!</span>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Anyone with this link can join the group.
              Keep it private!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowInviteLinkModal(false)}
            className="btn btn-outline flex-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
