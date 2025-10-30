export default function LoadingSpinner({
  className = "",
  small = false,
  color = "black",
}: {
  className?: string;
  small?: boolean;
  color?: "black" | "white";
}) {
  const size = small ? "h-5 w-5 border-t-2 border-b-2" : "h-16 w-16 border-t-4 border-b-4";
  const container = small ? "h-auto" : "h-96";
  const colorClass = color === "white" ? "border-white" : "border-black";

  return (
    <div className={`flex justify-center items-center ${container} ${className}`}>
      <div className={`animate-spin rounded-full ${size} ${colorClass} border-t-transparent`}></div>
    </div>
  );
}



