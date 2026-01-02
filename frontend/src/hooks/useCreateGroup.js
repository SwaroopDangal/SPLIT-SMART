import React from "react";
import { createGroup } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: groupCreationMutation, isPending } = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      toast.success("Group created successfully");
      navigate(`/group/${data._id}`);
      queryClient.invalidateQueries(["groups"]);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  return { groupCreationMutation, isPending };
};

export default useCreateGroup;
