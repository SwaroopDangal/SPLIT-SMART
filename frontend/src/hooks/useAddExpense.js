import React from "react";
import { addExpense } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useAddExpense = (setShowAddExpenseModal, id) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      toast.success("Expense added successfully");
      setShowAddExpenseModal(false);
      queryClient.invalidateQueries(["expense-info", id]);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  return { addExpenseMutation: mutate, isPending };
};

export default useAddExpense;
