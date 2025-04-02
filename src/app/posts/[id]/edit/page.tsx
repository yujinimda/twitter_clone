import PostEditForm from "../../../../../components/post/PostEditForm";

interface Props {
  params: { id: string };
}

export default async function PostEdit({ params }: Props) {
  return <PostEditForm postId={params.id} />;
}