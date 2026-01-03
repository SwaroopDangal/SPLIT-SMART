import { getGroupExpensesAndSettlements } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetGroupExpensesAndSettlements = (id) => {
  const { data: groupBalanceData, isLoading: isGroupBalnceLoading } = useQuery({
    queryKey: ["expense-and-settlement-info", id],
    queryFn: () => getGroupExpensesAndSettlements(id),
  });
  return { groupBalanceData, isGroupBalnceLoading };
};

export default useGetGroupExpensesAndSettlements;
