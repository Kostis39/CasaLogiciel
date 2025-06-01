// app/client/@aside/default.tsx
export default function AsideDefault({
  search,
  list,
}: {
  search: React.ReactNode;
  list: React.ReactNode;
}) {
  return (
    <div>
      <div>{search}</div>
      <div>{list}</div>
    </div>
  );
}