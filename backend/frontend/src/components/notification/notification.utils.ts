export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return {
        icon: "fa-check",
        textColor: "text-green-300",
        bgColor: "bg-green-100",
      };
    case "error":
      return {
        icon: "fa-xmark",
        textColor: "text-red-300",
        bgColor: "bg-red-100",
      };
    case "info":
      return {
        icon: "fa-circle-info",
        textColor: "text-blue-300",
        bgColor: "bg-blue-100",
      };
    case "warning":
      return {
        icon: "fa-triangle-exclamation",
        textColor: "text-yellow-300",
        bgColor: "bg-yellow-100",
      };
    default:
      return {
        icon: "fa-bell",
        textColor: "text-gray-300",
        bgColor: "bg-gray-100",
      };
  }
};
