import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { dpdpKeys } from "./dpdp.keys";

export interface DiscoverResponse {
  scan_id: string;
  domain: string;
  discovered_sitemap_url: string;
  discovered_privacy_policy_url: string;
  discovered_terms_url: string;
  discovered_trust_security_url: string;
}

export interface StartScanPayload {
  scan_id: string;
  target_url: string;
  confirmed_privacy_policy_url: string;
  confirmed_terms_url: string;
  confirmed_sitemap_url: string;
  confirmed_trust_security_url: string;
  confirmed_login_url: string;
  confirmed_register_url: string;
  app_type: string;
  data_retention_period: string;
  processes_children_data: boolean;
  processes_sensitive_data: boolean;
  has_login_or_user_management: boolean;
}

export interface ScanStatusResponse {
  scan_id: string;
  domain: string;
  stage: string;
  target_url: string;
  discovered_privacy_policy_url?: string;
  discovered_sitemap_url?: string;
  discovered_terms_url?: string;
  discovered_trust_security_url?: string;
  confirmed_privacy_policy_url?: string;
  confirmed_terms_url?: string;
  confirmed_sitemap_url?: string;
  confirmed_trust_security_url?: string;
  confirmed_login_url?: string;
  confirmed_register_url?: string;
  app_type: string;
  data_retention_period?: string;
  processes_children_data: boolean;
  processes_sensitive_data: boolean;
  has_login_or_user_management: boolean;
  ip: string;
  location: string;
  created_at: string;
  total_tokens_used?: number;
  error_message?: string;
  content?: any;
  report?: any;
}

export function useDPDPDiscover() {
  return useMutation<DiscoverResponse, Error, string>({
    mutationFn: async (url: string) => {
      const { data } = await axiosInstance.get(`/compliance/api/dpdp/discover`, {
        params: { url },
      });
      return data;
    },
  });
}

export function useDPDPStartScan() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, StartScanPayload>({
    mutationFn: async (payload: StartScanPayload) => {
      const { data } = await axiosInstance.post(`/compliance/api/dpdp/scan`, payload);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: dpdpKeys.scan(variables.scan_id) });
    },
  });
}

export function useDPDPGetScan(scanID: string) {
  return useQuery<ScanStatusResponse, Error>({
    queryKey: dpdpKeys.scan(scanID),
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/compliance/api/dpdp/scan/${scanID}`);
      return data;
    },
    enabled: !!scanID,
    refetchInterval: (query) => {
      const stage = query?.state?.data?.stage;
      if (!stage || stage === "COMPLETED" || stage.startsWith("ERROR_")) {
        return false;
      }
      return 10000; // Poll every 10 seconds
    },
  });
}
