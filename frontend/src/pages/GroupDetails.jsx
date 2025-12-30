import { useUser } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { getMyRoleinGroup } from "../lib/api";

const GroupDetails = () => {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: myRoleData, isLoading } = useQuery({
    queryKey: ["role-in-group", id],
    queryFn: () => getMyRoleinGroup(id),
  });

  if (!isSignedIn) return <Navigate to="/" />;

  if (isLoading) return <div>Loading...</div>;

  if (!myRoleData?.canEnter) {
    return <Navigate to="/dashboard" />;
  }

  return <div>GroupDetails</div>;
};

export default GroupDetails;
