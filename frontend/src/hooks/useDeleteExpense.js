import React from "react";
import { deleteExpense } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useDeleteExpense = ({ id, groupId }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteExpenseMutation, isPending: isDeleteExpensePending } =
    useMutation({
      mutationKey: ["delete-expense", id],
      mutationFn: () => deleteExpense(id),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["expense-info", groupId],
        });
      },
      onError: (error) => toast.error(error.response.data.message),
    });
  return { deleteExpenseMutation, isDeleteExpensePending };
};

export default useDeleteExpense;
