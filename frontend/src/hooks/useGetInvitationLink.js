import React from "react";
import { createInvitationLink } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetInvitationLink = (id) => {
  const { data: inviteData } = useQuery({
    queryKey: ["group-invite", id],
    queryFn: () => createInvitationLink(id),
  });
  return { inviteData };
};

export default useGetInvitationLink;
