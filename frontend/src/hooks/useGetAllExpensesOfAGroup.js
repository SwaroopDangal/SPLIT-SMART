import React from "react";
import { getAllExpensesOfAGroup } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllExpensesOfAGroup = (id) => {
  const { data: groupExpenseData, isLoading: isGroupExpenseLoading } = useQuery(
    {
      queryKey: ["expense-info", id],
      queryFn: () => getAllExpensesOfAGroup(id),
    }
  );
  return { groupExpenseData, isGroupExpenseLoading };
};

export default useGetAllExpensesOfAGroup;
