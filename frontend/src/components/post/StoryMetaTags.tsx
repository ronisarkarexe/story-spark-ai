// import { Helmet } from "react-helmet-async";

interface Props {
  title?: string;
  content?: string;
  imageURL?: string;
  postId?: string;
}

export const StoryMetaTags = ({ title, content, imageURL, postId }: Props) => {
  const description = (content || "").slice(0, 150);
  const url = `${window.location.origin}/post/${postId}`;

  return (
    // <Helmet>
    //   <title>{title || "Story Spark AI"}</title>
    //   <meta property="og:title" content={title || "Story Spark AI"} />
    //   <meta property="og:description" content={description} />
    //   <meta property="og:image" content={imageURL || ""} />
    //   <meta property="og:url" content={url} />
    //   <meta property="og:type" content="article" />
    //   <meta name="twitter:card" content="summary_large_image" />
    //   <meta name="twitter:title" content={title || "Story Spark AI"} />
    //   <meta name="twitter:description" content={description} />
    //   <meta name="twitter:image" content={imageURL || ""} />
    // </Helmet>
    <></>
  );
};