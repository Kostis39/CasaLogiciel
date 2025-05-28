
export default function AsideLayout({
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