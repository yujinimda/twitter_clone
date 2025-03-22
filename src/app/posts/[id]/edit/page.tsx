import PostEditForm from "../../../../../components/post/PostEditForm";

interface Props {
  params: { id: string };
}

export default function PostEdit({ params }: Props) {
  return <PostEditForm postId={params.id} />;
}