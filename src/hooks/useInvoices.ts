import { useMutation, useQueryClient } from "@tanstack/react-query";
// FIX 1: Using clean relative path instead of problematic alias
import { generateTenantInvoiceAction } from "../app/actions/invoices";

export function useGenerateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    // FIX 2: Explicitly typecast or declare function boundary parameters safely
    mutationFn: async (variables: {
      tenantId: string;
      amount: string;
      dueDateStr: string;
    }) => {
      const res = await generateTenantInvoiceAction(variables);
      return res;
    },
    onSuccess: (res) => {
      // TypeScript now guarantees that res is typed correctly from the Server Action return structure
      if (
        res &&
        "success" in res &&
        res.success &&
        "checkoutUrl" in res &&
        res.checkoutUrl
      ) {
        window.open(res.checkoutUrl, "_blank");
      }
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
