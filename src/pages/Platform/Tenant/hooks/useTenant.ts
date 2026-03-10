import { getTenantList, createTenant, updateTenant, deleteTenant } from '@/api/modules/platform'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useTenantList = getTenantList

export const useCreateTenant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantList'] })
    },
  })
}

export const useUpdateTenant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantList'] })
    },
  })
}

export const useDeleteTenant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantList'] })
    },
  })
}
