"use client";

import CollectionCard from "@/components/collections/CollectionCard";
import type { CollectionsController } from "@/hooks/useCollections";

interface CollectionsListProps {
  controller: CollectionsController;
}

export default function CollectionsList({ controller }: CollectionsListProps) {
  return (
    <section className="grid gap-4">
      {controller.collections.map((collection, index) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          index={index}
          onDeleteCollection={controller.deleteCollection}
          onDeleteRequest={controller.deleteRequest}
          onRunRequest={controller.runRequest}
        />
      ))}
    </section>
  );
}
