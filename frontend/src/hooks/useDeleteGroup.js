import React from "react";
import { deleteGroup } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";


const useDeleteGroup = (id) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: deleteGroupMutation } = useMutation({
    mutationKey: ["delete-group", id],
    mutationFn: () => deleteGroup(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      navigate(`/dashboard`);
    },
    onError: (error) => toast.error(error.response.data.message),
  });
  return { deleteGroupMutation };
};

export default useDeleteGroup;
