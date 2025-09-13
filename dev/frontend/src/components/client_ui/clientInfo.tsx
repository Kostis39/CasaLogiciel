
export function ClientGrid({ fieldInfoClient}: { fieldInfoClient: { label: string; value: string }[] }) {
  return (
    <>
      {fieldInfoClient.map(({ label, value }) => (
        <div key={label} className="border p-4 rounded bg-white shadow">
          <strong className="block text-sm font-semibold text-gray-700">
            {label}
          </strong>
          <span className="text-base">{value}</span>
        </div>
      ))}
    </>
  );
}