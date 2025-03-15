
import Postbox from "../../components/post/PostBox";
import PostForm from "../../components/post/PostForm";

export interface PostProps {
  id: string;
  email: string;
  content: string;
  createdAt: string;
  uid: string;
  profileUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

const posts: PostProps[] = [
  {
    id:"1",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"2",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"3",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"4",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"5",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
  {
    id:"6",
    email:"zini@email.com",
    content:"내용입니다",
    createdAt:"2025-03-15",
    uid:"123123"
  },
]


export default function Home() {

  return (
    <div className='home'>
      <div className='home__title'>Home</div>
      <div className="home__tabs">
        <div className='home__tab home__tab--active'>For You</div>
        <div className='home__tab'>Following</div>
      </div>
      <PostForm/>
      {/* Tweet posts */}
      <div className='post'>
        {posts?.map((post) => (
          <Postbox key={post.id} post={post}/>
        ))}
      </div>
    </div>
  );
}