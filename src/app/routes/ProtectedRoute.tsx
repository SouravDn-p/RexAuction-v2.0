import { Outlet } from "react-router-dom";

/** Role checks are off for the mock prototype — every dashboard is visitable. */
const ProtectedRoute = () => <Outlet />;

export default ProtectedRoute;