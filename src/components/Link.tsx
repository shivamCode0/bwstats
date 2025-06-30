import Link from "next/link";

const MyLink: typeof Link = ((props: any) => {
  // defaults prefetch to false if `prefetch` is not true
  return <Link {...props} prefetch={props.prefetch ?? false} />;
}) as any;

export default MyLink;
