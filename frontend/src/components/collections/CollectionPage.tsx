/* eslint-disable */
import React from "react";
import { useParams } from "react-router-dom";
import { useGetCollectionByIdQuery } from "../../redux/apis/collection.api";
import { getUserInfo } from "../../services/auth.service";
import LoadingAnimation from "../loading/loading.component";
import CollectionDetailCard from "./CollectionDetailCard";

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: collection, isLoading, isError } = useGetCollectionByIdQuery(id || "");
  const currentUser = getUserInfo();

  if (isLoading) return <LoadingAnimation />;
  if (isError || !collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1329] text-white">
        <span className="text-5xl mb-4">🔒</span>
        <h2 className="text-2xl font-bold mb-2">Collection not found</h2>
        <p className="text-slate-400">It may be private or does not exist.</p>
      </div>
    );
  }

  const isOwner = currentUser?.userId === (collection.ownerId as any)?._id?.toString()
    || currentUser?.userId === collection.ownerId?.toString();

  return <CollectionDetailCard collection={collection} isOwner={isOwner} />;
};

export default CollectionPage;
