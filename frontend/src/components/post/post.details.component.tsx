import React from "react";
import { useParams } from "react-router-dom";
import {
  useGetPostByIdQuery,
  useGetPostByTagQuery,
} from "../../redux/apis/post.api";
import RelatedStoriesComponent from "./related.stories.view.component";
import PostCommentComponent from "./post.comment.component";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../loading/loading.component";
import SSProfile from "../ui-component/ss-profile/ss-profile";
import { formatDateShort } from "../../utils/time-formate";
import { getUserInfo } from "../../services/auth.service";
import { useToggleReactionMutation } from "../../redux/apis/reaction.api";
import { toast } from "react-hot-toast";

const PostDetailsComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostByIdQuery(id || "");
  const tag = post?.tag;
  const { data: relatedPost } = useGetPostByTagQuery(tag || "");
  const [toggleReaction] = useToggleReactionMutation();
  const currentUser = getUserInfo();

  const handleLike = async () => {
    if (!id) return;
    try {
      await toggleReaction({ postId: id }).unwrap();
    } catch (error) {
      console.error("Failed to toggle reaction", error);
      toast.error("You need to login to perform this action");
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-6 flex justify-between">
          <div
            onClick={() => navigate(-1)}
            className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded"
          >
            <i className="fa-solid fa-left-long"></i> BACK
          </div>

          <div className=""></div>
        </div>
        <div className="rounded-lg shadow-sm bg-blue-500/10 mb-10">
          <div className="p-8">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4 mb-6">
                <SSProfile
                  name={post?.author.name as string}
                  size="h-12 w-12"
                />
                <div>
                  <h3 className="font-medium text-gray-400">
                    {post?.author.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatDateShort(post ? post?.createdAt : "")}</span>
                  </div>
                </div>
              </div>
              <div className="">
                <button className="mt-2 rounded bg-blue-500/30 text-gray-300 px-4 py-1 text-sm">
                  Follow
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-300 mb-6">
              {post?.title}
            </h1>

            <div className="mb-12">
              <img
                src={post?.imageURL}
                alt={post?.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>

            <div className="prose max-w-none mb-12 text-gray-400">
              <p>{post?.content}</p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-gray-500 py-4 mb-12">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                    post?.reactions?.some((r: any) => r.userId?.email === currentUser?.email)
                      ? "text-red-500 hover:text-red-400"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  <i className={`${post?.reactions?.some((r: any) => r.userId?.email === currentUser?.email) ? 'fas' : 'far'} fa-heart`}></i>
                  <span>{post?.likesCount}</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-custom">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="text-gray-600 hover:text-custom">
                  <i className="fab fa-linkedin"></i>
                </button>
                <button className="text-gray-600 hover:text-custom">
                  <i className="far fa-envelope"></i>
                </button>
              </div>
            </div>

            {id && (
              <div className="mb-12">
                <PostCommentComponent postId={id} />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Related Stories
              </h3>
              <RelatedStoriesComponent posts={relatedPost || []} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[-200px] left-[250px] w-[800px] h-[350px] bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default PostDetailsComponent;
