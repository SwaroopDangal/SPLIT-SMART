import React, { useEffect } from "react";
import { verifyInvitationLink } from "../lib/api";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const VerificationInvitation = () => {
  const { groupId, token } = useParams();
  const Navigate = useNavigate();
  console.log(groupId, token);
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

  return <div>VerificationInvitation</div>;
};

export default VerificationInvitation;
