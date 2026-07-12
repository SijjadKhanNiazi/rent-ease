import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPropertyAction,
  getPropertiesAction,
} from "@/app/actions/properties";

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: { name: string; address: string }) => {
      const result = await createPropertyAction(formData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      // Invalidate the cache to trigger a silent background refetch
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  }); ///
}
export function useGetProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const result = await getPropertiesAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data ?? [];
    },
  });
}
