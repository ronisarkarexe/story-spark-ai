import { Helmet } from "react-helmet-async";

interface Props {
  title?: string;
  content?: string;
  imageURL?: string;
  postId?: string;
}

export const StoryMetaTags = ({ title, content, imageURL, postId }: Props) => {
  const description = (content || "").slice(0, 150);
  const url = `${window.location.origin}/post/${postId}`;
  const siteTitle = "Story Spark AI";
  const pageTitle = title ? `${title} – ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title || siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageURL || "https://storysparkai.vercel.app/og-image.jpg"} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageURL || "https://storysparkai.vercel.app/og-image.jpg"} />
    </Helmet>
  );
};