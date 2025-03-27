
import { supabase } from "@/integrations/supabase/client";
import { 
  checkIsAdmin,
  checkIsPharmacist,
  getUserRoles,
  addUserRole,
  removeUserRole,
  checkAdminExists,
  createInitialAdmin
} from "./roleUtils";
import {
  verifyPharmacy,
  getPharmacyVerificationStatus
} from "./pharmacyUtils";

// Re-export role utility functions
export {
  checkIsAdmin,
  checkIsPharmacist,
  getUserRoles,
  addUserRole,
  removeUserRole,
  checkAdminExists,
  createInitialAdmin
};

// Re-export pharmacy utility functions
export {
  verifyPharmacy,
  getPharmacyVerificationStatus
};
