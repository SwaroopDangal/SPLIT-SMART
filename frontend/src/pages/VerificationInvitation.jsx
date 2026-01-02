import React, { useEffect } from "react";
import { verifyInvitationLink } from "../lib/api";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2, Link2 } from "lucide-react";

const VerificationInvitation = () => {
  const { groupId, token } = useParams();
  const Navigate = useNavigate();
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["verify-invitation", groupId, token],
    queryFn: () => verifyInvitationLink(groupId, token),
  });
  useEffect(() => {
    if (isError) {
      toast.error(error.response.data.message);
      Navigate("/dashboard");
    }
  }, [isError, error]);
  useEffect(() => {
    if (isSuccess) {
      toast.success("You have been added to the group!");
      Navigate(`/group/${groupId}`);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <Link2 className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Verifying Invitation
        </h2>

        <p className="text-sm text-gray-500 text-center max-w-xs">
          Please wait while we verify your invitation link.
        </p>
      </div>
    </div>
  );
};

export default VerificationInvitation;
