import { useState } from "react";
import { useGetPostListsQuery } from "../../redux/apis/post.api";
import BookShelf, { IBookStory } from "./BookShelf";

export default function BookShelfPage() {
  const [page] = useState(1);

  const { data, isLoading } = useGetPostListsQuery({
    page,
    limit: 50,
  });

  const stories: IBookStory[] = (data?.posts || []).map((post: any) => ({
    uuid: post._id || post.uuid,
    title: post.title,
    content: post.content,
    tag: post.tag,
    imageURL: post.imageURL,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4 animate-bounce">📚</p>
          <p className="text-amber-400 animate-pulse text-lg">Loading your bookshelf...</p>
        </div>
      </div>
    );
  }

  return <BookShelf stories={stories} />;
}