import { useState } from "react";
import { useValue } from "../context/ValueContext";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import SaveResults from "./SaveResults";

interface Value {
  name: string;
  description: string;
}

const SortableItem = ({ value }: { value: Value }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: value.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-border rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow select-none"
    >
      <p className="font-semibold text-text">{value.name}</p>
      <p className="text-sm text-text-muted">{value.description}</p>
    </div>
  );
};

const DroppableColumn = ({ id, children, className }: { id: string; children: ReactNode; className: string }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={className}>
      {children}
    </div>
  );
};

const ValueReview = () => {
  const { topValues } = useValue();
  const [available, setAvailable] = useState<Value[]>(topValues);
  const [chosen, setChosen] = useState<Value[]>([]);
  const [activeValue, setActiveValue] = useState<Value | null>(null);
  const MAX = 6;

  function findContainer(id: string): "available" | "chosen" | null {
    if (available.find((v) => v.name === id)) return "available";
    if (chosen.find((v) => v.name === id)) return "chosen";
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const value =
      available.find((v) => v.name === id) ||
      chosen.find((v) => v.name === id) ||
      null;
    setActiveValue(value);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) ?? (overId === "chosen" ? "chosen" : "available");

    if (!activeContainer || activeContainer === overContainer) return;

    if (activeContainer === "available" && overContainer === "chosen") {
      if (chosen.length >= MAX) return;
      const item = available.find((v) => v.name === activeId)!;
      setAvailable((prev) => prev.filter((v) => v.name !== activeId));
      setChosen((prev) => [...prev, item]);
    }

    if (activeContainer === "chosen" && overContainer === "available") {
      const item = chosen.find((v) => v.name === activeId)!;
      setChosen((prev) => prev.filter((v) => v.name !== activeId));
      setAvailable((prev) => [...prev, item]);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveValue(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const container = findContainer(activeId);

    if (container === "chosen") {
      const oldIndex = chosen.findIndex((v) => v.name === activeId);
      const newIndex = chosen.findIndex((v) => v.name === overId);
      if (oldIndex !== newIndex && newIndex !== -1) {
        setChosen(arrayMove(chosen, oldIndex, newIndex));
      }
    }

    if (container === "available") {
      const oldIndex = available.findIndex((v) => v.name === activeId);
      const newIndex = available.findIndex((v) => v.name === overId);
      if (oldIndex !== newIndex && newIndex !== -1) {
        setAvailable(arrayMove(available, oldIndex, newIndex));
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-4 w-full max-w-3xl">

        {/* Left — all top values */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold text-text text-lg mb-1">Dina värderingar</h2>
          <p className="text-sm text-text-muted mb-2">Dra över dina 6 viktigaste</p>
          <SortableContext
            items={available.map((v) => v.name)}
            strategy={verticalListSortingStrategy}
          >
            <DroppableColumn
              id="available"
              className="flex flex-col gap-2 min-h-24"
            >
              {available.map((value) => (
                <SortableItem key={value.name} value={value} />
              ))}
            </DroppableColumn>
          </SortableContext>
        </div>

        {/* Right — chosen values (max 6) */}
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="font-bold text-text text-lg mb-1">
            Mina topp 6
            <span className="text-sm font-normal text-text-muted ml-2">
              ({chosen.length}/6)
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-2">Du kan även sortera ordningen här</p>
          <SortableContext
            items={chosen.map((v) => v.name)}
            strategy={verticalListSortingStrategy}
          >
            <DroppableColumn
              id="chosen"
              className={`flex flex-col gap-2 min-h-64 rounded-xl border-2 border-dashed p-2 transition-colors ${
                chosen.length >= MAX
                  ? "border-primary-400 bg-primary-50"
                  : "border-neutral-300 bg-neutral-50"
              }`}
            >
              {chosen.length === 0 && (
                <p className="text-neutral-400 text-sm text-center mt-8">
                  Dra hit dina viktigaste värderingar
                </p>
              )}
              {chosen.map((value) => (
                <SortableItem key={value.name} value={value} />
              ))}
              {chosen.length >= MAX && (
                <p className="text-primary-600 text-sm text-center font-medium mt-1">
                  Listan är full — ta bort en för att lägga till en annan
                </p>
              )}
            </DroppableColumn>
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeValue && (
          <div className="bg-white border border-primary-400 rounded-xl px-4 py-3 shadow-lg">
            <p className="font-semibold text-text">{activeValue.name}</p>
            <p className="text-sm text-text-muted">{activeValue.description}</p>
          </div>
        )}
      </DragOverlay>
      <SaveResults/>
    </DndContext>
  );
};

export default ValueReview;