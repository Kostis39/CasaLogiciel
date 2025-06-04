export default function AsideDefault({
    search,
    list,
}: {
  search: React.ReactNode;
  list: React.ReactNode;
}) {
  return (
    <div>
    {search}
    {list}
    </div>
  );
}