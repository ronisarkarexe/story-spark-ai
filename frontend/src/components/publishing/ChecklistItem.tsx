import React from 'react';
export default function ChecklistItem({ item }: any) {
  return <div className="p-4 border mb-2 rounded bg-gray-50">{JSON.stringify(item)}</div>;
}
