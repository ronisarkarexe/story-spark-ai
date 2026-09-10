import React from 'react';
export default function RepetitionCard({ issue }: any) {
  return <div className="p-4 border mb-2 rounded bg-gray-50">{JSON.stringify(issue)}</div>;
}
