export type AppUserRole = "user" | "super_admin";

export type AppAuthUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  role?: AppUserRole;
};

const SUPER_ADMIN_EMAIL = "admin@gmail.com";

export function isSuperAdminUser(user?: Pick<AppAuthUser, "email" | "role"> | null) {
  if (!user) return false;
  return user.role === "super_admin" || user.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
}
