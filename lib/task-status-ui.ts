export function statusColor(status: string) {
  switch (status) {
    case "TODO":
      return "border-gray-400 text-gray-600";
    case "IN_PROGRESS":
      return "border-blue-500 text-blue-600";
    case "DEV_COMPLETED":
      return "border-indigo-500 text-indigo-600";
    case "IN_TESTING":
      return "border-yellow-500 text-yellow-600";
    case "DEV_DEPLOYED":
      return "border-purple-500 text-purple-600";
    case "STAGE_DEPLOYED":
      return "border-orange-500 text-orange-600";
    case "PROD_DEPLOYED":
      return "border-green-600 text-green-700";
    default:
      return "";
  }
}
