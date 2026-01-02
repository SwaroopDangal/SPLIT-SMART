import React from "react";
import { addExpense } from "../lib/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useAddExpense = (setShowAddExpenseModal) => {
  const { mutate, isPending } = useMutation({
    mutationFn: addExpense,
    onSuccess: (data) => {
      toast.success("Expense added successfully");
      setShowAddExpenseModal(false);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  return { addExpenseMutation: mutate, isPending };
};

export default useAddExpense;
