import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { settleAllExpensesOfAGroup } from "../lib/api";
import toast from "react-hot-toast";

const useSettleAllExpensesOfAGroup = (groupId) => {
  const queryClient = useQueryClient();
  const { mutate: settleExpensesMutation, isPending: isSettleExpensesPending } =
    useMutation({
      mutationKey: ["settle-expense", groupId],
      mutationFn: () => settleAllExpensesOfAGroup(groupId),
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: ["expense-info", groupId],
        });
      },
      onError: (error) => toast.error(error.response.data.message),
    });
  return { settleExpensesMutation, isSettleExpensesPending };
};

export default useSettleAllExpensesOfAGroup;
