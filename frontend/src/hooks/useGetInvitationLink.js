import React from "react";
import { createInvitationLink } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetInvitationLink = (id) => {
  const { data: inviteData, isLoading: isInviteLoading } = useQuery({
    queryKey: ["group-invite", id],
    queryFn: () => createInvitationLink(id),
  });
  return { inviteData, isInviteLoading };
};

export default useGetInvitationLink;
